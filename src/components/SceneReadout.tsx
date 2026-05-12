import type { SceneAnalysis } from "@/types/scene";

type SceneReadoutProps = {
  analysis: SceneAnalysis;
  usedFallback?: boolean;
};

export function SceneReadout({ analysis, usedFallback = false }: SceneReadoutProps) {
  return (
    <section className="stage-panel readout-panel" aria-label="Scene readout">
      <div className="stage-toolbar">
        <div>
          <h2>Scene readout</h2>
          <p>
            {usedFallback
              ? "Fallback readout shown because the model response could not be fully validated."
              : "User-facing GPT-5.5 scene analysis. No private chain-of-thought is shown."}
          </p>
        </div>
      </div>

      <div className="readout-grid">
        <ReadoutItem label="Scene summary" value={analysis.scene_summary} />
        <ReadoutItem label="Mood" value={analysis.mood} />
        <ReadoutItem
          label="Lighting"
          value={`${analysis.lighting.description} Direction: ${analysis.lighting.direction}. Intensity: ${analysis.lighting.intensity}.`}
        />
        <ReadoutItem label="Character name" value={analysis.character_name} />
        <ReadoutItem label="Character concept" value={analysis.character_concept} />
        <ReadoutItem
          label="Placement recommendation"
          value={analysis.placement_recommendation}
        />
        <ReadoutItem label="Share caption" value={analysis.share_caption} />
      </div>

      <div className="attachment-list">
        <h3>Likely attachment points</h3>
        <div>
          {analysis.likely_attachment_points.map((point) => (
            <article className="attachment-item" key={`${point.label}-${point.placement_hint}`}>
              <strong>{point.label}</strong>
              <p>{point.why_it_works}</p>
              <small>{point.placement_hint}</small>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReadoutItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="readout-item">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}
