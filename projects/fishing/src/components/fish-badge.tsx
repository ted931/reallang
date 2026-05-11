import { FISH_COLOR } from "@/lib/constants";

interface FishBadgeProps {
  name: string;
  size?: string;
  count?: number;
}

export default function FishBadge({ name, size, count }: FishBadgeProps) {
  const colorClass = FISH_COLOR[name] ?? FISH_COLOR["default"];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
      {name}
      {size && <span className="opacity-75">{size}</span>}
      {count && count > 1 && <span className="opacity-75">×{count}</span>}
    </span>
  );
}
