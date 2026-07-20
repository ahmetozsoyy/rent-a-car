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

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5105/notifications')
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNotification', (notification: any) => {
      console.log('SignalR Gelen Bildirim:', notification);
      let shouldShow = false;

      const type = notification.type || notification.Type;
      const targetRole = notification.targetRole || notification.TargetRole;
      const notifLocationId = notification.locationId || notification.LocationId;

      if (role === 'Admin') {
        if (type === 'NEW_MESSAGE' && targetRole === 'Admin') {
          shouldShow = true;
        }
      } else if (role === 'Moderator') {
        // Eger token guncel degilse locationId null olabilir. 
        // Token'i guncellemeyenleri engellememek adina gecici olarak hepsi true yapilabilir veya kontrol esnetilebilir.
        if (!locationId || notifLocationId === locationId) {
          if (type === 'NEW_RESERVATION') {
            shouldShow = true;
          } else if (type === 'NEW_MESSAGE' && targetRole === 'Moderator') {
            shouldShow = true;
          }
        }
      }

      if (shouldShow) {
        incrementUnread();
        toast(notification.message || notification.Message, {
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
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));

    return () => {
      connection.stop();
    };
  }, [role, locationId]);
};
