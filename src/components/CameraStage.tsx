"use client";

import { useEffect, useRef } from "react";
import { captureFrame } from "@/lib/camera/captureFrame";

type CameraStageProps = {
  stream: MediaStream;
  onCapture: (imageUrl: string) => void;
  onError: (message: string) => void;
};

export function CameraStage({ stream, onCapture, onError }: CameraStageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.srcObject = stream;

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  function handleCapture() {
    const video = videoRef.current;
    if (!video) {
      onError("Camera preview is not mounted.");
      return;
    }

    try {
      onCapture(captureFrame(video));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not capture the camera frame.");
    }
  }

  return (
    <section className="stage-panel" aria-label="Camera preview">
      <div className="stage-toolbar">
        <div>
          <h2>Camera scene</h2>
          <p>Capture a local frame for the next prompt phase.</p>
        </div>
        <button className="button primary" type="button" onClick={handleCapture}>
          Capture Scene
        </button>
      </div>

      <video
        ref={videoRef}
        className="scene-preview"
        autoPlay
        muted
        playsInline
        aria-label="Live camera preview"
      />
    </section>
  );
}
