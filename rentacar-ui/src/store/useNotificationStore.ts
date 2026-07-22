import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  message: string;
  date: string;
  read: boolean;
  locationId?: string;
}

interface NotificationState {
  unreadCount: number;
  notifications: NotificationItem[];
  addNotification: (message: string, locationId?: string) => void;
  markAllAsRead: () => void;
  markAsReadByLocation: (locationId: string) => void;
  clearUnread: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  notifications: [],
  addNotification: (message: string, locationId?: string) => set((state) => ({ 
    unreadCount: state.unreadCount + 1,
    notifications: [
      { id: Math.random().toString(36).substring(2, 9), message, date: new Date().toISOString(), read: false, locationId },
      ...state.notifications
    ]
  })),
  markAllAsRead: () => set((state) => ({
    unreadCount: 0,
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  markAsReadByLocation: (locationId: string) => set((state) => {
    let newlyReadCount = 0;
    const newNotifs = state.notifications.map(n => {
      if (!n.read && n.locationId === locationId) {
        newlyReadCount++;
        return { ...n, read: true };
      }
      return n;
    });
    return {
      unreadCount: Math.max(0, state.unreadCount - newlyReadCount),
      notifications: newNotifs
    };
  }),
  clearUnread: () => set({ unreadCount: 0 }),
}));
