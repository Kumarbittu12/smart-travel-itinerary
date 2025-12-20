export type UserRole = 'traveler' | 'admin';
export type TripReviewStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
export type NotificationType = 'approval' | 'rejection' | 'suggestion' | 'budget_warning' | 'submission' | 'comment';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  favoriteDestinations?: string[];
}

export interface AdminComment {
  id: string;
  adminId: string;
  adminName: string;
  itineraryId: string;
  message: string;
  suggestion?: string;
  isApplied?: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  cost: number;
  category: 'sightseeing' | 'adventure' | 'relaxation' | 'food' | 'transport' | 'accommodation' | 'other';
  notes?: string;
  imageUrl?: string;
}

export interface DayPlan {
  id: string;
  date: string;
  dayNumber: number;
  activities: Activity[];
  notes?: string;
  totalCost: number;
}

export interface Itinerary {
  id: string;
  userId: string;
  userName?: string;
  title: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
  budget: number;
  preferences: ('sightseeing' | 'adventure' | 'relaxation')[];
  days: DayPlan[];
  totalCost: number;
  coverImage?: string;
  status: 'draft' | 'planned' | 'ongoing' | 'completed';
  reviewStatus: TripReviewStatus;
  adminComments: AdminComment[];
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  isPublic: boolean;
  shareLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedItineraryId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ItineraryFilters {
  search: string;
  destination: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  budgetRange: {
    min: number;
    max: number;
  };
  status: string;
  reviewStatus: string;
  sortBy: 'date' | 'budget' | 'destination' | 'created';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalItineraries: number;
  pendingReviews: number;
  approvedItineraries: number;
  rejectedItineraries: number;
  popularDestinations: { destination: string; count: number }[];
  recentActivity: { action: string; user: string; timestamp: string; details: string; type?: string }[];
  itinerariesByMonth: { month: string; count: number }[];
  budgetDistribution: { range: string; count: number }[];
}

export interface AdminDashboardFilters {
  destination: string;
  budgetMin: number;
  budgetMax: number;
  dateFrom: string | null;
  dateTo: string | null;
  reviewStatus: string;
}
