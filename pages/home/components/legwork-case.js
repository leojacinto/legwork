import {html, css, svg, nothing} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {scaleLinear} from 'd3-scale';

const W = 320;
const PAD = 26;
const TRACK_Y = 34;
const TRACK_H = 10;
// Same bands as the server: Low below 20, Moderate below 50, High above.
const BANDS = [
  {from: 0, to: 20, color: 'var(--color-success, #0a7a5a)', label: () => i18n.getMessage('Low')},
  {from: 20, to: 50, color: 'var(--color-warning, #d97706)', label: () => i18n.getMessage('Moderate')},
  {from: 50, to: 100, color: 'var(--color-error, #c0392b)', label: () => i18n.getMessage('High')}
];

// The risk assessment the agents opened, shown beside the video: a d3 risk meter
// from Session 1 to Session 2, the drills as a checklist, and a link to the record.
// In a dry run no record exists, so the panel is a labelled preview.
@customElement('legwork-case')
export default class LegworkCase extends AIUXElement {
  static properties = {
    progress: {attribute: false}
  };

  static styles = css`
    :host {
      display: block;
    }
    .marker {
      transition: transform var(--duration-slow, 500ms) ease;
    }
    @media (prefers-reduced-motion: reduce) {
      .marker {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.progress = null;
  }

  close() {
    this.dispatchEvent(
      new CustomEvent('legwork-case:close', {bubbles: true, composed: true})
    );
  }

  render() {
    const p = this.progress;
    if (!p) return nothing;
    const rec = p.caseRecord;
    const preview = !rec;
    const title =
      rec?.title ??
      i18n.getMessage('Running form risk: {0}', [
        p.breaches.length ? p.breaches.join(', ') : '-'
      ]);
    const stateText = preview
      ? i18n.getMessage('Preview')
      : rec.closed
        ? i18n.getMessage('Closed')
        : rec.state;
    const tone = preview ? 'badge-info' : rec.closed ? 'badge-success' : 'badge-warning';
    const drills = rec ? rec.actions : p.drills.map(text => ({text, done: false}));
    const done = drills.filter(d => d.done).length;

    return html`
      <div class="aiux-card bg-base-100 shadow-sm">
        <div class="aiux-card-body gap-4 p-4">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                ${i18n.getMessage('Risk assessment')}
                ${rec ? html`<span class="font-mono normal-case">${rec.number}</span>` : nothing}
              </p>
              <h2 class="mt-1 break-words text-base font-semibold text-text-primary">
                ${title}
              </h2>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <span class="aiux-badge aiux-badge-soft aiux-${tone}">${stateText}</span>
              <button
                class="aiux-btn aiux-btn-ghost aiux-btn-xs"
                aria-label=${i18n.getMessage('Close case')}
                @click=${this.close}
              >
                ✕
              </button>
            </div>
          </div>

          ${this.renderMeter(p)}

          ${p.verdict
            ? html`<p class="text-sm text-text-primary">
                <span class="font-semibold">${i18n.getMessage('Close decision')}:</span>
                ${p.verdict}
              </p>`
            : nothing}

          <div>
            <div class="mb-2 flex items-baseline justify-between">
              <h3 class="text-sm font-semibold text-text-primary">
                ${i18n.getMessage('Corrective drills')}
              </h3>
              <span class="text-xs text-text-secondary">
                ${i18n.getMessage('{0} of {1} done', [done, drills.length])}
              </span>
            </div>
            <ul class="flex flex-col gap-2">
              ${drills.map(
                d => html`<li class="flex items-start gap-2 text-sm text-text-primary">
                  <span
                    class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${d.done
                      ? 'border-success bg-success text-success-content'
                      : 'border-base-300'}"
                    aria-hidden="true"
                    >${d.done ? '✓' : nothing}</span
                  >
                  <span class="${d.done ? 'text-text-secondary line-through' : ''}">${d.text}</span>
                </li>`
              )}
            </ul>
          </div>

          ${rec?.exposure
            ? html`<p class="text-xs leading-relaxed text-text-secondary">${rec.exposure}</p>`
            : nothing}
          ${preview
            ? html`<p class="text-xs text-text-secondary">
                ${i18n.getMessage('Dry run: no record was created. Switch to Live to create it.')}
              </p>`
            : html`<a
                class="aiux-link text-sm"
                href=${`/sn_hs_rm_risk_assessment.do?sys_id=${rec.id}`}
                target="_blank"
                rel="noopener"
                >${i18n.getMessage('Open the record in ServiceNow')}</a
              >`}
        </div>
      </div>
    `;
  }

  // Risk from Session 1 to Session 2 on a Low, Moderate, High track.
  renderMeter(p) {
    const s = p.scores;
    const x = scaleLinear().domain([0, 100]).range([PAD, W - PAD]);
    const hasBase = s.baseline !== null && s.baseline !== undefined;
    // Session 1 is the baseline once a re-score exists, otherwise the current run.
    const first = hasBase ? s.baseline : s.current;
    const second = hasBase ? s.current : null;
    const levelFirst = hasBase ? s.baselineLevel : s.currentLevel;

    // Keep each label inside the drawing: start-aligned near the left end, end-aligned near the right.
    const marker = (value, label, strong) => {
      const anchor = x(value) < 60 ? 'start' : x(value) > W - 60 ? 'end' : 'middle';
      return svg`
      <g class="marker" style=${`transform: translateX(${x(value)}px)`}>
        <line y1=${TRACK_Y - 6} y2=${TRACK_Y + TRACK_H + 6} stroke="var(--color-text-primary, #000)" stroke-width="2" />
        <circle cy=${TRACK_Y + TRACK_H / 2} r="6" fill=${strong ? 'var(--color-text-primary, #000)' : 'var(--color-base-100, #fff)'}
          stroke="var(--color-text-primary, #000)" stroke-width="2" />
        <text x=${anchor === 'start' ? -6 : anchor === 'end' ? 6 : 0} y=${TRACK_Y - 12} text-anchor=${anchor} font-size="10" font-weight="600" fill="var(--color-text-primary, #000)">${label}</text>
      </g>`;
    };

    return html`
      <div>
        <div class="mb-1 flex items-baseline justify-between">
          <h3 class="text-sm font-semibold text-text-primary">
            ${i18n.getMessage('Risk')}
          </h3>
          <span class="text-xs text-text-secondary">
            ${hasBase
              ? i18n.getMessage('{0} to {1}', [levelFirst, s.currentLevel])
              : levelFirst}
          </span>
        </div>
        <svg viewBox="0 0 ${W} 72" class="w-full" role="img"
          aria-label=${hasBase
            ? i18n.getMessage('Risk moved from {0} to {1}', [levelFirst, s.currentLevel])
            : i18n.getMessage('Risk is {0}', [levelFirst])}>
          ${BANDS.map(
            b => svg`<rect x=${x(b.from)} y=${TRACK_Y} width=${x(b.to) - x(b.from)} height=${TRACK_H}
              fill=${b.color} opacity="0.85" />`
          )}
          ${BANDS.map(
            b => svg`<text x=${(x(b.from) + x(b.to)) / 2} y=${TRACK_Y + TRACK_H + 16} text-anchor="middle"
              font-size="9" fill="var(--color-text-secondary, #4d4c4a)">${b.label()}</text>`
          )}
          ${marker(first, i18n.getMessage('Session 1'), false)}
          ${second === null ? nothing : marker(second, i18n.getMessage('Session 2'), true)}
        </svg>
      </div>
    `;
  }
}
