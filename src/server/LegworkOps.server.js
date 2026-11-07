// Every write the Legwork agents make goes through this class, so every created
// record is registered and the Clear demo data button can remove it again.
var LegworkOps = Class.create();
LegworkOps.prototype = {
  initialize: function () {},

  // Demo defaults, not tuned on recorded footage. Overstride is ankle separation
  // divided by torso length; trunk lean is degrees from vertical.
  LIMITS: { overstride: 1.1, cadence: 165, trunkLean: 15 },

  EXPOSURE: {
    overstride: 'Overstride raises braking force at foot strike and loads the shin and knee.',
    cadence: 'Low cadence lengthens ground contact and raises impact load per stride.',
    trunkLean: 'Excess trunk lean shifts load to the lower back and hip flexors.'
  },

  DRILLS: {
    overstride: [
      'Run 4 x 30 s at +5 percent cadence with a metronome, landing under the hips.',
      'Short-stride hill repeats: 6 x 20 s focusing on quick, low steps.'
    ],
    cadence: [
      'Metronome run: 10 minutes at the target step rate, then 5 minutes free.',
      'Quick-feet ladder drill, 3 sets of 20 m.'
    ],
    trunkLean: [
      'Wall posture drill: 3 x 30 s tall stance, then run 1 minute holding it.',
      'Core stability circuit: planks and dead bugs, 3 rounds.'
    ]
  },

  NAMES: { overstride: 'stride too long', cadence: 'step rate too low', trunkLean: 'leaning too far forward' },

  _names: function (keys) {
    return keys.map(function (k) { return this.NAMES[k] || k; }, this);
  },

  _run: function (runId) {
    var gr = new GlideRecord('x_snc_legwork_run');
    if (!gr.get(runId)) throw 'Legwork run not found: ' + runId;
    return gr;
  },

  _log: function (run, step, status, text) {
    var lines = (run.getValue('agent_log') || '').split('\n').filter(String);
    lines.push(JSON.stringify({ step: step, status: status, text: text, t: new GlideDateTime().getValue() }));
    run.setValue('agent_log', lines.join('\n'));
    run.setValue('step_count', lines.length);
    run.update();
  },

  _register: function (run, table, sysId, label) {
    var reg = new GlideRecord('x_snc_legwork_created');
    reg.initialize();
    reg.setValue('label', label);
    reg.setValue('target_table', table);
    reg.setValue('target_id', sysId);
    reg.setValue('run', run.getUniqueValue());
    reg.insert();
  },

  _breaches: function (run) {
    var out = [];
    var o = parseFloat(run.getValue('overstride')) || 0;
    var c = parseFloat(run.getValue('cadence')) || 0;
    var t = parseFloat(run.getValue('trunk_lean')) || 0;
    if (o > this.LIMITS.overstride) out.push('overstride');
    if (c > 0 && c < this.LIMITS.cadence) out.push('cadence');
    if (t > this.LIMITS.trunkLean) out.push('trunkLean');
    return out;
  },

  _openAssessmentFor: function (run) {
    // The runner's earlier run that opened an assessment still in progress.
    var prev = new GlideRecord('x_snc_legwork_run');
    prev.addQuery('runner', run.getValue('runner'));
    prev.addQuery('sys_id', '!=', run.getUniqueValue());
    prev.addQuery('state', 'assessed');
    // A dry run has no assessment record but still counts as the baseline.
    prev.addEncodedQuery('assessmentISNOTEMPTY^ORbreachesISNOTEMPTY');
    prev.orderByDesc('sys_created_on');
    prev.setLimit(1);
    prev.query();
    return prev.next() ? prev : null;
  },

  // Tool 1: measure and open (or find) the risk assessment.
  assessRun: function (runId) {
    var run = this._run(runId);
    var dry = run.getValue('dry_run') == '1';
    if (run.getValue('state') != 'scored') {
      return { result: 'already_processed', breaches: (run.getValue('breaches') || '').split(',').filter(String), assessmentId: run.getValue('assessment') };
    }
    var breaches = this._breaches(run);
    run.setValue('breaches', breaches.join(','));
    var earlier = this._openAssessmentFor(run);

    if (!breaches.length && !earlier) {
      run.setValue('state', 'clear');
      run.update();
      this._log(run, 'assess', 'done', 'Running form is within limits. No assessment needed.');
      return { result: 'clear', breaches: [], assessmentId: '' };
    }
    if (earlier) {
      run.setValue('baseline_run', earlier.getUniqueValue());
      run.setValue('assessment', earlier.getValue('assessment'));
      run.update();
      this._log(run, 'assess', 'done', 'Re-score of an open assessment. Still an issue: ' + (this._names(breaches).join(', ') || 'none'));
      return { result: 'rescore', breaches: breaches, assessmentId: earlier.getValue('assessment') };
    }

    var exposure = breaches.map(function (b) { return this.EXPOSURE[b]; }, this).join(' ');
    var title = 'Running form risk: ' + this._names(breaches).join(', ');
    if (dry) {
      run.setValue('state', 'assessed');
      run.update();
      this._log(run, 'assess', 'done', 'DRY RUN: would open assessment "' + title + '".');
      return { result: 'dry_run_assessment', breaches: breaches, assessmentId: '' };
    }
    var matrix = new GlideRecord('sn_hs_rm_risk_matrix');
    matrix.setLimit(1);
    matrix.query();
    if (!matrix.next()) throw 'No risk matrix on the instance.';
    var ra = new GlideRecord('sn_hs_rm_risk_assessment');
    ra.initialize();
    ra.setValue('short_description', title);
    ra.setValue('description', exposure);
    ra.setValue('risk_type', 'job');
    ra.setValue('risk_matrix', matrix.getUniqueValue());
    ra.setValue('state', '3');
    var id = ra.insert();
    if (!id) throw 'Could not create the risk assessment.';
    this._register(run, 'sn_hs_rm_risk_assessment', id, title);
    run.setValue('assessment', id);
    run.setValue('state', 'assessed');
    run.update();
    this._log(run, 'assess', 'done', 'Opened assessment ' + title);
    return { result: 'created', breaches: breaches, assessmentId: id };
  },

  // Tool 2: assign corrective drills as tracked actions on the assessment.
  assignDrills: function (runId) {
    var run = this._run(runId);
    var dry = run.getValue('dry_run') == '1';
    var breaches = (run.getValue('breaches') || '').split(',').filter(String);
    var assessmentId = run.getValue('assessment');
    var created = [];
    if (!breaches.length) {
      this._log(run, 'drills', 'done', 'No breaches, no drills to assign.');
      return { assigned: 0 };
    }
    if (this._openAssessmentFor(run)) {
      this._log(run, 'drills', 'done', 'Re-score: drills already assigned, none added.');
      return { assigned: 0 };
    }
    for (var i = 0; i < breaches.length; i++) {
      var list = this.DRILLS[breaches[i]] || [];
      for (var j = 0; j < list.length; j++) {
        if (dry || !assessmentId) {
          created.push(list[j]);
          continue;
        }
        var a = new GlideRecord('sn_ohs_im_action');
        a.initialize();
        a.setValue('short_description', list[j]);
        a.setValue('type', 'corrective');
        a.setValue('ohs_task', assessmentId);
        var aid = a.insert();
        if (aid) {
          this._register(run, 'sn_ohs_im_action', aid, list[j]);
          created.push(list[j]);
        }
      }
    }
    run.setValue('drills', JSON.stringify(created));
    this._log(run, 'drills', 'done', (dry ? 'DRY RUN: would assign ' : 'Assigned ') + created.length + ' corrective drills.');
    return { assigned: created.length, drills: created };
  },

  // Tool 3: ask Jev whether the form improved enough, then close or keep open.
  closeCheck: function (runId) {
    var run = this._run(runId);
    var dry = run.getValue('dry_run') == '1';
    var earlier = this._openAssessmentFor(run);
    if (!earlier) {
      this._log(run, 'close', 'done', 'First run for this assessment. Awaiting re-score.');
      return { decision: 'awaiting_rescore' };
    }
    var stateText =
      'Runner form before: overstride ' + earlier.getValue('overstride') + ', cadence ' + earlier.getValue('cadence') +
      ', trunk lean ' + earlier.getValue('trunk_lean') + '. After corrective drills: overstride ' + run.getValue('overstride') +
      ', cadence ' + run.getValue('cadence') + ', trunk lean ' + run.getValue('trunk_lean') +
      '. Limits: overstride <= ' + this.LIMITS.overstride + ', cadence >= ' + this.LIMITS.cadence + ', trunk lean <= ' + this.LIMITS.trunkLean + '.';
    var probability = this._jev(stateText);
    if (probability !== null) run.setValue('jev_probability', probability);
    var stillBreached = this._breaches(run).length > 0;
    var close = probability !== null ? probability >= 0.5 && !stillBreached : !stillBreached;
    run.setValue('verdict', (close ? 'Close' : 'Keep open') + (probability !== null ? ' (Jev ' + probability.toFixed(2) + ')' : ' (rule check, Jev unavailable)'));
    if (close) {
      run.setValue('state', 'closed');
      if (!dry) {
        var ra = new GlideRecord('sn_hs_rm_risk_assessment');
        if (ra.get(earlier.getValue('assessment'))) {
          ra.setValue('state', '4');
          ra.setValue('completed_on', new GlideDateTime().getValue());
          ra.update();
        }
        earlier.setValue('state', 'closed');
        earlier.update();
      }
    } else {
      run.setValue('state', 'assessed');
    }
    run.update();
    this._log(run, 'close', 'done', (dry ? 'DRY RUN: ' : '') + run.getValue('verdict'));
    return { decision: close ? 'close' : 'keep_open', probability: probability };
  },

  _jev: function (stateText) {
    var key = gs.getProperty('x_snc_legwork.typesafe_api_key', '');
    if (!key || key.indexOf('REPLACE_WITH') === 0) return null;
    try {
      var rm = new sn_ws.RESTMessageV2();
      rm.setHttpMethod('POST');
      rm.setEndpoint('https://api.typesafe.ai/v1/systemone');
      rm.setRequestHeader('Authorization', 'Bearer ' + key);
      rm.setRequestHeader('Content-Type', 'application/json');
      rm.setHttpTimeout(20000);
      rm.setRequestBody(JSON.stringify({
        state: stateText,
        model: 'jev-latest',
        questions: { answer: { type: 'noul', instructions: 'Has this runner\'s form improved enough to close the injury risk assessment?' } }
      }));
      var res = rm.execute();
      var parsed = JSON.parse(res.getBody());
      return parsed.answers.answer.noul;
    } catch (e) {
      return null;
    }
  },

  // Clear demo data: deletes only what the registry lists, then the runs. A record
  // this scope cannot delete stays registered and is returned for the caller to delete.
  clearDemoData: function () {
    var removed = 0;
    var removedRuns = 0;
    var leftover = [];
    var reg = new GlideRecord('x_snc_legwork_created');
    reg.query();
    while (reg.next()) {
      var table = reg.getValue('target_table');
      var id = reg.getValue('target_id');
      var gone = true;
      var t = new GlideRecord(table);
      if (t.get(id)) {
        try {
          gone = t.deleteRecord();
        } catch (e) {
          gone = false;
        }
        if (gone && table === 'x_snc_legwork_run') removedRuns++;
        else if (gone) removed++;
      }
      if (gone) reg.deleteRecord();
      else leftover.push({ table: table, id: id });
    }
    var runs = new GlideRecord('x_snc_legwork_run');
    runs.query();
    removedRuns += runs.getRowCount();
    runs.deleteMultiple();
    return { removedRecords: removed, removedRuns: removedRuns, leftover: leftover };
  },

  type: 'LegworkOps'
};
