"use client";

/* eslint-disable @next/next/no-img-element -- Snapshot and generated previews can be runtime data URLs. */
import { useEffect, useMemo, useRef, useState } from "react";
import { BuiltWithFooter } from "@/components/BuiltWithFooter";
import { CameraStage } from "@/components/CameraStage";
import { CanvasEditor } from "@/components/CanvasEditor";
import { CompanionPreview } from "@/components/CompanionPreview";
import { DemoScenePicker } from "@/components/DemoScenePicker";
import { ErrorBanner } from "@/components/ErrorBanner";
import { LoadingState } from "@/components/LoadingState";
import { SceneReadout } from "@/components/SceneReadout";
import type { AppMode, DemoScene, Snapshot } from "@/types/app";
import type { CompanionMode, SceneAnalysis } from "@/types/scene";

const demoScenes: DemoScene[] = [
  {
    id: "desk-sample",
    title: "Desk sample",
    description: "A tidy desk scene with space for a tiny companion.",
    src: "/demo-assets/desk-sample-01.svg"
  }
];

const companionMode: CompanionMode = "Desk Critter";
const generationSessionKey = "callcritter_generation_used";
const fallbackCompanionSrc = "/demo-assets/fallback-companion.svg";

type ApiError = {
  code: string;
  message: string;
};

type AnalyzeResponse =
  | {
      ok: true;
      analysis: SceneAnalysis;
      model: string;
      used_fallback: boolean;
    }
  | {
      ok: false;
      error: ApiError;
    };

type GenerateResponse =
  | {
      ok: true;
      image: {
        data_url: string;
        base64_png: string;
        model: string;
        revised_prompt?: string;
      };
    }
  | {
      ok: false;
      error: ApiError;
    };

