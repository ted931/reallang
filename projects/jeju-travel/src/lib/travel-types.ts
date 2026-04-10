export interface TravelRequest {
  prompt: string;
  nights: number;
  travelers: number;
  budget: number;
  style: string[];
}

export interface DaySchedule {
  day: number;
  date: string;
  theme: string;
  spots: Spot[];
}

export interface Spot {
  time: string;
  name: string;
  category: "숙소" | "식당" | "카페" | "관광지" | "액티비티" | "이동";
  description: string;
  estimatedCost: number;
  address?: string;
  tip?: string;
}

export interface TravelPlan {
  title: string;
  summary: string;
  nights: number;
  travelers: number;
  totalBudget: number;
  schedule: DaySchedule[];
  budgetBreakdown: {
    category: string;
    amount: number;
  }[];
  packingTips: string[];
}
