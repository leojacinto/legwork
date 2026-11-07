import {html, css, nothing, isServer} from 'lit';
import {customElement} from 'lit/decorators.js';
import {AIUXElement} from '@servicenow/aiux/aiux-components-core';
import {i18n} from '@servicenow/aiux/aiux-services';
import {BiomechAnalyzer} from '../../../lib/biomech.js';
import {RunSummary} from '../../../lib/summary.js';

// Session 1 and 2 are Run 1 and Run 5 (treadmill footage), attached to the holder property.
const CLIPS = [
  {
    id: 'clip1',
    label: () => i18n.getMessage('Session 1: baseline'),
    name: 'Session 1',
    url: '/sys_attachment.do?sys_id=52a8431347d85f90037d0fadf26d4359'
  },
  {
    id: 'clip2',
    label: () => i18n.getMessage('Session 2: re-score'),
    name: 'Session 2',
    url: '/sys_attachment.do?sys_id=8fa8c31347d85f90037d0fadf26d430f'
  }
];
const MIN_VISIBILITY = 0.4;
const EMIT_INTERVAL_MS = 100;
const FADE_MS = 450;
// A frame with the runner in view, used for the paused wireframe.
const STILL_AT_S = 1;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Video + skeleton overlay. Everything that touches the camera, <video>, canvas,
// MediaPipe or requestAnimationFrame lives in start()/draw(), after hydration.
@customElement('legwork-stage')
export default class LegworkStage extends AIUXElement {
  static properties = {
    running: {state: true},
    error: {state: true},
    clipId: {state: true},
    fading: {state: true}
  };

  static styles = css`
    :host {
      display: block;
    }
    .stage {
      position: relative;
      aspect-ratio: 16 / 9;
      width: 100%;
      overflow: hidden;
      background: var(--color-neutral, #000);
    }
    video,
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    video {
      object-fit: fill;
    }
    video,
    canvas {
      transition: opacity var(--duration-moderate, 450ms) ease;
    }
    .stage.fading video,
    .stage.fading canvas {
      opacity: 0;
    }
    @media (prefers-reduced-motion: reduce) {
      video,
      canvas {
        transition: none;
      }
    }
  `;

  constructor() {
    super();
    this.running = false;
    this.error = '';
    this.clipId = 'clip1';
    this.fading = false;
    this.scored = false;
    this.analyzer = new BiomechAnalyzer();
    this.feed = null;
    this.connections = [];
    this.latest = null;
    this.raf = 0;
    this.lastEmit = 0;
    this.metrics = null;
    this.summary = new RunSummary();
  }

  // Load the model as soon as the page is up and warm it on a still frame, so
  // Start plays straight away and the wireframe shows before the first run.
  firstUpdated() {
    if (isServer) return;
    this.ready = this.prepare();
  }

