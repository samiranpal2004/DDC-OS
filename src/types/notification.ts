export type NotificationType = 
  | 'event'
  | 'youtube'
  | 'medium'
  | 'potd'
  | 'poll'
  | 'meeting';

export interface NotificationAction {
  type: 'calendar' | 'open' | 'task' | 'link' | 'dismiss';
  label: string;
  payload?: any;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  actions: NotificationAction[];
  data?: {
    url?: string;
    date?: string;
    imageUrl?: string;
    videoId?: string;
    formUrl?: string;
    meetingUrl?: string;
    startTime?: string;
    dueDate?: string;
    [key: string]: any;
  };
}
