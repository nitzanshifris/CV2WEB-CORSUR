import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';
import { showToast } from './toast-utils';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

export async function getUserNotifications(
  userId: string,
  limit: number = 10
): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

export async function createNotification(
  userId: string,
  notification: Omit<Notification, 'id' | 'user_id' | 'read' | 'created_at'>
): Promise<void> {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      ...notification,
      read: false,
    });

    if (error) throw error;

    // Show toast notification if the user is online
    if (typeof window !== 'undefined') {
      showToast({
        title: notification.title,
        description: notification.message,
        variant: notification.type,
      });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
}
