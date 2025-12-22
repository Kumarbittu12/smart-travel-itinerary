import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Itinerary, DayPlan, Activity, ItineraryFilters, AdminComment, TripReviewStatus } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ItineraryState {
  items: Itinerary[];
  currentItinerary: Itinerary | null;
  filters: ItineraryFilters;
  isLoading: boolean;
}

const loadItinerariesFromStorage = (): Itinerary[] => {
  const stored = localStorage.getItem('travel_itineraries');
  const items = stored ? JSON.parse(stored) : [];
  // Ensure backward compatibility with new fields
  return items.map((item: any) => ({
    ...item,
    reviewStatus: item.reviewStatus || 'draft',
    adminComments: item.adminComments || [],
    isPublic: item.isPublic || false,
  }));
};

const saveItinerariesToStorage = (itineraries: Itinerary[]) => {
  localStorage.setItem('travel_itineraries', JSON.stringify(itineraries));
};

const initialFilters: ItineraryFilters = {
  search: '',
  destination: '',
  dateRange: { start: null, end: null },
  budgetRange: { min: 0, max: 100000 },
  status: '',
  reviewStatus: '',
  sortBy: 'created',
  sortOrder: 'desc',
};

const initialState: ItineraryState = {
  items: loadItinerariesFromStorage(),
  currentItinerary: null,
  filters: initialFilters,
  isLoading: false,
};

const calculateTotalCost = (days: DayPlan[]): number => {
  return days.reduce((total, day) => {
    return total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.cost, 0);
  }, 0);
};

