interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizeMap[size]} border-4 border-muted border-t-primary rounded-full animate-spin`}
      ></div>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
