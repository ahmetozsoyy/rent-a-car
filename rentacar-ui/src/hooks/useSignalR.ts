import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const useSignalR = () => {
  const { role, locationId } = useAuthStore();
  const incrementUnread = useNotificationStore((state) => state.incrementUnread);

  useEffect(() => {
    // Sadece Admin ve Moderator olanlar dinlesin
    if (role !== 'Admin' && role !== 'Moderator') return;

    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5105';

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE}/notifications`)
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNotification', (notification: any) => {
      console.log('SignalR Gelen Bildirim:', notification);
      let shouldShow = false;

      const type = notification.type || notification.Type;
      const targetRole = notification.targetRole || notification.TargetRole;
      const notifLocationId = notification.locationId || notification.LocationId;

      const normalizedNotifLoc = notifLocationId ? notifLocationId.toString().toLowerCase() : null;
      const normalizedUserLoc = locationId ? locationId.toString().toLowerCase() : null;

      if (role === 'Admin') {
        if (type === 'NEW_MESSAGE' && targetRole === 'Admin') {
          shouldShow = true;
        } else if (type === 'NEW_RESERVATION') {
          shouldShow = true;
        }
      } else if (role === 'Moderator') {
        // Eger token guncel degilse locationId null olabilir. 
        if (!normalizedUserLoc || normalizedNotifLoc === normalizedUserLoc) {
          if (type === 'NEW_RESERVATION') {
            shouldShow = true;
          } else if (type === 'NEW_MESSAGE' && targetRole === 'Moderator') {
            shouldShow = true;
          }
        }
      }

      console.log('SignalR shouldShow?', shouldShow, 'type:', type, 'targetRole:', targetRole, 'userRole:', role);

      if (shouldShow) {
        incrementUnread();
        toast(notification.message || notification.Message || 'Yeni Bildirim', {
          icon: '🔔',
          duration: Infinity, // Sürekli kalır
          style: {
            borderRadius: '12px',
            background: 'var(--glass-bg)',
            color: 'var(--text-color)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(10px)',
          },
        });
      }
    });

    connection.start()
      .then(() => console.log('SignalR Connected to', `${API_BASE}/notifications`))
      .catch(err => console.error('SignalR Connection Error: ', err));

    return () => {
      connection.stop();
    };
  }, [role, locationId, incrementUnread]);
};
