import {
  degreesToRadians,
  getCompanionDisplaySize,
  type CompanionTransform
} from "@/lib/canvas/transform";

export type CompositeSceneOptions = {
  canvas: HTMLCanvasElement;
  sceneImage: HTMLImageElement;
  companionImage: HTMLImageElement;
  transform: CompanionTransform;
};

const stickerPadding = 24;

export function compositeScene({
  canvas,
  sceneImage,
  companionImage,
  transform
}: CompositeSceneOptions) {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create a canvas context.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(sceneImage, 0, 0, canvas.width, canvas.height);

  if (transform.blendTint) {
    drawBlendTint(context, transform);
  }

  drawCompanion(context, companionImage, transform);
}

export function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image for canvas compositing."));
    image.src = src;
  });
}

function drawCompanion(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  transform: CompanionTransform
) {
  const size = getCompanionDisplaySize(transform, {
    width: image.naturalWidth,
    height: image.naturalHeight
  });
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  context.save();
  context.translate(transform.x, transform.y);
  context.rotate(degreesToRadians(transform.rotation));
  context.globalAlpha = transform.opacity;

  if (transform.stickerFrame) {
    drawStickerFrame(context, size.width, size.height);
  } else if (transform.shadow) {
    context.shadowColor = "rgba(15, 24, 18, 0.34)";
    context.shadowBlur = Math.max(18, size.width * 0.08);
    context.shadowOffsetY = Math.max(8, size.height * 0.045);
  }

  if (transform.stickerFrame) {
    context.save();
    roundedRect(
      context,
      -halfWidth,
      -halfHeight,
      size.width,
      size.height,
      Math.max(18, Math.min(size.width, size.height) * 0.07)
    );
    context.clip();
    context.drawImage(image, -halfWidth, -halfHeight, size.width, size.height);
    context.restore();
  } else {
    context.drawImage(image, -halfWidth, -halfHeight, size.width, size.height);
  }

  context.restore();
}

function drawStickerFrame(context: CanvasRenderingContext2D, width: number, height: number) {
  const frameWidth = width + stickerPadding;
  const frameHeight = height + stickerPadding;
  const radius = Math.max(22, Math.min(frameWidth, frameHeight) * 0.08);

  context.save();
  if (context.shadowColor) {
    context.shadowColor = "rgba(15, 24, 18, 0.28)";
    context.shadowBlur = Math.max(20, frameWidth * 0.08);
    context.shadowOffsetY = Math.max(8, frameHeight * 0.04);
  }
  roundedRect(context, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight, radius);
  context.fillStyle = "rgba(255, 255, 255, 0.94)";
  context.fill();
  context.shadowColor = "transparent";
  context.lineWidth = Math.max(5, frameWidth * 0.012);
  context.strokeStyle = "rgba(255, 255, 255, 0.98)";
  context.stroke();
  context.restore();
}

function drawBlendTint(context: CanvasRenderingContext2D, transform: CompanionTransform) {
  const radius = Math.max(context.canvas.width, context.canvas.height) * 0.18 * transform.scale;
  const gradient = context.createRadialGradient(
    transform.x,
    transform.y,
    0,
    transform.x,
    transform.y,
    radius
  );

  gradient.addColorStop(0, "rgba(245, 210, 139, 0.18)");
  gradient.addColorStop(0.55, "rgba(37, 111, 90, 0.08)");
  gradient.addColorStop(1, "rgba(37, 111, 90, 0)");

  context.save();
  context.globalCompositeOperation = "multiply";
  context.fillStyle = gradient;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}
