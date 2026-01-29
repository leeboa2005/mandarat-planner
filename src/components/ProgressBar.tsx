interface Props {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ progress, className = "", showLabel = true }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-sm font-bold whitespace-nowrap">
          {progress}%
        </p>
      )}
    </div>
  );
}