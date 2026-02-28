interface AdSlotProps {
  className?: string;
}

export default function AdSlot({ className = "" }: AdSlotProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-8 dark:border-gray-700 dark:bg-gray-900/50 ${className}`}
    >
      <p className="text-xs text-gray-400 dark:text-gray-600">
        광고 영역
      </p>
    </div>
  );
}
