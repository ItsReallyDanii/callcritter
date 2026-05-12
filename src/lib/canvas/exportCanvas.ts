import type { SceneAnalysis } from "@/types/scene";

export function exportCanvasAsPng(canvas: HTMLCanvasElement) {
  return canvas.toDataURL("image/png");
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename = "callcritter-scene.png") {
  const link = document.createElement("a");
  link.href = exportCanvasAsPng(canvas);
  link.download = filename;
  link.click();
}

export function downloadShareCardPng({
  canvas,
  analysis,
  filename = "callcritter-share-card.png"
}: {
  canvas: HTMLCanvasElement;
  analysis?: SceneAnalysis | null;
  filename?: string;
}) {
  const card = document.createElement("canvas");
  card.width = 1600;
  card.height = 2000;

  const context = card.getContext("2d");
  if (!context) {
    throw new Error("Could not create a share card canvas.");
  }

  drawShareCardBackground(context, card.width, card.height);
  drawScenePreview(context, canvas);
  drawShareCardCopy(context, analysis);

  const link = document.createElement("a");
  link.href = card.toDataURL("image/png");
  link.download = filename;
  link.click();
}

function drawShareCardBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f7f7f2");
  gradient.addColorStop(0.58, "#eef3ec");
  gradient.addColorStop(1, "#dbe8dc");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(37, 111, 90, 0.09)";
  context.beginPath();
  context.arc(1280, 180, 360, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(245, 210, 139, 0.24)";
  context.beginPath();
  context.arc(160, 1780, 420, 0, Math.PI * 2);
  context.fill();
}

function drawScenePreview(context: CanvasRenderingContext2D, sourceCanvas: HTMLCanvasElement) {
  const x = 120;
  const y = 210;
  const width = 1360;
  const height = 1020;
  const radius = 42;

  context.save();
  context.shadowColor = "rgba(23, 24, 20, 0.22)";
  context.shadowBlur = 70;
  context.shadowOffsetY = 30;
  roundedRect(context, x, y, width, height, radius);
  context.fillStyle = "#ffffff";
  context.fill();
  context.restore();

  context.save();
  roundedRect(context, x + 24, y + 24, width - 48, height - 48, 30);
  context.clip();
  drawImageCover(context, sourceCanvas, x + 24, y + 24, width - 48, height - 48);
  context.restore();
}

function drawShareCardCopy(context: CanvasRenderingContext2D, analysis?: SceneAnalysis | null) {
  const companionName = analysis?.character_name?.trim() || "CallCritter Companion";
  const shareCaption =
    analysis?.share_caption?.trim() || "A tiny AI companion moved into my scene.";

  context.fillStyle = "#171814";
  context.font = "800 72px Arial, sans-serif";
  context.fillText("CallCritter", 120, 1370);

  context.fillStyle = "#256f5a";
  context.font = "800 38px Arial, sans-serif";
  context.fillText(companionName, 120, 1438);

  context.fillStyle = "#3e443c";
  context.font = "400 42px Arial, sans-serif";
  wrapText(context, shareCaption, 120, 1525, 1360, 58, 3);

  context.fillStyle = "#171814";
  context.font = "800 34px Arial, sans-serif";
  context.fillText("#OpenAIDevDay2026", 120, 1792);

  context.fillStyle = "#5e6257";
  context.font = "700 30px Arial, sans-serif";
  context.fillText("Built with GPT-5.5 + Image Gen", 120, 1852);
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const sourceWidth =
    image instanceof HTMLCanvasElement || image instanceof HTMLImageElement
      ? image.width
      : width;
  const sourceHeight =
    image instanceof HTMLCanvasElement || image instanceof HTMLImageElement
      ? image.height
      : height;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const scaledWidth = sourceWidth * scale;
  const scaledHeight = sourceHeight * scale;
  const dx = x + (width - scaledWidth) / 2;
  const dy = y + (height - scaledHeight) / 2;

  context.drawImage(image, dx, dy, scaledWidth, scaledHeight);
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  let line = "";
  let lineCount = 0;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && line) {
      context.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount += 1;

      if (lineCount >= maxLines) {
        return;
      }
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    context.fillText(line, x, y + lineCount * lineHeight);
  }
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
