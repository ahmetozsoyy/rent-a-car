import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationState {
  unreadCount: number;
  notifications: NotificationItem[];
  addNotification: (message: string) => void;
  markAllAsRead: () => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  addNotification: (message: string) => set((state) => ({ 
    unreadCount: state.unreadCount + 1,
    notifications: [
      { id: Math.random().toString(36).substring(2, 9), message, date: new Date().toISOString(), read: false },
      ...state.notifications
    ]
  })),
  markAllAsRead: () => set((state) => ({
    unreadCount: 0,
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