export default function Home() {
  const [mode, setMode] = useState<AppMode>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedDemoScene, setSelectedDemoScene] = useState<DemoScene>(demoScenes[0]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [analysis, setAnalysis] = useState<SceneAnalysis | null>(null);
  const [analysisUsedFallback, setAnalysisUsedFallback] = useState(false);
  const [companionImage, setCompanionImage] = useState<{
    imageUrl: string;
    isFallback: boolean;
  } | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [generationUsed, setGenerationUsed] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
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
      case "analysis_requested":
        return "Reading your scene";
      case "analysis_ready":
        return "Scene analysis ready";
      case "generation_requested":
        return "Generating your companion";
      case "companion_ready":
        return "Companion preview ready";
      case "canvas_editor":
        return "Canvas editor ready";
      case "error":
        return "Camera fallback active";
      case "idle":
      default:
        return "Choose a scene source";
    }
  }, [mode]);

  useEffect(() => {
    setGenerationUsed(sessionStorage.getItem(generationSessionKey) === "true");
  }, []);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  async function handleUseCamera() {
    const requestId = cameraRequestIdRef.current + 1;
    cameraRequestIdRef.current = requestId;
    clearAiState();
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
    clearAiState();
    setMode("demo_ready");
  }

  function handleCameraSnapshot(imageUrl: string) {
    cameraRequestIdRef.current += 1;
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    clearAiState();
    setSnapshot({
      source: "camera",
      imageUrl,
      capturedAt: new Date().toISOString()
    });
    setMode("snapshot_captured");
  }

  function handleDemoSnapshot() {
    clearAiState();
    setSnapshot({
      source: "demo",
      imageUrl: selectedDemoScene.src,
      capturedAt: new Date().toISOString()
    });
    setMode("snapshot_captured");
  }

  async function handleAnalyzeScene() {
    if (!snapshot) {
      return;
    }

    setApiErrorMessage(null);
    setAnalysis(null);
    setCompanionImage(null);
    setEditorOpen(false);
    setLoadingMessage("Reading your scene...");
    setMode("analysis_requested");

    try {
      const image = await imageUrlToPngDataUrl(snapshot.imageUrl);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image,
          mode: companionMode
        })
      });
      const payload = (await response.json()) as AnalyzeResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "Scene analysis failed." : payload.error.message);
      }

      setLoadingMessage("Designing your companion...");
      setAnalysis(payload.analysis);
      setAnalysisUsedFallback(payload.used_fallback);
      setMode("analysis_ready");
    } catch (error) {
      setApiErrorMessage(
        error instanceof Error ? error.message : "Scene analysis failed. Try demo mode or retry."
      );
      setMode("snapshot_captured");
    } finally {
      setLoadingMessage(null);
    }
  }

  async function handleGenerateCompanion() {
    if (!analysis) {
      return;
    }

    if (generationUsed) {
      setApiErrorMessage("One companion generation has already been used in this browser session.");
      return;
    }

    setApiErrorMessage(null);
    setCompanionImage(null);
    setMode("generation_requested");
    setLoadingMessage("Designing your companion...");
    await waitForNextPaint();
    setLoadingMessage("Generating your companion...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image_prompt: analysis.image_prompt,
          mode: companionMode,
          scene_metadata: analysis
        })
      });
      const payload = (await response.json()) as GenerateResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.ok ? "Generation failed. Try demo mode or retry." : payload.error.message);
      }

      sessionStorage.setItem(generationSessionKey, "true");
      setGenerationUsed(true);
      setCompanionImage({
        imageUrl: payload.image.data_url,
        isFallback: false
      });
      setEditorOpen(false);
      setMode("companion_ready");
    } catch (error) {
      setApiErrorMessage(
        error instanceof Error ? error.message : "Generation failed. Try demo mode or retry."
      );
      setCompanionImage({
        imageUrl: fallbackCompanionSrc,
        isFallback: true
      });
      setEditorOpen(false);
      setMode("analysis_ready");
    } finally {
      setLoadingMessage(null);
    }
  }

  function clearAiState() {
    setAnalysis(null);
    setAnalysisUsedFallback(false);
    setCompanionImage(null);
    setEditorOpen(false);
    setLoadingMessage(null);
    setApiErrorMessage(null);
  }

  const showDemoPicker = mode === "demo_ready" || mode === "error";
  const hasSnapshot = Boolean(snapshot);
  const canAnalyze = Boolean(snapshot) && mode !== "analysis_requested" && mode !== "generation_requested";
  const canGenerate =
    Boolean(analysis) && mode !== "generation_requested" && mode !== "analysis_requested";

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero-copy">
          <h1>CallCritter</h1>
          <p>
            A scene-aware AI companion generator for a real camera space. This Prompt 03
            build analyzes a scene, generates a companion, and lets you composite it
            on canvas.
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
      {apiErrorMessage ? <ErrorBanner title="AI request failed." message={apiErrorMessage} /> : null}
      {loadingMessage ? <LoadingState message={loadingMessage} /> : null}

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

        {hasSnapshot && snapshot ? (
          <section className="stage-panel" aria-label="Captured snapshot">
            <div className="stage-toolbar">
              <div>
                <h2>Snapshot captured</h2>
                <p>
                  Source: {snapshot.source}. The image stays local until you click
                  Analyze Scene.
                </p>
              </div>
              <div className="toolbar-actions">
                <button
                  className="button primary"
                  type="button"
                  onClick={handleAnalyzeScene}
                  disabled={!canAnalyze}
                >
                  Analyze Scene
                </button>
                <button className="button secondary" type="button" onClick={handleTryDemoScene}>
                  Reset to Demo
                </button>
              </div>
            </div>
            <img className="scene-preview" src={snapshot.imageUrl} alt="Captured scene preview" />
          </section>
        ) : null}

        {analysis ? (
          <>
            <SceneReadout analysis={analysis} usedFallback={analysisUsedFallback} />
            <section className="stage-panel action-panel" aria-label="Companion generation">
              <div>
                <h2>Companion generation</h2>
                <p>
                  Mode: {companionMode}. One successful generation is allowed per browser
                  session in this Prompt 03 build.
                </p>
              </div>
              <button
                className="button primary"
                type="button"
                onClick={handleGenerateCompanion}
                disabled={!canGenerate || generationUsed}
              >
                Generate Companion
              </button>
            </section>
          </>
        ) : null}

        {companionImage ? (
          <>
            <CompanionPreview
              imageUrl={companionImage.imageUrl}
              isFallback={companionImage.isFallback}
            />
            <section className="stage-panel action-panel" aria-label="Canvas editor launch">
              <div>
                <h2>Scene compositing</h2>
                <p>
                  Open the canvas editor to place, blend, and export the companion over
                  the captured scene.
                </p>
              </div>
              <button
                className="button primary"
                type="button"
                onClick={() => {
                  setEditorOpen(true);
                  setMode("canvas_editor");
                }}
                disabled={!snapshot}
              >
                Open Canvas Editor
              </button>
            </section>
          </>
        ) : null}

        {editorOpen && snapshot && companionImage ? (
          <CanvasEditor
            sceneImageUrl={snapshot.imageUrl}
            companionImageUrl={companionImage.imageUrl}
            analysis={analysis}
            isStickerFallback={companionImage.isFallback}
          />
        ) : null}
      </section>

      <BuiltWithFooter />
    </main>
  );
}

async function imageUrlToPngDataUrl(src: string) {
  if (src.startsWith("data:image/")) {
    return src;
  }

  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || 1280;
  canvas.height = image.naturalHeight || 720;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare the snapshot for scene analysis.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load the snapshot for analysis."));
    image.src = src;
  });
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}
