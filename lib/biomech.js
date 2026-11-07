import {LM, EMPTY_METRICS} from './landmarks.js';

const SMOOTH = 0.15; // EMA factor per frame, lower = steadier (removes stride bounce)
const MIN_VISIBILITY = 0.4;
const AUTO_RANGE_WINDOW_MS = 12000; // used until back/front are calibrated
const MIN_RANGE = 0.03; // below this the auto range is too narrow to trust
const STEP_HYSTERESIS = 0.012; // ankle y separation needed to count a crossing
const MIN_STEP_GAP_MS = 220;
const CADENCE_WINDOW_MS = 6000;

const clamp01 = v => Math.min(1, Math.max(0, v));
const mid = (a, b) => ({x: (a.x + b.x) / 2, y: (a.y + b.y) / 2});

function angleAt(a, b, c) {
  const v1 = {x: a.x - b.x, y: a.y - b.y};
  const v2 = {x: c.x - b.x, y: c.y - b.y};
  const cos =
    (v1.x * v2.x + v1.y * v2.y) /
    (Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y) || 1e-6);
  return (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
}

export class BiomechAnalyzer {
  torsoX = null;
  back = null;
  front = null;
  recent = [];
  ankleSign = 0;
  lastStepT = 0;
  stepTimes = [];
  lean = 0;
  arm = 0;
  stride = 0;
  last = {...EMPTY_METRICS};

  setBack() {
    if (this.torsoX !== null) this.back = this.torsoX;
  }

  setFront() {
    if (this.torsoX !== null) this.front = this.torsoX;
  }

  resetCalibration() {
    this.back = null;
    this.front = null;
  }

  update(lm, tMs) {
    if (!lm) {
      this.expireSteps(tMs);
      this.last = {...this.last, cadence: this.cadence(), tracking: false};
      return this.last;
    }

    const ls = lm[LM.L_SHOULDER];
    const rs = lm[LM.R_SHOULDER];
    const lh = lm[LM.L_HIP];
    const rh = lm[LM.R_HIP];
    const torsoVisible =
      Math.min(ls.visibility, rs.visibility, lh.visibility, rh.visibility) > 0 ||
      Math.max(ls.visibility, rs.visibility) > MIN_VISIBILITY;

    // Side-on view: the far side landmarks are often occluded, so average whichever are visible.
    const pts = [ls, rs, lh, rh].filter(p => p.visibility > MIN_VISIBILITY);
    if (!torsoVisible || pts.length === 0) {
      this.last = {...this.last, tracking: false};
      return this.last;
    }
    const rawX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    this.torsoX =
      this.torsoX === null ? rawX : this.torsoX + (rawX - this.torsoX) * SMOOTH;

    // trunk lean: shoulder-mid to hip-mid vs vertical
    const sh = mid(ls, rs);
    const hp = mid(lh, rh);
    const lean =
      (Math.atan2(Math.abs(sh.x - hp.x), Math.abs(hp.y - sh.y) || 1e-6) * 180) /
      Math.PI;
    this.lean += (lean - this.lean) * SMOOTH;

    // arm angle: whichever arm is more visible
    const l = [lm[LM.L_SHOULDER], lm[LM.L_ELBOW], lm[LM.L_WRIST]];
    const r = [lm[LM.R_SHOULDER], lm[LM.R_ELBOW], lm[LM.R_WRIST]];
    const vis = a => Math.min(...a.map(p => p.visibility));
    const arm = vis(l) >= vis(r) ? l : r;
    if (vis(arm) > MIN_VISIBILITY) {
      this.arm += (angleAt(arm[0], arm[1], arm[2]) - this.arm) * SMOOTH;
    }

    this.stepCount(lm, tMs, Math.hypot(sh.x - hp.x, sh.y - hp.y) || 0.2);

    // push: calibrated zones if both set, else rolling auto range
    this.recent.push({t: tMs, x: this.torsoX});
    while (this.recent.length && tMs - this.recent[0].t > AUTO_RANGE_WINDOW_MS) {
      this.recent.shift();
    }

    const calibrated =
      this.back !== null &&
      this.front !== null &&
      Math.abs(this.front - this.back) > MIN_RANGE;
    let lo;
    let hi;
    if (calibrated) {
      lo = this.back;
      hi = this.front;
    } else {
      const xs = this.recent.map(p => p.x);
      lo = Math.min(...xs);
      hi = Math.max(...xs);
    }
    // order doesn't matter: runner may face either way, calibration gives the direction
    const range = hi - lo;
    const push =
      Math.abs(range) < MIN_RANGE ? 0.5 : clamp01((this.torsoX - lo) / range);

    this.last = {
      push,
      torsoX: this.torsoX,
      cadence: this.cadence(),
      trunkLean: this.lean,
      armAngle: this.arm,
      stride: this.stride,
      calibrated,
      tracking: true
    };
    return this.last;
  }

  // Each sign change of (left ankle y - right ankle y) is one footfall.
  stepCount(lm, tMs, torsoLen) {
    const la = lm[LM.L_ANKLE];
    const ra = lm[LM.R_ANKLE];
    if (la.visibility < MIN_VISIBILITY && ra.visibility < MIN_VISIBILITY) {
      this.expireSteps(tMs);
      return;
    }
    const d = la.y - ra.y;
    const sign = d > STEP_HYSTERESIS ? 1 : d < -STEP_HYSTERESIS ? -1 : 0;
    if (sign !== 0 && sign !== this.ankleSign) {
      if (this.ankleSign !== 0 && tMs - this.lastStepT > MIN_STEP_GAP_MS) {
        this.stepTimes.push(tMs);
        this.lastStepT = tMs;
      }
      this.ankleSign = sign;
    }
    this.stride +=
      (Math.abs(la.x - ra.x) / torsoLen - this.stride) * SMOOTH;
    this.expireSteps(tMs);
  }

  expireSteps(tMs) {
    while (
      this.stepTimes.length &&
      tMs - this.stepTimes[0] > CADENCE_WINDOW_MS
    ) {
      this.stepTimes.shift();
    }
  }

  cadence() {
    if (this.stepTimes.length < 3) return 0;
    const span = this.stepTimes[this.stepTimes.length - 1] - this.stepTimes[0];
    return span > 0 ? ((this.stepTimes.length - 1) / span) * 60000 : 0;
  }
}
