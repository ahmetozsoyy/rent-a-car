import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const useSignalR = () => {
  const { role, locationId } = useAuthStore();
  const { addNotification } = useNotificationStore.getState();

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
      const rawTargetRole = notification.targetRole || notification.TargetRole || '';
      const targetRole = rawTargetRole.toString().toLowerCase();
      
      const notifLocationId = notification.locationId || notification.LocationId;

      const notifReservationId = notification.reservationId || notification.ReservationId;

      const normalizedNotifLoc = notifLocationId ? notifLocationId.toString().toLowerCase() : null;
      const normalizedUserLoc = locationId ? locationId.toString().toLowerCase() : null;
      const normalizedUserRole = role ? role.toLowerCase() : '';

      if (normalizedUserRole === 'admin') {
        if (type === 'NEW_MESSAGE' && targetRole === 'admin') {
          shouldShow = true;
        } else if (type === 'NEW_RESERVATION') {
          shouldShow = true;
        }
      } else if (normalizedUserRole === 'moderator') {
        // Eger token guncel degilse locationId null olabilir. 
        if (!normalizedUserLoc || normalizedNotifLoc === normalizedUserLoc) {
          if (type === 'NEW_RESERVATION') {
            shouldShow = true;
          } else if (type === 'NEW_MESSAGE' && targetRole === 'moderator') {
            shouldShow = true;
          }
        }
      }

      console.log('SignalR shouldShow?', shouldShow, 'type:', type, 'targetRole:', targetRole, 'userRole:', role);

      if (shouldShow) {
        const msg = notification.message || notification.Message || 'Yeni Bildirim';
        addNotification(msg, notifLocationId, notifReservationId);
        toast(msg, {
          icon: '🔔',
          duration: 5000, // 5 saniye sonra kapanır
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
  }, [role, locationId, addNotification]);
};
