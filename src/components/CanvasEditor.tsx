"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { compositeScene, loadCanvasImage } from "@/lib/canvas/compositeScene";
import { downloadCanvasPng, downloadShareCardPng } from "@/lib/canvas/exportCanvas";
import {
  clamp,
  clampTransformToCanvas,
  createDefaultCompanionTransform,
  getCompanionDisplaySize,
  hitTestCompanion,
  screenPointToCanvasPoint,
  type CanvasPoint,
  type CompanionTransform
} from "@/lib/canvas/transform";
import type { SceneAnalysis } from "@/types/scene";

type CanvasEditorProps = {
  sceneImageUrl: string;
  companionImageUrl: string;
  analysis?: SceneAnalysis | null;
  isStickerFallback?: boolean;
};

type LoadedImages = {
  scene: HTMLImageElement;
  companion: HTMLImageElement;
};

type DragState = {
  pointerId: number;
  offset: CanvasPoint;
};

export function CanvasEditor({
  sceneImageUrl,
  companionImageUrl,
  analysis,
  isStickerFallback = false
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [images, setImages] = useState<LoadedImages | null>(null);
  const [transform, setTransform] = useState<CompanionTransform | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setImages(null);
    setTransform(null);
    setLoadError(null);

    Promise.all([loadCanvasImage(sceneImageUrl), loadCanvasImage(companionImageUrl)])
      .then(([scene, companion]) => {
        if (cancelled) {
          return;
        }

        setImages({ scene, companion });
        setTransform(
          createDefaultCompanionTransform({
            canvas: {
              width: scene.naturalWidth,
              height: scene.naturalHeight
            },
            companion: {
              width: companion.naturalWidth,
              height: companion.naturalHeight
            },
            analysis,
            forceStickerFrame: isStickerFallback
          })
        );
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Could not load editor images.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [analysis, companionImageUrl, isStickerFallback, sceneImageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !images || !transform) {
      return;
    }

    canvas.width = images.scene.naturalWidth;
    canvas.height = images.scene.naturalHeight;
    compositeScene({
      canvas,
      sceneImage: images.scene,
      companionImage: images.companion,
      transform
    });
  }, [images, transform]);

  const scaleBounds = useMemo(() => {
    if (!images || !transform) {
      return { min: 0.05, max: 1.5 };
    }

    const canvasWidth = images.scene.naturalWidth;
    const defaultTargetScale = (canvasWidth * 0.3) / images.companion.naturalWidth;

    return {
      min: clamp(defaultTargetScale * 0.35, 0.04, 0.5),
      max: clamp(defaultTargetScale * 2.8, 0.24, 2)
    };
  }, [images, transform]);

  function resetPlacement() {
    if (!images) {
      return;
    }

    setTransform(
      createDefaultCompanionTransform({
        canvas: {
          width: images.scene.naturalWidth,
          height: images.scene.naturalHeight
        },
        companion: {
          width: images.companion.naturalWidth,
          height: images.companion.naturalHeight
        },
        analysis,
        forceStickerFrame: isStickerFallback
      })
    );
  }

  function updateTransform(nextTransform: CompanionTransform) {
    if (!images) {
      setTransform(nextTransform);
      return;
    }

    setTransform(
      clampTransformToCanvas(
        nextTransform,
        {
          width: images.scene.naturalWidth,
          height: images.scene.naturalHeight
        },
        {
          width: images.companion.naturalWidth,
          height: images.companion.naturalHeight
        }
      )
    );
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!canvasRef.current || !images || !transform) {
      return;
    }

    const point = screenPointToCanvasPoint(event.nativeEvent, canvasRef.current);
    const hit = hitTestCompanion({
      point,
      transform,
      companion: {
        width: images.companion.naturalWidth,
        height: images.companion.naturalHeight
      }
    });

    if (!hit) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      offset: {
        x: point.x - transform.x,
        y: point.y - transform.y
      }
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!canvasRef.current || !transform || !dragStateRef.current) {
      return;
    }

    const point = screenPointToCanvasPoint(event.nativeEvent, canvasRef.current);
    updateTransform({
      ...transform,
      x: point.x - dragStateRef.current.offset.x,
      y: point.y - dragStateRef.current.offset.y
    });
  }

  function handlePointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    if (dragStateRef.current?.pointerId === event.pointerId) {
      dragStateRef.current = null;
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleDownload() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    downloadCanvasPng(canvas);
  }

  function handleShareCardDownload() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    downloadShareCardPng({ canvas, analysis });
  }

  const displaySize =
    images && transform
      ? getCompanionDisplaySize(transform, {
          width: images.companion.naturalWidth,
          height: images.companion.naturalHeight
        })
      : null;
  const editorReady = Boolean(images && transform);

  return (
    <section className="stage-panel canvas-editor-panel" aria-label="Canvas editor">
      <div className="stage-toolbar">
        <div>
          <h2>Canvas editor</h2>
          <p>Drag the companion on the scene, then adjust scale, rotation, and opacity.</p>
        </div>
        <div className="toolbar-actions">
          <button
            className="button secondary"
            type="button"
            onClick={resetPlacement}
            disabled={!editorReady}
          >
            Reset Placement
          </button>
          <button
            className="button primary"
            type="button"
            onClick={handleDownload}
            disabled={!editorReady}
          >
            Download Scene PNG
          </button>
          <button
            className="button primary"
            type="button"
            onClick={handleShareCardDownload}
            disabled={!editorReady}
          >
            Export Share Card
          </button>
        </div>
      </div>

      {loadError ? (
        <div className="canvas-status" role="alert">
          {loadError}
        </div>
      ) : null}

      <div className="canvas-editor-body">
        <div className="canvas-frame">
          <canvas
            ref={canvasRef}
            className="composite-canvas"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            aria-label="Editable composited CallCritter scene"
          />
        </div>

        <aside className="editor-controls" aria-label="Canvas controls">
          <ControlRange
            label="Scale"
            min={scaleBounds.min}
            max={scaleBounds.max}
            step={0.01}
            value={transform?.scale ?? 0.3}
            displayValue={displaySize ? `${Math.round(displaySize.width)}px wide` : "Loading"}
            onChange={(value) => {
              if (transform) {
                updateTransform({ ...transform, scale: value });
              }
            }}
          />
          <ControlRange
            label="Rotation"
            min={-180}
            max={180}
            step={1}
            value={transform?.rotation ?? 0}
            displayValue={`${Math.round(transform?.rotation ?? 0)} deg`}
            onChange={(value) => {
              if (transform) {
                updateTransform({ ...transform, rotation: value });
              }
            }}
          />
          <ControlRange
            label="Opacity"
            min={0.35}
            max={1}
            step={0.01}
            value={transform?.opacity ?? 1}
            displayValue={`${Math.round((transform?.opacity ?? 1) * 100)}%`}
            onChange={(value) => {
              if (transform) {
                updateTransform({ ...transform, opacity: value });
              }
            }}
          />

          <label className="toggle-control">
            <input
              type="checkbox"
              checked={transform?.shadow ?? true}
              onChange={(event) => {
                if (transform) {
                  updateTransform({ ...transform, shadow: event.target.checked });
                }
              }}
            />
            Soft shadow
          </label>

          <label className="toggle-control">
            <input
              type="checkbox"
              checked={transform?.stickerFrame ?? false}
              onChange={(event) => {
                if (transform) {
                  updateTransform({ ...transform, stickerFrame: event.target.checked });
                }
              }}
            />
            Sticker-frame fallback
          </label>

          <label className="toggle-control">
            <input
              type="checkbox"
              checked={transform?.blendTint ?? true}
              onChange={(event) => {
                if (transform) {
                  updateTransform({ ...transform, blendTint: event.target.checked });
                }
              }}
            />
            Scene blend tint
          </label>
        </aside>
      </div>
    </section>
  );
}

function ControlRange({
  label,
  min,
  max,
  step,
  value,
  displayValue,
  onChange
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  displayValue: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>{displayValue}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
