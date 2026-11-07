const median = values => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// The step counter needs a few steps before it reads true, so early cadence
// readings spike. Ignore cadence from the first moments of a run.
const CADENCE_WARMUP_MS = 3000;

// Collects tracked metric frames during a run and reduces them to one summary.
export class RunSummary {
  frames = [];
  startMs = null;

  add(metrics, tMs = 0) {
    if (!metrics?.tracking) return;
    if (this.startMs === null) this.startMs = tMs;
    this.frames.push({...metrics, warm: tMs - this.startMs >= CADENCE_WARMUP_MS});
  }

  reset() {
    this.frames = [];
    this.startMs = null;
  }

  get size() {
    return this.frames.length;
  }

  summarise() {
    const pick = key => this.frames.map(f => f[key]);
    return {
      overstride: median(pick('stride')),
      // Cadence reads 0 until enough steps are seen, and spikes early: use warm frames only.
      cadence: median(
        this.frames.filter(f => f.warm && f.cadence > 0).map(f => f.cadence)
      ),
      trunkLean: median(pick('trunkLean')),
      push: median(pick('push')),
      frames: this.frames.length
    };
  }
}
