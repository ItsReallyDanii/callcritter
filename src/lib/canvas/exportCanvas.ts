export function exportCanvasAsPng(canvas: HTMLCanvasElement) {
  return canvas.toDataURL("image/png");
}

export function downloadCanvasPng(canvas: HTMLCanvasElement, filename = "callcritter-scene.png") {
  const link = document.createElement("a");
  link.href = exportCanvasAsPng(canvas);
  link.download = filename;
  link.click();
}
