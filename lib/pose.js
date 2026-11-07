import {FilesetResolver, PoseLandmarker} from '@mediapipe/tasks-vision';

const WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export const POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

const toLandmarks = pose =>
  pose
    ? pose.map(p => ({x: p.x, y: p.y, z: p.z, visibility: p.visibility ?? 0}))
    : null;

// Runs PoseLandmarker over a <video> element. Construct and use on the client only.
// load() can run ahead of time (page open) so Start does not wait for the model;
// the landmarker stays alive across start/stop until close().
export class VideoPoseFeed {
  onFrame = null;
  landmarker = null;
  raf = 0;
  lastVideoTime = -1;
  lastTs = 0;
  loading = null;

  constructor(video) {
    this.video = video;
  }

  load() {
    if (!this.loading) {
      this.loading = (async () => {
        const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
        this.landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {modelAssetPath: MODEL_URL, delegate: 'GPU'},
          runningMode: 'VIDEO',
          numPoses: 1
        });
      })();
    }
    return this.loading;
  }

  // Timestamps must increase for the life of the landmarker.
  nextTimestamp() {
    this.lastTs = Math.max(this.lastTs + 1, performance.now());
    return this.lastTs;
  }

  // Landmarks for the frame the video is showing right now.
  detect() {
    const result = this.landmarker.detectForVideo(
      this.video,
      this.nextTimestamp()
    );
    return toLandmarks(result.landmarks[0]);
  }

  async start() {
    await this.load();
    this.lastVideoTime = -1;
    await this.video.play();
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.video.pause();
  }

  close() {
    this.stop();
    this.landmarker?.close();
    this.landmarker = null;
    this.loading = null;
  }

  loop = () => {
    if (!this.landmarker) return;
    if (
      this.video.currentTime !== this.lastVideoTime &&
      this.video.readyState >= 2
    ) {
      this.lastVideoTime = this.video.currentTime;
      const t = performance.now();
      this.onFrame?.(this.detect(), t);
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
