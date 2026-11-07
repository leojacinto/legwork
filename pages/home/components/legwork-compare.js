import {html, css, svg, nothing} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {scaleLinear} from 'd3-scale';

const W = 360;
const ROW = 46;
const LEFT = 96;
const BAR_H = 12;

// key, label, scale max, and whether a higher value is better.
const MEASURES = [
  {key: 'cadence', label: () => i18n.getMessage('Step rate'), max: 220, unit: 'steps/min', higherBetter: true, limitKey: 'cadence'},
  {key: 'trunkLean', label: () => i18n.getMessage('Forward lean'), max: 40, unit: '°', higherBetter: false, limitKey: 'trunkLean'},
  {key: 'overstride', label: () => i18n.getMessage('Stride reach'), max: 2, unit: '× torso', higherBetter: false, limitKey: 'overstride'}
];

// Baseline run vs the latest run, with the limit marked. d3 scales and plain
// SVG rects, no DOM access in render, so it matches on server and client.
@customElement('legwork-compare')
export default class LegworkCompare extends AIUXElement {
  static properties = {
    progress: {attribute: false}
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.progress = null;
  }

  within(m, value, limits) {
    return m.higherBetter ? value >= limits[m.limitKey] : value <= limits[m.limitKey];
  }

  // Improved, no change or declined, from the baseline and latest numbers.
  assess(p) {
    const base = p.baseline;
    const now = p.metrics;
    const names = {
      cadence: i18n.getMessage('step rate'),
      trunkLean: i18n.getMessage('forward lean'),
      overstride: i18n.getMessage('stride reach')
    };
    // Change that counts as real, per measure.
    const tolerance = {cadence: 3, trunkLean: 2, overstride: 0.05};
    let better = 0;
    let worse = 0;
    const over = [];
    for (const m of MEASURES) {
      const delta = now[m.key] - base[m.key];
      const gain = m.higherBetter ? delta : -delta;
      if (gain > tolerance[m.key]) better++;
      else if (gain < -tolerance[m.key]) worse++;
      if (!this.within(m, now[m.key], p.limits)) over.push(names[m.key]);
    }
    const tail = over.length
      ? i18n.getMessage('Still outside the limit: {0}.', [over.join(', ')])
      : i18n.getMessage('Everything is within the limits.');
    if (worse) {
      return {
        tone: 'error',
        word: i18n.getMessage('Declined'),
        detail: `${i18n.getMessage('{0} measure(s) got worse than the baseline.', [worse])} ${tail}`
      };
    }
    if (better) {
      return {
        tone: 'success',
        word: i18n.getMessage('Improved'),
        detail: `${i18n.getMessage('{0} measure(s) improved on the baseline.', [better])} ${tail}`
      };
    }
    return {
      tone: 'warning',
      word: i18n.getMessage('No change'),
      detail: `${i18n.getMessage('Form is about the same as the baseline.')} ${tail}`
    };
  }

  renderAssessment(p) {
    if (!p) return nothing;
    const a = p.baseline
      ? this.assess(p)
      : {
          tone: 'info',
          word: i18n.getMessage('Baseline set'),
          detail: i18n.getMessage('This session is the reference. Run Session 2 to compare.')
        };
    const tones = {
      error: 'border-error bg-error/10 text-error',
      success: 'border-success bg-success/10 text-success',
      warning: 'border-warning bg-warning/10 text-warning',
      info: 'border-info bg-info/10 text-info'
    };
    return html`<div class="mt-2 flex flex-col gap-1 rounded-box border p-3 ${tones[a.tone]}" role="status">
      <p class="text-base font-semibold">${i18n.getMessage('Assessment')}: ${a.word}</p>
      <p class="text-sm text-text-primary">${a.detail}</p>
    </div>`;
  }

  render() {
    const p = this.progress;
    return html`
      <div class="aiux-card bg-base-100 shadow-sm">
        <div class="aiux-card-body gap-2 p-3">
          <h2 class="text-sm font-semibold text-text-primary">
            ${i18n.getMessage('Before and after')}
          </h2>
          ${p?.baseline ? this.renderChart(p) : html`<p class="text-sm text-text-secondary">
                ${i18n.getMessage('Run Session 2 to compare it with Session 1.')}
              </p>`}
          ${this.renderAssessment(p)}
        </div>
      </div>
    `;
  }

  renderChart(p) {
    const base = p.baseline;
    const now = p.metrics;
    const h = MEASURES.length * ROW + 24;
    return html`
      <svg viewBox="0 0 ${W} ${h}" class="w-full" role="img"
        aria-label=${i18n.getMessage('Session 1 compared with the latest session for each measure')}>
        ${MEASURES.map((m, i) => {
          const x = scaleLinear().domain([0, m.max]).range([0, W - LEFT - 56]).clamp(true);
          const y = i * ROW + 8;
          const limit = p.limits[m.limitKey];
          const ok = this.within(m, now[m.key], p.limits);
          return svg`<g transform="translate(0 ${y})">
            <text x="0" y="14" font-size="11" fill="var(--color-text-primary, #000)">${m.label()}</text>
            <rect x=${LEFT} y="2" width=${x(base[m.key])} height=${BAR_H} rx="3" fill="var(--color-base-300, #c9ccd1)" />
            <rect x=${LEFT} y="20" width=${x(now[m.key])} height=${BAR_H} rx="3"
              fill=${ok ? 'var(--color-success, #0a7a5a)' : 'var(--color-warning, #d97706)'} />
            <line x1=${LEFT + x(limit)} x2=${LEFT + x(limit)} y1="-2" y2="36"
              stroke="var(--color-text-secondary, #4d4c4a)" stroke-dasharray="3 2" />
            <text x=${LEFT + x(base[m.key]) + 5} y="12" font-size="10" fill="var(--color-text-secondary, #4d4c4a)">${base[m.key].toFixed(1)}</text>
            <text x=${LEFT + x(now[m.key]) + 5} y="30" font-size="10" fill="var(--color-text-primary, #000)">${now[m.key].toFixed(1)}</text>
          </g>`;
        })}
        <g transform="translate(${LEFT} ${h - 6})" font-size="9" fill="var(--color-text-secondary, #4d4c4a)">
          <rect width="8" height="8" y="-8" fill="var(--color-base-300, #c9ccd1)" />
          <text x="12" y="0">${i18n.getMessage('Session 1')}</text>
          <rect x="64" width="8" height="8" y="-8" fill="var(--color-success, #0a7a5a)" />
          <text x="76" y="0">${i18n.getMessage('Latest')}</text>
          <line x1="122" x2="134" y1="-4" y2="-4" stroke="var(--color-text-secondary, #4d4c4a)" stroke-dasharray="3 2" />
          <text x="138" y="0">${i18n.getMessage('Limit')}</text>
        </g>
      </svg>
    `;
  }
}
