import {html, css, svg, nothing} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {arc, line, curveMonotoneX} from 'd3-shape';
import {scaleLinear} from 'd3-scale';

const ARC_START = -Math.PI * 0.75;
const ARC_END = Math.PI * 0.75;
const SIZE = 120;
const SPARK_W = 120;
const SPARK_H = 28;

// key, label, unit, domain and decimals for each gauge.
const GAUGES = [
  {key: 'push', label: () => i18n.getMessage('Belt position'), unit: '', max: 1, digits: 2},
  {key: 'cadence', label: () => i18n.getMessage('Step rate'), unit: 'steps/min', max: 220, digits: 0},
  {key: 'trunkLean', label: () => i18n.getMessage('Forward lean'), unit: '°', max: 40, digits: 1},
  {key: 'stride', label: () => i18n.getMessage('Stride reach'), unit: '× torso length', max: 1.5, digits: 2}
];

// Pure d3 path math in render(), no DOM access, so it renders the same on server and client.
@customElement('legwork-gauges')
export default class LegworkGauges extends AIUXElement {
  static properties = {
    metrics: {attribute: false},
    history: {attribute: false}
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.metrics = null;
    this.history = [];
  }

  render() {
    return html`
      <ul class="grid grid-cols-2 gap-3">
        ${GAUGES.map(g => html`<li>${this.renderGauge(g)}</li>`)}
      </ul>
    `;
  }

  renderGauge(g) {
    const value = this.metrics?.[g.key] ?? 0;
    const label = g.label();
    const text = `${value.toFixed(g.digits)}${g.unit ? ` ${g.unit}` : ''}`;
    const x = scaleLinear().domain([0, g.max]).range([ARC_START, ARC_END]).clamp(true);
    const track = arc()
      .innerRadius(44)
      .outerRadius(54)
      .cornerRadius(5)
      .startAngle(ARC_START)
      .endAngle(ARC_END)();
    const fill = arc()
      .innerRadius(44)
      .outerRadius(54)
      .cornerRadius(5)
      .startAngle(ARC_START)
      .endAngle(x(value))();

    const series = this.history.map(h => h[g.key] ?? 0);
    const sx = scaleLinear()
      .domain([0, Math.max(1, series.length - 1)])
      .range([2, SPARK_W - 2]);
    const sy = scaleLinear().domain([0, g.max]).range([SPARK_H - 2, 2]).clamp(true);
    const spark = line()
      .x((_, i) => sx(i))
      .y(d => sy(d))
      .curve(curveMonotoneX)(series);

    return html`
      <div class="aiux-card bg-base-100 shadow-sm">
        <div class="aiux-card-body items-center gap-1 p-3">
          <svg
            viewBox="0 0 ${SIZE} ${SIZE}"
            class="w-full max-w-[120px]"
            role="img"
            aria-label=${`${label}: ${text}`}
          >
            <g transform="translate(${SIZE / 2} ${SIZE / 2})">
              ${svg`<path d=${track} fill="var(--color-base-300, #e5e7eb)" />`}
              ${svg`<path d=${fill} fill="var(--color-primary, #0a7a5a)" />`}
              <text
                text-anchor="middle"
                dy="0.1em"
                font-size="18"
                font-weight="600"
                fill="var(--color-text-primary, #000)"
              >
                ${value.toFixed(g.digits)}
              </text>
              <text
                text-anchor="middle"
                dy="2em"
                font-size="9"
                fill="var(--color-text-secondary, #4d4c4a)"
              >
                ${g.unit}
              </text>
            </g>
          </svg>
          <p class="text-sm font-medium text-text-primary">${label}</p>
          <svg
            viewBox="0 0 ${SPARK_W} ${SPARK_H}"
            class="w-full"
            aria-hidden="true"
          >
            ${spark
              ? svg`<path d=${spark} fill="none" stroke-width="1.5" stroke="var(--color-primary, #0a7a5a)" />`
              : nothing}
          </svg>
        </div>
      </div>
    `;
  }
}