const itinerarySlice = createSlice({
  name: 'itineraries',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    createItinerary: (state, action: PayloadAction<Omit<Itinerary, 'id' | 'createdAt' | 'updatedAt' | 'totalCost' | 'reviewStatus' | 'adminComments' | 'isPublic'>>) => {
      const totalCost = calculateTotalCost(action.payload.days);
      const newItinerary: Itinerary = {
        ...action.payload,
        id: uuidv4(),
        totalCost,
        reviewStatus: 'draft',
        adminComments: [],
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.items.push(newItinerary);
      state.currentItinerary = newItinerary;
      saveItinerariesToStorage(state.items);
    },
    updateItinerary: (state, action: PayloadAction<{ id: string; updates: Partial<Itinerary> }>) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        const updated = {
          ...state.items[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
        if (action.payload.updates.days) {
          updated.totalCost = calculateTotalCost(action.payload.updates.days);
        }
        state.items[index] = updated;
        if (state.currentItinerary?.id === action.payload.id) {
          state.currentItinerary = updated;
        }
        saveItinerariesToStorage(state.items);
      }
    },
    deleteItinerary: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      if (state.currentItinerary?.id === action.payload) {
        state.currentItinerary = null;
      }
      saveItinerariesToStorage(state.items);
    },
    setCurrentItinerary: (state, action: PayloadAction<string | null>) => {
      state.currentItinerary = action.payload 
        ? state.items.find(i => i.id === action.payload) || null 
        : null;
    },
    
    // Review system actions
    submitForReview: (state, action: PayloadAction<string>) => {
      const itinerary = state.items.find(i => i.id === action.payload);
      if (itinerary) {
        itinerary.reviewStatus = 'submitted';
        itinerary.submittedAt = new Date().toISOString();
        itinerary.updatedAt = new Date().toISOString();
        if (state.currentItinerary?.id === action.payload) {
          state.currentItinerary = itinerary;
        }
        saveItinerariesToStorage(state.items);
      }
    },
    updateReviewStatus: (state, action: PayloadAction<{ 
      itineraryId: string; 
      status: TripReviewStatus; 
      adminId?: string;
      adminName?: string;
    }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        itinerary.reviewStatus = action.payload.status;
        itinerary.reviewedAt = new Date().toISOString();
        itinerary.reviewedBy = action.payload.adminName;
        itinerary.updatedAt = new Date().toISOString();
        if (state.currentItinerary?.id === action.payload.itineraryId) {
          state.currentItinerary = itinerary;
        }
        saveItinerariesToStorage(state.items);
      }
    },
    addAdminComment: (state, action: PayloadAction<{
      itineraryId: string;
      adminId: string;
      adminName: string;
      message: string;
      suggestion?: string;
    }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        const newComment: AdminComment = {
          id: uuidv4(),
          adminId: action.payload.adminId,
          adminName: action.payload.adminName,
          itineraryId: action.payload.itineraryId,
          message: action.payload.message,
          suggestion: action.payload.suggestion,
          isApplied: false,
          createdAt: new Date().toISOString(),
        };
        itinerary.adminComments.push(newComment);
        itinerary.updatedAt = new Date().toISOString();
        if (state.currentItinerary?.id === action.payload.itineraryId) {
          state.currentItinerary = itinerary;
        }
        saveItinerariesToStorage(state.items);
      }
    },
    applySuggestion: (state, action: PayloadAction<{ itineraryId: string; commentId: string }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        const comment = itinerary.adminComments.find(c => c.id === action.payload.commentId);
        if (comment) {
          comment.isApplied = true;
          itinerary.updatedAt = new Date().toISOString();
          if (state.currentItinerary?.id === action.payload.itineraryId) {
            state.currentItinerary = itinerary;
          }
          saveItinerariesToStorage(state.items);
        }
      }
    },
    togglePublic: (state, action: PayloadAction<string>) => {
      const itinerary = state.items.find(i => i.id === action.payload);
      if (itinerary) {
        itinerary.isPublic = !itinerary.isPublic;
        itinerary.shareLink = itinerary.isPublic ? `${window.location.origin}/itineraries/${itinerary.id}` : undefined;
        itinerary.updatedAt = new Date().toISOString();
        if (state.currentItinerary?.id === action.payload) {
          state.currentItinerary = itinerary;
        }
        saveItinerariesToStorage(state.items);
      }
    },
    
    // Activity actions
    addActivity: (state, action: PayloadAction<{ itineraryId: string; dayId: string; activity: Omit<Activity, 'id'> }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        const day = itinerary.days.find(d => d.id === action.payload.dayId);
        if (day) {
          const newActivity: Activity = {
            ...action.payload.activity,
            id: uuidv4(),
          };
          day.activities.push(newActivity);
          day.totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
          itinerary.totalCost = calculateTotalCost(itinerary.days);
          itinerary.updatedAt = new Date().toISOString();
          
          if (state.currentItinerary?.id === itinerary.id) {
            state.currentItinerary = itinerary;
          }
          saveItinerariesToStorage(state.items);
        }
      }
    },
    updateActivity: (state, action: PayloadAction<{ itineraryId: string; dayId: string; activityId: string; updates: Partial<Activity> }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        const day = itinerary.days.find(d => d.id === action.payload.dayId);
        if (day) {
          const activityIndex = day.activities.findIndex(a => a.id === action.payload.activityId);
          if (activityIndex !== -1) {
            day.activities[activityIndex] = { ...day.activities[activityIndex], ...action.payload.updates };
            day.totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
            itinerary.totalCost = calculateTotalCost(itinerary.days);
            itinerary.updatedAt = new Date().toISOString();
            
            if (state.currentItinerary?.id === itinerary.id) {
              state.currentItinerary = itinerary;
            }
            saveItinerariesToStorage(state.items);
          }
        }
      }
    },
    deleteActivity: (state, action: PayloadAction<{ itineraryId: string; dayId: string; activityId: string }>) => {
      const itinerary = state.items.find(i => i.id === action.payload.itineraryId);
      if (itinerary) {
        const day = itinerary.days.find(d => d.id === action.payload.dayId);
        if (day) {
          day.activities = day.activities.filter(a => a.id !== action.payload.activityId);
          day.totalCost = day.activities.reduce((sum, a) => sum + a.cost, 0);
          itinerary.totalCost = calculateTotalCost(itinerary.days);
          itinerary.updatedAt = new Date().toISOString();
          
          if (state.currentItinerary?.id === itinerary.id) {
            state.currentItinerary = itinerary;
          }
          saveItinerariesToStorage(state.items);
        }
      }
    },
    setFilters: (state, action: PayloadAction<Partial<ItineraryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
});

export const {
  setLoading,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  setCurrentItinerary,
  submitForReview,
  updateReviewStatus,
  addAdminComment,
  applySuggestion,
  togglePublic,
  addActivity,
  updateActivity,
  deleteActivity,
  setFilters,
  resetFilters,
} = itinerarySlice.actions;

export default itinerarySlice.reducer;
