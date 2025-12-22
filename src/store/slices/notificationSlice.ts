import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface NotificationState {
  items: Notification[];
  unreadCount: number;
}

const loadNotificationsFromStorage = (): Notification[] => {
  const stored = localStorage.getItem('travel_notifications');
  return stored ? JSON.parse(stored) : [];
};

const saveNotificationsToStorage = (notifications: Notification[]) => {
  localStorage.setItem('travel_notifications', JSON.stringify(notifications));
};

const initialState: NotificationState = {
  items: loadNotificationsFromStorage(),
  unreadCount: loadNotificationsFromStorage().filter(n => !n.isRead).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<{
      userId: string;
      type: NotificationType;
      title: string;
      message: string;
      relatedItineraryId?: string;
    }>) => {
      const newNotification: Notification = {
        id: uuidv4(),
        userId: action.payload.userId,
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        relatedItineraryId: action.payload.relatedItineraryId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newNotification);
      state.unreadCount = state.items.filter(n => !n.isRead).length;
      saveNotificationsToStorage(state.items);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find(n => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = state.items.filter(n => !n.isRead).length;
        saveNotificationsToStorage(state.items);
      }
    },
    markAllAsRead: (state, action: PayloadAction<string>) => {
      state.items.forEach(n => {
        if (n.userId === action.payload) {
          n.isRead = true;
        }
      });
      state.unreadCount = state.items.filter(n => !n.isRead).length;
      saveNotificationsToStorage(state.items);
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.id !== action.payload);
      state.unreadCount = state.items.filter(n => !n.isRead).length;
      saveNotificationsToStorage(state.items);
    },
    clearUserNotifications: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(n => n.userId !== action.payload);
      state.unreadCount = state.items.filter(n => !n.isRead).length;
      saveNotificationsToStorage(state.items);
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearUserNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
