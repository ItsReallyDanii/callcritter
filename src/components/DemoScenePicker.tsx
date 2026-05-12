/* eslint-disable @next/next/no-img-element -- Demo previews use a local static scene asset. */
import type { DemoScene } from "@/types/app";

type DemoScenePickerProps = {
  scenes: DemoScene[];
  selectedSceneId: string;
  onSelectScene: (scene: DemoScene) => void;
  onCaptureScene: () => void;
};

export function DemoScenePicker({
  scenes,
  selectedSceneId,
  onSelectScene,
  onCaptureScene
}: DemoScenePickerProps) {
  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];

  return (
    <section className="stage-panel" aria-label="Demo scene">
      <div className="stage-toolbar">
        <div>
          <h2>Demo scene</h2>
          <p>Works without camera access.</p>
        </div>
        <button className="button primary" type="button" onClick={onCaptureScene}>
          Capture Demo Scene
        </button>
      </div>

      <div className="demo-layout">
        <img
          className="scene-preview"
          src={selectedScene.src}
          alt={selectedScene.description}
        />

        <div className="scene-list" aria-label="Available demo scenes">
          {scenes.map((scene) => (
            <button
              className={scene.id === selectedScene.id ? "scene-option active" : "scene-option"}
              key={scene.id}
              type="button"
              onClick={() => onSelectScene(scene)}
              aria-pressed={scene.id === selectedScene.id}
            >
              <span>{scene.title}</span>
              <small>{scene.description}</small>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
