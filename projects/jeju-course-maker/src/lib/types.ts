export interface CourseRequest {
  prompt: string;
  days: number;
  companions: string;
  themes: string[];
  budget: number;
  hasRentalCar: boolean;
}

export interface CourseStop {
  time: string;
  name: string;
  category: "관광지" | "식당" | "카페" | "액티비티" | "숙소" | "공항";
  description: string;
  estimatedCost: number;
  address: string;
  tip?: string;
  driveMinutes?: number;
}

export interface CourseDay {
  day: number;
  theme: string;
  stops: CourseStop[];
  dayCost: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  recommended: boolean;
  days: CourseDay[];
  totalCost: number;
  totalDriveKm: number;
  totalDriveMinutes: number;
  highlights: string[];
}

export interface CourseResult {
  courses: Course[];
  input: {
    days: number;
    companions: string;
    budget: number;
  };
}
