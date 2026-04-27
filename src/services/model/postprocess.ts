import { LABELS } from './labels';

export type Detection = {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  classIndex: number;
  label: string;
};

const NUM_CLASSES = 6;
const CONFIDENCE_THRESHOLD = 0.25;
const IOU_THRESHOLD = 0.45;
const NUM_BOXES = 8400;
const NUM_FEATURES = 10;

function iou(a: Detection, b: Detection) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);

  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const union =
    a.width * a.height + b.width * b.height - inter;

  return union <= 0 ? 0 : inter / union;
}

function nonMaxSuppression(detections: Detection[]) {
  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const kept: Detection[] = [];

  while (sorted.length > 0) {
    const current = sorted.shift()!;
    kept.push(current);

    for (let i = sorted.length - 1; i >= 0; i--) {
      if (
        sorted[i].classIndex === current.classIndex &&
        iou(current, sorted[i]) > IOU_THRESHOLD
      ) {
        sorted.splice(i, 1);
      }
    }
  }

  return kept;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function decodeYoloOutput(raw: any): Detection[] {
  const output = Array.isArray(raw) ? raw[0] : raw;
  const flat = Array.from(output as ArrayLike<number>);

  if (flat.length !== NUM_BOXES * NUM_FEATURES) {
    console.warn('Unexpected output length:', flat.length);
    return [];
  }

  const detections: Detection[] = [];

  for (let b = 0; b < NUM_BOXES; b++) {
    const cx = flat[0 * NUM_BOXES + b];
    const cy = flat[1 * NUM_BOXES + b];
    const w = flat[2 * NUM_BOXES + b];
    const h = flat[3 * NUM_BOXES + b];

    let bestClass = -1;
    let bestScore = -Infinity;

    for (let c = 0; c < NUM_CLASSES; c++) {
      const score = flat[(4 + c) * NUM_BOXES + b];
      if (score > bestScore) {
        bestScore = score;
        bestClass = c;
      }
    }

    if (bestScore < CONFIDENCE_THRESHOLD) continue;

    // ✅ convert center → top-left
    const x = clamp(cx - w / 2, 0, 640);
    const y = clamp(cy - h / 2, 0, 640);

    detections.push({
      x,
      y,
      width: clamp(w, 0, 640),
      height: clamp(h, 0, 640),
      confidence: bestScore,
      classIndex: bestClass,
      label: LABELS[bestClass] ?? 'unknown',
    });
  }

  console.log('Detections before NMS:', detections.length);

  const finalDetections = nonMaxSuppression(detections);

  console.log('Detections after NMS:', finalDetections.length);

  return finalDetections;
}