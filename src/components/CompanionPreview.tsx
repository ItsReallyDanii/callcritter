/* eslint-disable @next/next/no-img-element -- Generated companion previews can be runtime data URLs. */
type CompanionPreviewProps = {
  imageUrl: string;
  isFallback?: boolean;
};

export function CompanionPreview({ imageUrl, isFallback = false }: CompanionPreviewProps) {
  return (
    <section className="stage-panel companion-panel" aria-label="Generated companion preview">
      <div className="stage-toolbar">
        <div>
          <h2>{isFallback ? "Fallback companion preview" : "Generated companion"}</h2>
          <p>
            {isFallback
              ? "Image generation failed, so a local fallback preview is shown."
              : "Canvas placement comes in Prompt 03; this is only the generated asset preview."}
          </p>
        </div>
      </div>

      <div className="companion-preview-frame">
        <img src={imageUrl} alt="CallCritter companion preview" />
      </div>
    </section>
  );
}
