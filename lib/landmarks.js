// MediaPipe pose model indices (33 points).
export const LM = {
  L_SHOULDER: 11,
  R_SHOULDER: 12,
  L_ELBOW: 13,
  R_ELBOW: 14,
  L_WRIST: 15,
  R_WRIST: 16,
  L_HIP: 23,
  R_HIP: 24,
  L_ANKLE: 27,
  R_ANKLE: 28
};

export const EMPTY_METRICS = {
  push: 0.5,
  torsoX: 0.5,
  cadence: 0,
  trunkLean: 0,
  armAngle: 0,
  stride: 0,
  calibrated: false,
  tracking: false
};
