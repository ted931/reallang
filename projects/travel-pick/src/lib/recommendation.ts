import { PreferenceProfile, Place, PersonaResult, PersonaType } from "./types";
import { DUMMY_PLACES } from "./dummy-places";

export function getPersona(pref: PreferenceProfile): PersonaResult {
  const isScenery = pref.sceneryVsFood < 40;
  const isFood = pref.sceneryVsFood > 60;
  const isCrowd = pref.crowdTolerance > 55;
  const isWait = pref.waitTolerance > 55;
  const isFamily = pref.companion === "family" || pref.companion === "parents";

  let type: PersonaType;
  if (isFamily) {
    type = "가족여행자";
  } else if (isFood && isWait) {
    type = "미식가";
  } else if (isCrowd && !isScenery) {
    type = "관광객";
  } else {
    type = "힐링러";
  }

  const PERSONAS: Record<PersonaType, PersonaResult> = {
    미식가: {
      type: "미식가",
      label: "대기 감수형 미식가",
      emoji: "🍖",
      description: "기다려도 좋으니 제대로 된 맛집·빵집·카페로 안내해드려요.",
      color: "#e94e3b",
    },
    관광객: {
      type: "관광객",
      label: "인파 감수형 관광객",
      emoji: "📸",
      description: "사람 많아도 OK, 제주의 유명 명소를 전부 담아드려요.",
      color: "#2563eb",
    },
    힐링러: {
      type: "힐링러",
      label: "경치 우선 힐링러",
      emoji: "🌅",
      description: "조용한 뷰포인트, 한적한 카페만 골라드려요.",
      color: "#0d9488",
    },
    가족여행자: {
      type: "가족여행자",
      label: "효율 중시 가족 여행자",
      emoji: "👨‍👩‍👧",
      description: "이동 최소화, 어린이도 즐길 수 있는 코스로 구성해드려요.",
      color: "#d97706",
    },
  };
  return PERSONAS[type];
}

function matchScore(place: Place, pref: PreferenceProfile): number {
  let score = 0;
  const waitNorm = place.avgWaitMinutes / 60; // 0~1
  const waitPref = pref.waitTolerance / 100;
  score += (1 - Math.abs(waitNorm - waitPref)) * 25;

  const crowdPref = pref.crowdTolerance / 100;
  const crowdNorm = (place.crowdScore - 1) / 4;
  score += (1 - Math.abs(crowdNorm - crowdPref)) * 25;

  const svfPref = pref.sceneryVsFood / 100; // 0=경치, 1=맛
  const placeScenery = place.sceneryScore / 5;
  const placeFood = place.foodScore / 5;
  score += (svfPref * placeFood + (1 - svfPref) * placeScenery) * 30;

  if (pref.companion === "family" || pref.companion === "parents") {
    score += place.childFriendly ? 10 : -10;
    score += place.parkingEase === "easy" ? 5 : place.parkingEase === "hard" ? -5 : 0;
  }
  if (pref.transportMode === "walk" && place.parkingEase === "hard") score += 5;
  return Math.min(100, Math.max(0, score));
}

export function recommend(pref: PreferenceProfile) {
  const scored = DUMMY_PLACES.map((p) => ({ place: p, score: matchScore(p, pref) }));
  scored.sort((a, b) => b.score - a.score);

  const byCategory = (cat: Place["category"]) =>
    scored.filter((s) => s.place.category === cat).slice(0, 3);

  return {
    restaurants: byCategory("restaurant"),
    cafes: byCategory("cafe"),
    attractions: [...byCategory("attraction"), ...byCategory("beach"), ...byCategory("activity")].slice(0, 3),
    viewpoints: byCategory("viewpoint"),
    all: scored,
  };
}
