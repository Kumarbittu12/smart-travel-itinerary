export enum ActivityType {
  SIGHTSEEING = 'Sightseeing',
  ADVENTURE = 'Adventure',
  RELAXATION = 'Relaxation',
  DINING = 'Dining',
  SHOPPING = 'Shopping',
  TRANSPORTATION = 'Transportation'
}

export interface Activity {
  id: string;
  name: string;
  type: ActivityType;
  duration: number; // in minutes
  estimatedCost: number;
  location: string;
  startTime: string;
  notes?: string;
}

export interface DayPlan {
  day: number;
  date: Date;
  activities: Activity[];
  totalCost: number;
  travelTime: number; // in minutes
}

export interface Itinerary {
  id: string;
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  preferences: ActivityType[];
  dayPlans: DayPlan[];
  totalEstimatedCost: number;
  notes: string;
  media: string[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
}