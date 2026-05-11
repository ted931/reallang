export interface TideEntry {
  time: string;
  height: number; // cm
  type: "high" | "low";
}

export interface DayTide {
  date: string;
  sunrise: string;
  sunset: string;
  moonPhase: string; // emoji
  lunarDay: number; // 음력 날짜 (물때)
  tideLabel: string; // "7물" 등
  tides: TideEntry[];
  weather: "sunny" | "cloudy" | "rainy" | "windy";
  windSpeed: number; // m/s
  waveHeight: number; // m
  fishingScore: 1 | 2 | 3 | 4 | 5;
  fishingTip: string;
  recommendFish: string[];
}

// 물때 라벨: 1물(조금)~15물(사리)
const TIDE_LABELS = ["", "1물(조금)", "2물", "3물", "4물", "5물", "6물", "7물", "8물", "9물", "10물", "11물", "12물", "13물", "14물", "사리(15물)"];

export const DUMMY_TIDE: DayTide[] = [
  {
    date: "2026-05-11", sunrise: "05:58", sunset: "19:52",
    moonPhase: "🌒", lunarDay: 14, tideLabel: TIDE_LABELS[14],
    tides: [
      { time: "01:42", height: 312, type: "high" },
      { time: "08:10", height: 24, type: "low" },
      { time: "13:55", height: 298, type: "high" },
      { time: "20:22", height: 18, type: "low" },
    ],
    weather: "sunny", windSpeed: 3.2, waveHeight: 0.5,
    fishingScore: 5, fishingTip: "사리 전날 — 조류 활발, 갈치·참돔 최상의 출조 타이밍!",
    recommendFish: ["갈치", "참돔", "방어"],
  },
  {
    date: "2026-05-12", sunrise: "05:57", sunset: "19:53",
    moonPhase: "🌕", lunarDay: 15, tideLabel: TIDE_LABELS[15],
    tides: [
      { time: "02:18", height: 326, type: "high" },
      { time: "08:44", height: 12, type: "low" },
      { time: "14:32", height: 315, type: "high" },
      { time: "20:58", height: 8, type: "low" },
    ],
    weather: "sunny", windSpeed: 4.1, waveHeight: 0.7,
    fishingScore: 5, fishingTip: "보름 사리 — 조류 최강. 대물 방어 노릴 절호의 찬스!",
    recommendFish: ["방어", "부시리", "참돔"],
  },
  {
    date: "2026-05-13", sunrise: "05:56", sunset: "19:53",
    moonPhase: "🌖", lunarDay: 1, tideLabel: TIDE_LABELS[1],
    tides: [
      { time: "03:05", height: 285, type: "high" },
      { time: "09:22", height: 45, type: "low" },
      { time: "15:14", height: 272, type: "high" },
      { time: "21:38", height: 38, type: "low" },
    ],
    weather: "cloudy", windSpeed: 5.8, waveHeight: 1.0,
    fishingScore: 3, fishingTip: "사리 직후 — 조류 잦아듦. 벵에돔 릴낚시 추천.",
    recommendFish: ["벵에돔", "볼락"],
  },
  {
    date: "2026-05-14", sunrise: "05:56", sunset: "19:54",
    moonPhase: "🌖", lunarDay: 2, tideLabel: TIDE_LABELS[2],
    tides: [
      { time: "03:52", height: 248, type: "high" },
      { time: "10:08", height: 72, type: "low" },
      { time: "16:01", height: 235, type: "high" },
      { time: "22:22", height: 64, type: "low" },
    ],
    weather: "rainy", windSpeed: 7.2, waveHeight: 1.4,
    fishingScore: 1, fishingTip: "풍랑주의보 가능성 — 출조 자제 권고. 안전 최우선!",
    recommendFish: [],
  },
  {
    date: "2026-05-15", sunrise: "05:55", sunset: "19:54",
    moonPhase: "🌗", lunarDay: 3, tideLabel: TIDE_LABELS[3],
    tides: [
      { time: "04:44", height: 210, type: "high" },
      { time: "11:00", height: 98, type: "low" },
      { time: "16:52", height: 198, type: "high" },
      { time: "23:10", height: 88, type: "low" },
    ],
    weather: "cloudy", windSpeed: 4.5, waveHeight: 0.9,
    fishingScore: 3, fishingTip: "잔잔한 파도. 감성돔 포인트 공략 적합.",
    recommendFish: ["감성돔", "볼락"],
  },
  {
    date: "2026-05-16", sunrise: "05:55", sunset: "19:55",
    moonPhase: "🌗", lunarDay: 4, tideLabel: TIDE_LABELS[4],
    tides: [
      { time: "05:38", height: 175, type: "high" },
      { time: "11:55", height: 118, type: "low" },
      { time: "17:48", height: 162, type: "high" },
      { time: "23:58", height: 105, type: "low" },
    ],
    weather: "sunny", windSpeed: 2.8, waveHeight: 0.4,
    fishingScore: 4, fishingTip: "맑고 잔잔. 학꽁치·벵에돔 입질 활발 예상.",
    recommendFish: ["학꽁치", "벵에돔", "볼락"],
  },
  {
    date: "2026-05-17", sunrise: "05:54", sunset: "19:55",
    moonPhase: "🌘", lunarDay: 5, tideLabel: TIDE_LABELS[5],
    tides: [
      { time: "06:33", height: 145, type: "high" },
      { time: "12:50", height: 132, type: "low" },
      { time: "18:44", height: 138, type: "high" },
      { time: "", height: 0, type: "low" },
    ],
    weather: "sunny", windSpeed: 2.2, waveHeight: 0.3,
    fishingScore: 3, fishingTip: "조금 구간 — 조류 약함. 선상 낚시보다 방파제 추천.",
    recommendFish: ["볼락", "감성돔"],
  },
  {
    date: "2026-05-18", sunrise: "05:54", sunset: "19:56",
    moonPhase: "🌘", lunarDay: 6, tideLabel: TIDE_LABELS[6],
    tides: [
      { time: "07:28", height: 142, type: "high" },
      { time: "13:44", height: 128, type: "low" },
      { time: "19:40", height: 145, type: "high" },
      { time: "", height: 0, type: "low" },
    ],
    weather: "windy", windSpeed: 8.5, waveHeight: 1.8,
    fishingScore: 2, fishingTip: "강풍 주의. 좌대 낚시는 업체에 사전 확인 필수.",
    recommendFish: [],
  },
  {
    date: "2026-05-19", sunrise: "05:53", sunset: "19:56",
    moonPhase: "🌑", lunarDay: 7, tideLabel: TIDE_LABELS[7],
    tides: [
      { time: "00:48", height: 115, type: "low" },
      { time: "08:22", height: 158, type: "high" },
      { time: "14:38", height: 122, type: "low" },
      { time: "20:35", height: 165, type: "high" },
    ],
    weather: "cloudy", windSpeed: 3.8, waveHeight: 0.6,
    fishingScore: 4, fishingTip: "7물 — 조류 살아남. 참돔 저녁 입질 기대!",
    recommendFish: ["참돔", "반열기"],
  },
  {
    date: "2026-05-20", sunrise: "05:53", sunset: "19:57",
    moonPhase: "🌑", lunarDay: 8, tideLabel: TIDE_LABELS[8],
    tides: [
      { time: "01:38", height: 105, type: "low" },
      { time: "09:15", height: 178, type: "high" },
      { time: "15:30", height: 112, type: "low" },
      { time: "21:28", height: 188, type: "high" },
    ],
    weather: "sunny", windSpeed: 2.5, waveHeight: 0.4,
    fishingScore: 5, fishingTip: "맑고 8물 — 갈치 야간 출조 최적! 저녁 6시 이후 입질 폭발 예상.",
    recommendFish: ["갈치", "참돔", "감성돔"],
  },
  {
    date: "2026-05-21", sunrise: "05:52", sunset: "19:57",
    moonPhase: "🌒", lunarDay: 9, tideLabel: TIDE_LABELS[9],
    tides: [
      { time: "02:25", height: 95, type: "low" },
      { time: "10:05", height: 202, type: "high" },
      { time: "16:18", height: 98, type: "low" },
      { time: "22:18", height: 215, type: "high" },
    ],
    weather: "sunny", windSpeed: 3.0, waveHeight: 0.5,
    fishingScore: 5, fishingTip: "9물 상승세 — 갈치·참돔 동시 공략 최고 시즌!",
    recommendFish: ["갈치", "참돔", "방어"],
  },
  {
    date: "2026-05-22", sunrise: "05:52", sunset: "19:58",
    moonPhase: "🌒", lunarDay: 10, tideLabel: TIDE_LABELS[10],
    tides: [
      { time: "03:10", height: 82, type: "low" },
      { time: "10:52", height: 228, type: "high" },
      { time: "17:05", height: 82, type: "low" },
      { time: "23:05", height: 244, type: "high" },
    ],
    weather: "cloudy", windSpeed: 4.2, waveHeight: 0.8,
    fishingScore: 4, fishingTip: "10물. 방어·부시리 회유 활발. 대형 지깅 노려볼 만.",
    recommendFish: ["방어", "부시리"],
  },
  {
    date: "2026-05-23", sunrise: "05:51", sunset: "19:58",
    moonPhase: "🌓", lunarDay: 11, tideLabel: TIDE_LABELS[11],
    tides: [
      { time: "03:52", height: 68, type: "low" },
      { time: "11:38", height: 256, type: "high" },
      { time: "17:50", height: 62, type: "low" },
      { time: "23:50", height: 272, type: "high" },
    ],
    weather: "sunny", windSpeed: 2.8, waveHeight: 0.4,
    fishingScore: 5, fishingTip: "11물 절정 — 이번 달 최고의 출조일! 좌대 예약 서두르세요.",
    recommendFish: ["갈치", "참돔", "방어", "감성돔"],
  },
  {
    date: "2026-05-24", sunrise: "05:51", sunset: "19:59",
    moonPhase: "🌓", lunarDay: 12, tideLabel: TIDE_LABELS[12],
    tides: [
      { time: "04:34", height: 52, type: "low" },
      { time: "12:22", height: 280, type: "high" },
      { time: "18:36", height: 44, type: "low" },
      { time: "", height: 298, type: "high" },
    ],
    weather: "sunny", windSpeed: 3.5, waveHeight: 0.5,
    fishingScore: 5, fishingTip: "12물. 사리 진입 — 조류 강해짐. 대물 시즌 개막!",
    recommendFish: ["참돔", "방어", "부시리"],
  },
];

export const WEATHER_ICON: Record<DayTide["weather"], string> = {
  sunny: "☀️", cloudy: "⛅", rainy: "🌧️", windy: "💨",
};

export const WEATHER_LABEL: Record<DayTide["weather"], string> = {
  sunny: "맑음", cloudy: "흐림", rainy: "비", windy: "강풍",
};

export const SCORE_COLOR: Record<number, string> = {
  1: "text-slate-500", 2: "text-orange-400", 3: "text-hook",
  4: "text-teal-400", 5: "text-teal-300",
};

export const SCORE_LABEL: Record<number, string> = {
  1: "출조 불가", 2: "주의", 3: "보통", 4: "좋음", 5: "최상",
};