  async prepare() {
    try {
      const {VideoPoseFeed, POSE_CONNECTIONS} = await import(
        '../../../lib/pose.js'
      );
      this.connections = POSE_CONNECTIONS;
      const video = this.renderRoot.querySelector('#video');
      this.feed = new VideoPoseFeed(video);
      await this.feed.load();
      await this.showStill();
      // Warm the other session's clip so switching tabs does not wait on the network.
      for (const c of CLIPS) {
        if (c.id !== this.clipId && c.url) fetch(c.url).catch(() => {});
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
    }
  }

  // Wireframe on a paused frame, shown before the first run and after a stop.
  async showStill() {
    const video = this.renderRoot.querySelector('#video');
    if (!this.feed?.landmarker || !video || this.running) return;
    if (video.readyState < 2) return;
    video.currentTime = Math.min(STILL_AT_S, (video.duration || STILL_AT_S) / 2);
    await new Promise(resolve => {
      video.onseeked = resolve;
    });
    this.latest = this.feed.detect();
    this.draw();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    cancelAnimationFrame(this.raf);
    this.feed?.close();
  }

  render() {
    return html`
      <div class="aiux-card bg-base-100 shadow-sm">
        <div role="tablist" class="aiux-tabs aiux-tabs-border px-3 pt-2">
          ${CLIPS.map(
            c => html`<button
              role="tab"
              class="aiux-tab ${c.id === this.clipId ? 'aiux-tab-active' : ''}"
              aria-selected=${c.id === this.clipId ? 'true' : 'false'}
              ?disabled=${!c.url}
              @click=${() => this.selectClip(c.id)}
            >
              ${c.label()}${c.url ? nothing : html` (${i18n.getMessage('not uploaded yet')})`}
            </button>`
          )}
        </div>
        <div class="stage ${this.fading ? 'fading' : ''}">
          <video
            id="video"
            muted
            playsinline
            preload="auto"
            @loadeddata=${() => this.showStill()}
            src=${this.clip.url || nothing}
            aria-label=${i18n.getMessage('Runner on a curved treadmill')}
          ></video>
          <canvas id="overlay" aria-hidden="true"></canvas>
        </div>
        <div class="aiux-card-body flex-row items-center gap-2 p-3">
          <button
            class="aiux-btn aiux-btn-primary aiux-btn-sm"
            @click=${this.toggle}
          >
            ${this.running
              ? i18n.getMessage('Stop')
              : i18n.getMessage('Start')}
          </button>
          <button
            class="aiux-btn aiux-btn-outline aiux-btn-sm"
            @click=${() => this.analyzer.setBack()}
          >
            ${i18n.getMessage('Set back')}
          </button>
          <button
            class="aiux-btn aiux-btn-outline aiux-btn-sm"
            @click=${() => this.analyzer.setFront()}
          >
            ${i18n.getMessage('Set front')}
          </button>
          <button
            class="aiux-btn aiux-btn-ghost aiux-btn-sm"
            @click=${() => this.analyzer.resetCalibration()}
          >
            ${i18n.getMessage('Auto range')}
          </button>
          <span class="text-error text-sm" role="alert">${this.error}</span>
        </div>
      </div>
    `;
  }

  get clip() {
    return CLIPS.find(c => c.id === this.clipId) ?? CLIPS[0];
  }

  selectClip(id) {
    if (id === this.clipId) return;
    this.stop();
    this.latest = null;
    this.draw();
    this.clipId = id;
  }

  toggle() {
    if (this.running) this.stop();
    else this.start();
  }

  async start() {
    if (isServer) return;
    this.error = '';
    const video = this.renderRoot.querySelector('#video');
    try {
      await this.ready;
      if (!this.feed) throw new Error(i18n.getMessage('Pose model did not load'));
      this.feed.onFrame = (lm, t) => {
        this.latest = lm;
        this.metrics = this.analyzer.update(lm, t);
        // Only the first pass is scored. Later loops are just for the eye.
        if (!this.scored) this.summary.add(this.metrics, t);
      };
      this.scored = false;
      this.summary.reset();
      video.loop = false;
      video.currentTime = 0;
      video.onended = () => this.onEnded();
      await this.feed.start();
      this.running = true;
      this.raf = requestAnimationFrame(this.tick);
    } catch (err) {
      this.error = err instanceof Error ? err.message : String(err);
      this.stop();
    }
  }

  // End of the clip. The first time: hand the scored run to the page. Every
  // time: fade out, restart, fade in, so the loop never jumps.
  async onEnded() {
    if (!this.scored) {
      this.scored = true;
      this.dispatchEvent(
        new CustomEvent('legwork-stage:run-complete', {
          detail: {summary: this.summary.summarise(), clip: this.clip.name},
          bubbles: true,
          composed: true
        })
      );
    }
    const video = this.renderRoot.querySelector('#video');
    this.fading = true;
    await sleep(FADE_MS);
    if (!this.running) return;
    video.currentTime = 0;
    await video.play();
    this.fading = false;
  }

  // Stops playback but leaves the last wireframe on screen.
  stop() {
    cancelAnimationFrame(this.raf);
    this.feed?.stop();
    this.running = false;
    this.fading = false;
  }

  tick = now => {
    this.draw();
    if (this.metrics && now - this.lastEmit > EMIT_INTERVAL_MS) {
      this.lastEmit = now;
      this.dispatchEvent(
        new CustomEvent('legwork-stage:metrics', {
          detail: {metrics: this.metrics, t: now},
          bubbles: true,
          composed: true
        })
      );
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  draw() {
    const canvas = this.renderRoot.querySelector('#overlay');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const lm = this.latest;
    if (!lm) return;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    for (const c of this.connections) {
      const a = lm[c.start];
      const b = lm[c.end];
      if (a.visibility < MIN_VISIBILITY || b.visibility < MIN_VISIBILITY) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(a.x * w, a.y * h);
      ctx.lineTo(b.x * w, b.y * h);
      ctx.stroke();
    }
    ctx.fillStyle = '#e6edf3';
    for (const p of lm) {
      if (p.visibility < MIN_VISIBILITY) continue;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
