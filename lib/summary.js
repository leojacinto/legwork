const median = values => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Collects tracked metric frames during a run and reduces them to one summary.
export class RunSummary {
  frames = [];

  add(metrics) {
    if (metrics?.tracking) this.frames.push(metrics);
  }

  reset() {
    this.frames = [];
  }

  get size() {
    return this.frames.length;
  }

  summarise() {
    const pick = key => this.frames.map(f => f[key]);
    return {
      overstride: median(pick('stride')),
      // Cadence reads 0 until enough steps are seen, so ignore those frames.
      cadence: median(pick('cadence').filter(v => v > 0)),
      trunkLean: median(pick('trunkLean')),
      push: median(pick('push')),
      frames: this.frames.length
    };
  }
}
