import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState, UserRole } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const loadUserFromStorage = (): User | null => {
  const stored = localStorage.getItem('travel_user');
  return stored ? JSON.parse(stored) : null;
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem('travel_user', JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.isLoading = false;
    },
    register: (state, action: PayloadAction<{ email: string; name: string; role: UserRole }>) => {
      const newUser: User = {
        id: uuidv4(),
        email: action.payload.email,
        name: action.payload.name,
        role: action.payload.role,
        createdAt: new Date().toISOString(),
        favoriteDestinations: [],
      };
      state.user = newUser;
      state.isAuthenticated = true;
      localStorage.setItem('travel_user', JSON.stringify(newUser));
      
      // Store in users list for admin dashboard
      const users = JSON.parse(localStorage.getItem('travel_users') || '[]');
      users.push(newUser);
      localStorage.setItem('travel_users', JSON.stringify(users));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('travel_user');
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('travel_user', JSON.stringify(state.user));
        
        // Update in users list
        const users = JSON.parse(localStorage.getItem('travel_users') || '[]');
        const idx = users.findIndex((u: User) => u.id === state.user!.id);
        if (idx !== -1) {
          users[idx] = state.user;
          localStorage.setItem('travel_users', JSON.stringify(users));
        }
      }
    },
    toggleFavoriteDestination: (state, action: PayloadAction<string>) => {
      if (state.user) {
        const favorites = state.user.favoriteDestinations || [];
        const index = favorites.indexOf(action.payload);
        if (index === -1) {
          favorites.push(action.payload);
        } else {
          favorites.splice(index, 1);
        }
        state.user.favoriteDestinations = favorites;
        localStorage.setItem('travel_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, register, logout, updateProfile, toggleFavoriteDestination } = authSlice.actions;
export default authSlice.reducer;
