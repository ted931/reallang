export const REGIONS = ["서귀포", "제주시", "애월", "한림", "성산", "구좌", "모슬포", "우도"] as const;
export type Region = typeof REGIONS[number];

export const FISH_LIST = [
  "참돔", "감성돔", "벵에돔", "방어", "부시리", "볼락",
  "전갱이", "학공치", "삼치", "농어", "넙치", "반열기",
  "돌돔", "쏨뱅이", "우럭", "쥐치", "갈치"
] as const;

export const FISH_EMOJI: Record<string, string> = {
  "참돔": "🐠", "감성돔": "🐟", "벵에돔": "🐡", "방어": "🐟",
  "부시리": "🐠", "볼락": "🐟", "전갱이": "🐟", "학공치": "🐟",
  "삼치": "🐟", "농어": "🐟", "넙치": "🦈", "반열기": "🐠",
  "돌돔": "🐠", "쏨뱅이": "🐡", "우럭": "🐟", "쥐치": "🐡", "갈치": "🐟",
};

export const SPOT_TYPES = ["방파제", "갯바위", "좌대", "선상", "기수역", "해안"] as const;
export const FISHING_METHODS = ["찌낚시", "루어", "원투", "선상", "좌대낚시", "생미끼"] as const;

export const TIDE_PHASES = [
  "1물", "2물", "3물", "4물", "5물", "6물", "7물",
  "8물", "9물", "10물", "11물", "12물", "13물", "14물", "15물"
] as const;

export const LEVEL_COLOR: Record<string, string> = {
  "초보": "bg-green-100 text-green-700",
  "중급": "bg-blue-100 text-blue-700",
  "고수": "bg-purple-100 text-purple-700",
  "프로": "bg-amber-100 text-amber-700",
};

export const FISH_COLOR: Record<string, string> = {
  "참돔":   "bg-rose-900/60 text-rose-300 border-rose-800",
  "감성돔": "bg-slate-800/60 text-slate-300 border-slate-700",
  "벵에돔": "bg-gray-800/60 text-gray-300 border-gray-700",
  "방어":   "bg-amber-900/60 text-amber-300 border-amber-800",
  "부시리": "bg-yellow-900/60 text-yellow-300 border-yellow-800",
  "볼락":   "bg-orange-900/60 text-orange-300 border-orange-800",
  "전갱이": "bg-cyan-900/60 text-cyan-300 border-cyan-800",
  "학공치": "bg-sky-900/60 text-sky-300 border-sky-800",
  "삼치":   "bg-indigo-900/60 text-indigo-300 border-indigo-800",
  "농어":   "bg-teal-900/60 text-teal-300 border-teal-800",
  "넙치":   "bg-emerald-900/60 text-emerald-300 border-emerald-800",
  "갈치":   "bg-violet-900/60 text-violet-300 border-violet-800",
  "default":"bg-ocean-800/60 text-ocean-300 border-ocean-700",
};

export const SPOT_TYPE_ICON: Record<string, string> = {
  "방파제": "🚢", "갯바위": "🪨", "좌대": "🛖",
  "선상": "⛵", "기수역": "🌊", "해안": "🏖️",
};

export const METHOD_ICON: Record<string, string> = {
  "찌낚시": "🎣", "루어": "🪝", "원투": "🏹",
  "선상": "⛵", "좌대낚시": "🛖", "생미끼": "🐛",
};
