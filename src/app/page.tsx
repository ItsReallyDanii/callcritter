"use client";

/* eslint-disable @next/next/no-img-element -- Snapshot previews can be runtime data URLs. */
import { useEffect, useMemo, useRef, useState } from "react";
import { BuiltWithFooter } from "@/components/BuiltWithFooter";
import { CameraStage } from "@/components/CameraStage";
import { DemoScenePicker } from "@/components/DemoScenePicker";
import { ErrorBanner } from "@/components/ErrorBanner";
import type { AppMode, DemoScene, Snapshot } from "@/types/app";

const demoScenes: DemoScene[] = [
  {
    id: "desk-sample",
    title: "Desk sample",
    description: "A tidy desk scene with space for a tiny companion.",
    src: "/demo-assets/desk-sample-01.svg"
  }
];

export default function Home() {
  const [mode, setMode] = useState<AppMode>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedDemoScene, setSelectedDemoScene] = useState<DemoScene>(demoScenes[0]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cameraRequestIdRef = useRef(0);

  const statusLabel = useMemo(() => {
    switch (mode) {
      case "camera_requested":
        return "Requesting camera permission";
      case "camera_ready":
        return "Camera ready";
      case "demo_ready":
        return "Demo scene ready";
      case "snapshot_captured":
        return "Snapshot captured";
      case "error":
        return "Camera fallback active";
      case "idle":
      default:
        return "Choose a scene source";
    }
  }, [mode]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function handleUseCamera() {
    const requestId = cameraRequestIdRef.current + 1;
    cameraRequestIdRef.current = requestId;
    setErrorMessage(null);
    setSnapshot(null);
    setMode("camera_requested");

    if (!navigator.mediaDevices?.getUserMedia) {
      handleCameraFailure("This browser does not expose getUserMedia. Demo mode is ready.");
      return;
    }

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (cameraRequestIdRef.current !== requestId) {
        nextStream.getTracks().forEach((track) => track.stop());
        return;
      }

      stream?.getTracks().forEach((track) => track.stop());
      setStream(nextStream);
      setMode("camera_ready");
    } catch (error) {
      if (cameraRequestIdRef.current !== requestId) {
        return;
      }

      const message =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : "Camera permission was denied or unavailable.";
      handleCameraFailure(`${message} Demo mode is ready.`);
    }
  }

  function handleCameraFailure(message: string) {
    cameraRequestIdRef.current += 1;
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setErrorMessage(message);
    setMode("error");
  }

  function handleTryDemoScene() {
    cameraRequestIdRef.current += 1;
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setErrorMessage(null);
    setSnapshot(null);
    setMode("demo_ready");
  }

  function handleCameraSnapshot(imageUrl: string) {
    cameraRequestIdRef.current += 1;
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setSnapshot({
      source: "camera",
      imageUrl,
      capturedAt: new Date().toISOString()
    });
    setMode("snapshot_captured");
  }

  function handleDemoSnapshot() {
    setSnapshot({
      source: "demo",
      imageUrl: selectedDemoScene.src,
      capturedAt: new Date().toISOString()
    });
    setMode("snapshot_captured");
  }

  const showDemoPicker = mode === "demo_ready" || mode === "error";

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <h1>CallCritter</h1>
          <p>
            A scene-aware AI companion generator for a real camera space. This first
            scaffold captures a camera or demo scene before later GPT-5.5 analysis and
            Image Gen companion creation.
          </p>

          <div className="mode-actions" aria-label="Scene source">
            <button className="button primary" type="button" onClick={handleUseCamera}>
              Use My Camera
            </button>
            <button className="button secondary" type="button" onClick={handleTryDemoScene}>
              Try Demo Scene
            </button>
          </div>
        </div>

        <aside className="state-card" aria-label="App state">
          <span>State</span>
          <strong>{mode}</strong>
          <p>{statusLabel}</p>
        </aside>
      </section>

      {errorMessage ? <ErrorBanner message={errorMessage} /> : null}

      <section className="workspace" aria-live="polite">
        {mode === "idle" || mode === "camera_requested" ? (
          <div className="empty-stage">
            <h2>{mode === "camera_requested" ? "Waiting for camera" : "Ready for a scene"}</h2>
            <p>
              Pick camera mode for a live preview or use the local demo scene if camera
              permission is unavailable.
            </p>
          </div>
        ) : null}

        {mode === "camera_ready" && stream ? (
          <CameraStage
            stream={stream}
            onCapture={handleCameraSnapshot}
            onError={handleCameraFailure}
          />
        ) : null}

        {showDemoPicker ? (
          <DemoScenePicker
            scenes={demoScenes}
            selectedSceneId={selectedDemoScene.id}
            onSelectScene={setSelectedDemoScene}
            onCaptureScene={handleDemoSnapshot}
          />
        ) : null}

        {mode === "snapshot_captured" && snapshot ? (
          <section className="stage-panel" aria-label="Captured snapshot">
            <div className="stage-toolbar">
              <div>
                <h2>Snapshot captured</h2>
                <p>
                  Source: {snapshot.source}. AI scene analysis is intentionally not wired in
                  Prompt 01.
                </p>
              </div>
              <button className="button secondary" type="button" onClick={handleTryDemoScene}>
                Reset to Demo
              </button>
            </div>
            <img className="scene-preview" src={snapshot.imageUrl} alt="Captured scene preview" />
          </section>
        ) : null}
      </section>

      <BuiltWithFooter />
    </main>
  );
}
