import '@servicenow/sdk/global'
import { Property, ScriptInclude, RestApi } from '@servicenow/sdk/core'

// Placeholder only. The real TypeSafe (Jev) key is set on the instance after the
// first install and never committed. 'once' keeps redeploys from overwriting it.
Property({
    $id: Now.ID['typesafe-api-key'],
    $meta: { installMethod: 'once' },
    name: 'x_snc_legwork.typesafe_api_key',
    type: 'string',
    value: 'REPLACE_WITH_TYPESAFE_API_KEY',
    description: 'TypeSafe (Jev) API key used by the Legwork close check. Set on instance only.',
    isPrivate: true,
    roles: { read: ['admin'], write: ['admin'] },
})

ScriptInclude({
    $id: Now.ID['legwork-ops'],
    name: 'LegworkOps',
    active: true,
    accessibleFrom: 'public',
    apiName: 'x_snc_legwork.LegworkOps',
    description: 'Legwork agent tools: assess a run, assign drills, close check, clear demo data.',
    script: Now.include('../server/LegworkOps.server.js'),
})

RestApi({
    $id: Now.ID['legwork-api'],
    name: 'Legwork',
    serviceId: 'legwork',
    consumes: 'application/json',
    produces: 'application/json',
    routes: [
        {
            // Lux posts one scored run. Creating the row fires the agentic workflow trigger.
            $id: Now.ID['legwork-run-create'],
            name: 'Create run',
            method: 'POST',
            path: '/runs',
            authentication: true,
            authorization: false,
            script: `(function process(request, response) {
  var b = (request.body && request.body.data) || {};
  var gr = new GlideRecord('x_snc_legwork_run');
  gr.initialize();
  gr.setValue('label', String(b.label || 'Run').slice(0, 120));
  gr.setValue('clip', String(b.clip || '').slice(0, 120));
  gr.setValue('runner', gs.getUserID());
  gr.setValue('overstride', Number(b.overstride) || 0);
  gr.setValue('cadence', Number(b.cadence) || 0);
  gr.setValue('trunk_lean', Number(b.trunkLean) || 0);
  gr.setValue('push', Number(b.push) || 0);
  gr.setValue('dry_run', b.dryRun === false ? false : true);
  gr.setValue('state', 'scored');
  var id = gr.insert();
  if (!id) { response.setStatus(500); response.setBody({ error: 'Could not create run' }); return; }
  var reg = new GlideRecord('x_snc_legwork_created');
  reg.initialize();
  reg.setValue('label', 'Run ' + gr.getValue('label'));
  reg.setValue('target_table', 'x_snc_legwork_run');
  reg.setValue('target_id', id);
  reg.setValue('run', id);
  reg.insert();
  var started = { status: 'skipped' };
  try {
    var uc = new GlideRecord('sn_aia_usecase');
    uc.addQuery('name', 'Legwork Form Safety Loop');
    uc.setLimit(1);
    uc.query();
    if (uc.next()) {
      started = new sn_aia.AiAgentRuntimeUtil().startAiAgentConversation({
        targetRecordId: id,
        targetTable: 'x_snc_legwork_run',
        usecaseId: uc.getUniqueValue(),
        objective: 'Process the scored Legwork run with identifier ' + id,
        conversationUser: gs.getUserID()
      });
    }
  } catch (e) {
    started = { status: 'error', error: String(e.message || e) };
  }
  var note = new GlideRecord('x_snc_legwork_run');
  if (note.get(id)) {
    note.setValue('agent_log', JSON.stringify({ step: 'start', status: started.status === 'success' ? 'done' : 'failed', text: 'Workflow start: ' + started.status + (started.error ? ' ' + JSON.stringify(started.error) : ''), t: new GlideDateTime().getValue() }));
    note.setValue('step_count', 1);
    note.update();
  }
  response.setStatus(201);
  response.setBody({ id: id, workflow: started.status });
})(request, response);`,
        },
        {
            // Lux polls this to draw the agent progress map.
            $id: Now.ID['legwork-run-get'],
            name: 'Get run progress',
            method: 'GET',
            path: '/runs/{id}',
            authentication: true,
            authorization: false,
            script: `(function process(request, response) {
  var gr = new GlideRecord('x_snc_legwork_run');
  var key = request.pathParams.id;
  var found = false;
  if (key === 'latest') {
    // The signed-in user's most recent run, so the page can reopen it on load.
    gr.addQuery('runner', gs.getUserID());
    gr.orderByDesc('sys_created_on');
    gr.setLimit(1);
    gr.query();
    found = gr.next();
  } else {
    found = gr.get(key);
  }
  if (!found) { response.setStatus(404); response.setBody({ error: 'Not found' }); return; }
  var steps = (gr.getValue('agent_log') || '').split('\\n').filter(String).map(function (l) {
    try { return JSON.parse(l); } catch (e) { return { step: 'log', status: 'done', text: l }; }
  });
  response.setBody({
    id: gr.getUniqueValue(),
    state: gr.getValue('state'),
    dryRun: gr.getValue('dry_run') == '1',
    breaches: (gr.getValue('breaches') || '').split(',').filter(String),
    verdict: gr.getValue('verdict') || '',
    metrics: {
      overstride: parseFloat(gr.getValue('overstride')) || 0,
      cadence: parseFloat(gr.getValue('cadence')) || 0,
      trunkLean: parseFloat(gr.getValue('trunk_lean')) || 0,
      push: parseFloat(gr.getValue('push')) || 0
    },
    baseline: (function () {
      var b = new GlideRecord('x_snc_legwork_run');
      if (!gr.getValue('baseline_run') || !b.get(gr.getValue('baseline_run'))) return null;
      return {
        label: b.getValue('label'),
        overstride: parseFloat(b.getValue('overstride')) || 0,
        cadence: parseFloat(b.getValue('cadence')) || 0,
        trunkLean: parseFloat(b.getValue('trunk_lean')) || 0
      };
    })(),
    limits: new x_snc_legwork.LegworkOps().LIMITS,
    scores: (function () {
      var ops = new x_snc_legwork.LegworkOps();
      var b = new GlideRecord('x_snc_legwork_run');
      var hasBase = gr.getValue('baseline_run') && b.get(gr.getValue('baseline_run'));
      var cur = ops.riskScore(parseFloat(gr.getValue('overstride')) || 0, parseFloat(gr.getValue('cadence')) || 0, parseFloat(gr.getValue('trunk_lean')) || 0);
      var base = hasBase ? ops.riskScore(parseFloat(b.getValue('overstride')) || 0, parseFloat(b.getValue('cadence')) || 0, parseFloat(b.getValue('trunk_lean')) || 0) : null;
      return { current: cur, baseline: base, currentLevel: ops.riskLevel(cur), baselineLevel: base === null ? '' : ops.riskLevel(base) };
    })(),
    caseRecord: (function () {
      var id = gr.getValue('assessment');
      if (!id) return null;
      var ra = new GlideRecord('sn_hs_rm_risk_assessment');
      if (!ra.get(id)) return null;
      var acts = [];
      var a = new GlideRecord('sn_ohs_im_action');
      a.addQuery('ohs_task', id);
      a.orderBy('number');
      a.query();
      while (a.next()) acts.push({ number: a.getValue('number'), text: a.getValue('short_description'), state: a.getDisplayValue('state'), done: a.getValue('state') === '3' });
      return {
        id: id,
        number: ra.getValue('number'),
        title: ra.getValue('short_description'),
        exposure: ra.getValue('description') || '',
        state: ra.getDisplayValue('state'),
        closed: ra.getValue('state') === '4',
        inherent: ra.getDisplayValue('risk_before_controls'),
        residual: ra.getDisplayValue('risk_after_controls'),
        actions: acts
      };
    })(),
    drills: (function () { try { return JSON.parse(gr.getValue('drills') || '[]'); } catch (e) { return []; } })(),
    jev: gr.getValue('jev_probability') ? parseFloat(gr.getValue('jev_probability')) : null,
    assessment: gr.getValue('assessment') || '',
    steps: steps
  });
})(request, response);`,
        },
        {
            // Clear demo data button. Admin only, deletes only registered records.
            $id: Now.ID['legwork-clear'],
            name: 'Clear demo data',
            method: 'POST',
            path: '/clear',
            authentication: true,
            authorization: false,
            script: `(function process(request, response) {
  if (!gs.hasRole('admin')) { response.setStatus(403); response.setBody({ error: 'admin only' }); return; }
  response.setBody(new x_snc_legwork.LegworkOps().clearDemoData());
})(request, response);`,
        },
    ],
})
