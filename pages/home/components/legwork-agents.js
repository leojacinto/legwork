import {html, css, nothing} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import '@servicenow/aiux-components-coe-node-map';

// step is the key the LegworkOps tools write to the run's agent log.
const NODES = [
  {id: 'run', step: 'start', icon: 'user'},
  {id: 'assessor', step: 'assess', icon: 'shield'},
  {id: 'coach', step: 'drills', icon: 'list'},
  {id: 'reviewer', step: 'close', icon: 'check'},
  {id: 'jev', step: 'close', icon: 'cloud'}
];
const EDGES = [
  {id: 'e1', source: 'run', target: 'assessor'},
  {id: 'e2', source: 'assessor', target: 'coach'},
  {id: 'e3', source: 'coach', target: 'reviewer'},
  {id: 'e4', source: 'reviewer', target: 'jev'}
];
const ORDER = ['start', 'assess', 'drills', 'close'];

const BREACH_LABELS = {
  overstride: () => i18n.getMessage('Stride too long'),
  cadence: () => i18n.getMessage('Step rate too low'),
  trunkLean: () => i18n.getMessage('Leaning too far forward')
};

const LABELS = {
  run: () => i18n.getMessage('Run recorded'),
  assessor: () => i18n.getMessage('Form Assessor'),
  coach: () => i18n.getMessage('Drill Coach'),
  reviewer: () => i18n.getMessage('Close Reviewer'),
  jev: () => i18n.getMessage('Jev decision')
};

const NODE_STATUS = {
  done: 'success',
  active: 'warning',
  pending: 'info',
  skipped: 'info'
};

// Agent progress on the packaged node map. Node status follows the steps the
// agents log; each node's popover shows what that agent produced.
@customElement('legwork-agents')
export default class LegworkAgents extends AIUXElement {
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
    this.mapAdjusted = false;
    this.renderPopover = node => this.popoverFor(node.id);
  }

  statusOf(node) {
    const p = this.progress;
    if (!p) return 'pending';
    const done = new Set(p.steps.map(s => s.step));
    if (node.id === 'jev') {
      if (p.jev !== null) return 'done';
      return done.has('close') ? 'skipped' : 'pending';
    }
    if (done.has(node.step)) return 'done';
    if (node.step === 'drills' && done.has('close')) return 'skipped';
    if (p.state === 'clear' && node.step !== 'start') return 'skipped';
    const lastDone = Math.max(-1, ...p.steps.map(s => ORDER.indexOf(s.step)));
    return ORDER.indexOf(node.step) === lastDone + 1 && !p.finished
      ? 'active'
      : 'pending';
  }

  nodes() {
    return NODES.map(n => {
      const status = this.statusOf(n);
      return {
        id: n.id,
        label: LABELS[n.id](),
        sublabel: this.sublabelFor(status),
        icon: n.icon,
        status: NODE_STATUS[status],
        _state: status
      };
    });
  }

  sublabelFor(status) {
    if (status === 'done') return i18n.getMessage('Done');
    if (status === 'active') return i18n.getMessage('Working');
    if (status === 'skipped') return i18n.getMessage('Skipped');
    return i18n.getMessage('Waiting');
  }

  edges() {
    return EDGES.map(e => {
      const target = NODES.find(n => n.id === e.target);
      const reached = ['done', 'active'].includes(this.statusOf(target));
      return {...e, status: reached ? 'success' : undefined};
    });
  }

  // What each agent produced, from the run data the endpoint returns.
  popoverFor(id) {
    const p = this.progress;
    const step = key => p?.steps.find(s => s.step === key);
    const body = {
      run: step('start')?.text,
      assessor: step('assess')?.text,
      coach: p?.drills.length ? p.drills.join(' ') : step('drills')?.text,
      reviewer: step('close')?.text,
      jev:
        p?.jev !== null && p?.jev !== undefined
          ? i18n.getMessage('Probability form improved: {0}', [p.jev.toFixed(2)])
          : ''
    }[id];
    return html`<div class="max-w-xs p-2 text-sm">
      <p class="font-semibold">${LABELS[id]()}</p>
      <p>${body || i18n.getMessage('No output yet.')}</p>
    </div>`;
  }

  // The packaged map keeps a 350px minimum height inside its shadow DOM. Lift it
  // so the short, horizontal strip below can be as short as we set it.
  updated() {
    const map = this.renderRoot.querySelector('aiux-node-map');
    if (!map?.shadowRoot) return;
    if (!this.mapAdjusted) {
      this.mapAdjusted = true;
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('.min-h-87\\.5 { min-height: 0 !important; }');
      map.shadowRoot.adoptedStyleSheets = [
        ...map.shadowRoot.adoptedStyleSheets,
        sheet
      ];
      // Refit whenever the box changes size (wide or resized windows).
      this.resizeObserver = new ResizeObserver(() => this.scheduleFit(map));
      this.resizeObserver.observe(map);
    }
    this.scheduleFit(map);
  }

  // The map's own fit crops the first tile on some widths, so fit the graph
  // ourselves: whole strip, small padding, no minimum zoom in the way.
  scheduleFit(map) {
    clearTimeout(this.fitTimer);
    this.fitTimer = setTimeout(() => {
      const cy = map.cy;
      if (!cy) return;
      cy.resize();
      cy.minZoom(0.05);
      // Fit to the strip, then shrink the tiles 12% so the ends never touch the edge.
      const bb = cy.elements().boundingBox();
      const fit = Math.min(
        (cy.width() - 32) / bb.w,
        (cy.height() - 32) / bb.h
      );
      cy.zoom(fit * 0.88);
      cy.center(cy.elements());
    }, 350);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.fitTimer);
    this.resizeObserver?.disconnect();
  }

  render() {
    const p = this.progress;
    return html`
      <div class="aiux-card bg-base-100 shadow-sm">
        <div class="aiux-card-body gap-3 p-3">
          <h2 class="text-sm font-semibold text-text-primary">
            ${i18n.getMessage('Agent progress')}
          </h2>
          <aiux-node-map
            .nodes=${this.nodes()}
            .edges=${this.edges()}
            .renderPopoverContent=${this.renderPopover}
            layout="horizontal"
            popover-trigger="click"
            height="160px"
            max-node-screen-ratio="0.7"
          ></aiux-node-map>
          ${p ? this.renderDetails(p) : nothing}
        </div>
      </div>
    `;
  }

  renderDetails(p) {
    return html`
      <ul class="flex flex-col gap-1 text-sm text-text-primary">
        ${p.steps
          .filter(s => s.step !== 'start')
          .map(s => html`<li>${s.text}</li>`)}
      </ul>
      ${p.breaches.length
        ? html`<div class="flex flex-wrap gap-1">
            ${p.breaches.map(
              b =>
                html`<span class="aiux-badge aiux-badge-warning aiux-badge-soft"
                  >${BREACH_LABELS[b] ? BREACH_LABELS[b]() : b}</span
                >`
            )}
          </div>`
        : nothing}
      ${p.drills.length
        ? html`<div>
            <p class="text-xs font-semibold text-text-secondary">
              ${i18n.getMessage('Corrective drills')}
            </p>
            <ol class="list-decimal pl-5 text-sm text-text-primary">
              ${p.drills.map(d => html`<li>${d}</li>`)}
            </ol>
          </div>`
        : nothing}
      ${p.verdict
        ? html`<p class="text-sm font-semibold text-text-primary">
            ${p.verdict}
          </p>`
        : nothing}
    `;
  }
}
