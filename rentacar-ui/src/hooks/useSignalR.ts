import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export const useSignalR = () => {
  const { role, locationId } = useAuthStore();

  useEffect(() => {
    // Sadece Admin ve Moderator olanlar dinlesin
    if (role !== 'Admin' && role !== 'Moderator') return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5105/notifications')
      .withAutomaticReconnect()
      .build();

    connection.on('ReceiveNotification', (notification: { type: string; locationId: number; targetRole?: string; message: string }) => {
      let shouldShow = false;

      if (role === 'Admin') {
        if (notification.type === 'NEW_MESSAGE' && notification.targetRole === 'Admin') {
          shouldShow = true;
        }
      } else if (role === 'Moderator') {
        if (notification.locationId === locationId) {
          if (notification.type === 'NEW_RESERVATION') {
            shouldShow = true;
          } else if (notification.type === 'NEW_MESSAGE' && notification.targetRole === 'Moderator') {
            shouldShow = true;
          }
        }
      }

      if (shouldShow) {
        toast(notification.message, {
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
