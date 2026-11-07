import {html, css} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement, aiuxFetch} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import './components/legwork-stage.js';
import './components/legwork-gauges.js';
import './components/legwork-agents.js';
import './components/legwork-compare.js';
import './components/legwork-case.js';

const HISTORY_LENGTH = 150;
const POLL_MS = 2500;
const POLL_LIMIT = 200;

@customElement('x-snc-legwork-home-page')
export default class HomePage extends AIUXElement {
  static properties = {
    metrics: {state: true},
    history: {state: true},
    runStatus: {state: true},
    progress: {state: true},
    dryRun: {state: true},
    clearStatus: {state: true},
    caseOpen: {state: true}
  };

  static styles = css`
    :host {
      display: block;
    }
    .top {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1rem;
    }
    @media (min-width: 1024px) {
      .top {
        grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
        transition: grid-template-columns var(--duration-slow, 500ms) ease;
      }
      .top.case-open {
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .top {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.metrics = null;
    this.history = [];
    this.runStatus = '';
    this.progress = null;
    this.activeRun = null;
    this.clearStatus = '';
    this.caseOpen = false;
    // Dry run by default: the agents log what they would do and write nothing.
    this.dryRun = true;
  }

  // Reopen the signed-in user's latest run (and its case) when the page loads.
  async firstUpdated() {
    try {
      const resp = await aiuxFetch('/api/x_snc_legwork/legwork/runs/latest');
      if (!resp.ok) return;
      const r = (await resp.json()).result;
      const finished =
        r.state === 'clear' || r.steps.some(s => s.step === 'close');
      this.activeRun = r.id;
      this.progress = {...r, finished};
      if (!finished) this.pollProgress(r.id);
    } catch (err) {
      // no earlier run to show
    }
  }

  // Poll the run until the close step logs or the poll limit is reached.
  async pollProgress(id) {
    for (let i = 0; i < POLL_LIMIT; i++) {
      // A newer session took over: stop, so an old poll can't overwrite it.
      if (this.activeRun !== id) return;
      try {
        const resp = await aiuxFetch(`/api/x_snc_legwork/legwork/runs/${id}`);
        if (resp.ok) {
          const r = (await resp.json()).result;
          const finished =
            r.state === 'clear' || r.steps.some(s => s.step === 'close');
          if (this.activeRun !== id) return;
          this.progress = {...r, finished};
          if (finished) return;
        }
      } catch (err) {
        // keep polling; a failed poll is not a failed run
      }
      await new Promise(resolve => setTimeout(resolve, POLL_MS));
    }
    if (this.activeRun === id && this.progress) {
      this.progress = {...this.progress, finished: true};
    }
  }

  openClear() {
    this.renderRoot.querySelector('#clear-dialog')?.showModal();
  }

  closeClear() {
    this.renderRoot.querySelector('#clear-dialog')?.close();
  }

  // Removes every record the agents created and the run history. Admin only.
  async confirmClear() {
    this.closeClear();
    this.clearStatus = i18n.getMessage('Clearing demo data...');
    try {
      const clear = async () => {
        const resp = await aiuxFetch('/api/x_snc_legwork/legwork/clear', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: '{}'
        });
        if (!resp.ok) throw new Error(String(resp.status));
        return (await resp.json()).result;
      };
      let r = await clear();
      let records = r.removedRecords;
      let runs = r.removedRuns;
      // Records in other apps' tables can't be deleted from this app's scope,
      // so delete them here as the signed-in user, then clear the registry.
      if (r.leftover?.length) {
        for (const item of r.leftover) {
          await aiuxFetch(
            `/api/now/table/${item.table}/${item.id}`,
            {method: 'DELETE'}
          );
        }
        const again = await clear();
        records += again.removedRecords + r.leftover.length;
        runs += again.removedRuns;
      }
      this.progress = null;
      this.caseOpen = false;
      this.runStatus = '';
      this.clearStatus = i18n.getMessage(
        'Cleared {0} created records and {1} runs.',
        [records, runs]
      );
    } catch (err) {
      this.clearStatus = i18n.getMessage('Could not clear demo data: {0}', [
        err instanceof Error ? err.message : String(err)
      ]);
    }
  }

  async onRunComplete(e) {
    const {summary, clip} = e.detail;
    this.activeRun = null;
    this.progress = null;
    this.runStatus = i18n.getMessage('Posting run...');
    try {
      const resp = await aiuxFetch('/api/x_snc_legwork/legwork/runs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          label: clip,
          clip,
          overstride: summary.overstride,
          cadence: summary.cadence,
          trunkLean: summary.trunkLean,
          push: summary.push,
          dryRun: this.dryRun
        })
      });
      if (!resp.ok) throw new Error(String(resp.status));
      const data = await resp.json();
      this.runId = data.result.id;
      this.activeRun = data.result.id;
      this.runStatus = i18n.getMessage('Run posted. Workflow: {0}', [
        data.result.workflow
      ]);
      this.pollProgress(data.result.id);
    } catch (err) {
      this.runStatus = i18n.getMessage('Run failed to post: {0}', [
        err instanceof Error ? err.message : String(err)
      ]);
    }
  }

  onMetrics(e) {
    this.metrics = e.detail.metrics;
    this.history = [...this.history, e.detail.metrics].slice(-HISTORY_LENGTH);
  }

  render() {
    return html`
      <div class="mx-auto max-w-6xl">
        <p class="mb-4 text-sm text-text-secondary">
          ${i18n.getMessage('Runner form assessment')}
        </p>
        <div class="top ${this.caseOpen ? 'case-open' : ''}">
          <div class="flex flex-col gap-4">
            <div>
              <legwork-stage
                @legwork-stage:metrics=${this.onMetrics}
                @legwork-stage:run-complete=${this.onRunComplete}
              ></legwork-stage>
              <p class="mt-1 text-sm text-text-secondary" role="status">
                ${this.runStatus}
              </p>
            </div>
          </div>
          ${this.caseOpen
            ? html`<legwork-case
                .progress=${this.progress}
                @legwork-case:close=${() => (this.caseOpen = false)}
              ></legwork-case>`
            : html`<legwork-gauges
                .metrics=${this.metrics}
                .history=${this.history}
              ></legwork-gauges>`}
        </div>
        <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <legwork-agents
              .progress=${this.progress}
              @legwork-agents:open-case=${() => (this.caseOpen = true)}
            ></legwork-agents>
          </div>
          <legwork-compare .progress=${this.progress}></legwork-compare>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-base-300 pt-4">
            <label class="flex items-center gap-2 text-sm text-text-primary">
              <input
                type="checkbox"
                class="aiux-toggle aiux-toggle-sm"
                .checked=${!this.dryRun}
                @change=${e => (this.dryRun = !e.target.checked)}
              />
              ${this.dryRun
                ? i18n.getMessage('Dry run: agents log what they would do')
                : i18n.getMessage('Live: agents create real records')}
            </label>
            <div class="flex items-center gap-3">
              <button
                class="aiux-btn aiux-btn-outline aiux-btn-error aiux-btn-sm"
                @click=${this.openClear}
              >
                ${i18n.getMessage('Clear demo data')}
              </button>
              <span class="text-sm text-text-secondary" role="status"
                >${this.clearStatus}</span
              >
            </div>
            <dialog id="clear-dialog" class="aiux-modal">
              <div class="aiux-modal-box">
                <h3 class="text-lg font-bold">
                  ${i18n.getMessage('Clear demo data?')}
                </h3>
                <p class="py-3 text-sm">
                  ${i18n.getMessage(
                    'This deletes every assessment, drill and run the agents created for this demo. Other records are not touched.'
                  )}
                </p>
                <div class="aiux-modal-action">
                  <button class="aiux-btn aiux-btn-ghost" @click=${this.closeClear}>
                    ${i18n.getMessage('Cancel')}
                  </button>
                  <button class="aiux-btn aiux-btn-error" @click=${this.confirmClear}>
                    ${i18n.getMessage('Clear')}
                  </button>
                </div>
              </div>
            </dialog>
        </div>
      </div>
    `;
  }
}
