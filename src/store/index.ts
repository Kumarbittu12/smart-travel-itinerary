import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itineraryReducer from './slices/itinerarySlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    itineraries: itineraryReducer,
    ui: uiReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
