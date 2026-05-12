import type { SceneAnalysis } from "@/types/scene";

export type CanvasPoint = {
  x: number;
  y: number;
};

export type CanvasSize = {
  width: number;
  height: number;
};

export type ImageSize = CanvasSize;

export type CompanionTransform = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  shadow: boolean;
  stickerFrame: boolean;
  blendTint: boolean;
};

export const defaultTransformSettings = {
  opacity: 0.96,
  shadow: true,
  stickerFrame: false,
  blendTint: true
};

export function createDefaultCompanionTransform({
  canvas,
  companion,
  analysis,
  forceStickerFrame = false
}: {
  canvas: CanvasSize;
  companion: ImageSize;
  analysis?: SceneAnalysis | null;
  forceStickerFrame?: boolean;
}): CompanionTransform {
  const targetWidth = canvas.width * 0.3;
  const scale = clamp(targetWidth / companion.width, 0.05, 1.5);
  const placement = inferPlacement(analysis);

  const transform: CompanionTransform = {
    x: canvas.width * placement.xRatio,
    y: canvas.height * placement.yRatio,
    scale,
    rotation: placement.rotation,
    opacity: defaultTransformSettings.opacity,
    shadow: defaultTransformSettings.shadow,
    stickerFrame: forceStickerFrame,
    blendTint: defaultTransformSettings.blendTint
  };

  return clampTransformToCanvas(transform, canvas, companion);
}

export function getCompanionDisplaySize(
  transform: CompanionTransform,
  companion: ImageSize
): ImageSize {
  return {
    width: companion.width * transform.scale,
    height: companion.height * transform.scale
  };
}

export function clampTransformToCanvas(
  transform: CompanionTransform,
  canvas: CanvasSize,
  companion: ImageSize
): CompanionTransform {
  const size = getRotatedBounds(getCompanionDisplaySize(transform, companion), transform.rotation);
  const margin = Math.min(canvas.width, canvas.height) * 0.035;
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  return {
    ...transform,
    x: clamp(transform.x, Math.min(canvas.width / 2, halfWidth - margin), Math.max(canvas.width / 2, canvas.width - halfWidth + margin)),
    y: clamp(transform.y, Math.min(canvas.height / 2, halfHeight - margin), Math.max(canvas.height / 2, canvas.height - halfHeight + margin)),
    scale: clamp(transform.scale, 0.04, 2),
    rotation: normalizeRotation(transform.rotation),
    opacity: clamp(transform.opacity, 0.35, 1)
  };
}

export function screenPointToCanvasPoint(
  event: Pick<PointerEvent, "clientX" | "clientY">,
  canvas: HTMLCanvasElement
): CanvasPoint {
  const rect = canvas.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height
  };
}

export function hitTestCompanion({
  point,
  transform,
  companion
}: {
  point: CanvasPoint;
  transform: CompanionTransform;
  companion: ImageSize;
}) {
  const size = getCompanionDisplaySize(transform, companion);
  const radians = degreesToRadians(-transform.rotation);
  const dx = point.x - transform.x;
  const dy = point.y - transform.y;
  const localX = dx * Math.cos(radians) - dy * Math.sin(radians);
  const localY = dx * Math.sin(radians) + dy * Math.cos(radians);

  return Math.abs(localX) <= size.width / 2 && Math.abs(localY) <= size.height / 2;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getRotatedBounds(size: ImageSize, rotation: number): ImageSize {
  const radians = degreesToRadians(rotation);
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  return {
    width: size.width * cos + size.height * sin,
    height: size.width * sin + size.height * cos
  };
}

function normalizeRotation(rotation: number) {
  if (rotation > 180) {
    return rotation - 360;
  }

  if (rotation < -180) {
    return rotation + 360;
  }

  return rotation;
}

function inferPlacement(analysis?: SceneAnalysis | null) {
  const text = [
    analysis?.placement_recommendation,
    analysis?.likely_attachment_points.map((point) => `${point.label} ${point.placement_hint}`).join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let xRatio = 0.74;
  let yRatio = 0.72;

  if (text.includes("left")) {
    xRatio = 0.28;
  } else if (text.includes("center") || text.includes("middle")) {
    xRatio = 0.5;
  }

  if (text.includes("top") || text.includes("shelf") || text.includes("monitor")) {
    yRatio = 0.34;
  } else if (text.includes("keyboard") || text.includes("desk") || text.includes("table")) {
    yRatio = 0.68;
  } else if (text.includes("bottom") || text.includes("lower")) {
    yRatio = 0.76;
  }

  return {
    xRatio,
    yRatio,
    rotation: text.includes("edge") ? -4 : 0
  };
}
