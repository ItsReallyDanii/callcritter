type ErrorBannerProps = {
  message: string;
  title?: string;
};

export function ErrorBanner({ message, title = "Camera unavailable." }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
