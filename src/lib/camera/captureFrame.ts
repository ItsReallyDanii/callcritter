export function captureFrame(video: HTMLVideoElement): string {
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (width === 0 || height === 0) {
    throw new Error("Camera stream is not ready yet.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not create a canvas context for the snapshot.");
  }

  context.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.86);
}
