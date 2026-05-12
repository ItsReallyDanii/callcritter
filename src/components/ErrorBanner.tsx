type ErrorBannerProps = {
  message: string;
};

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="error-banner" role="alert">
      <strong>Camera unavailable.</strong>
      <span>{message}</span>
    </div>
  );
}
