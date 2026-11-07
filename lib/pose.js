import {FilesetResolver, PoseLandmarker} from '@mediapipe/tasks-vision';

const WASM_BASE =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

export const POSE_CONNECTIONS = PoseLandmarker.POSE_CONNECTIONS;

// Runs PoseLandmarker over a <video> element. Construct and start on the client only.
export class VideoPoseFeed {
  onFrame = null;
  landmarker = null;
  raf = 0;
  lastVideoTime = -1;

  constructor(video) {
    this.video = video;
  }

  async start() {
    const vision = await FilesetResolver.forVisionTasks(WASM_BASE);
    this.landmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {modelAssetPath: MODEL_URL, delegate: 'GPU'},
      runningMode: 'VIDEO',
      numPoses: 1
    });
    await this.video.play();
    this.loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.video.pause();
    this.landmarker?.close();
    this.landmarker = null;
  }

  loop = () => {
    if (!this.landmarker) return;
    if (
      this.video.currentTime !== this.lastVideoTime &&
      this.video.readyState >= 2
    ) {
      this.lastVideoTime = this.video.currentTime;
      const t = performance.now();
      const result = this.landmarker.detectForVideo(this.video, t);
      const pose = result.landmarks[0];
      this.onFrame?.(
        pose
          ? pose.map(p => ({
              x: p.x,
              y: p.y,
              z: p.z,
              visibility: p.visibility ?? 0
            }))
          : null,
        t
      );
    }
    this.raf = requestAnimationFrame(this.loop);
  };
}
