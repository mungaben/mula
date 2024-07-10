// lib/notification.ts
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface Notification {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
}

export const sendNotification = async (userId: string, title: string, message: string, type: NotificationType = 'INFO'): Promise<void> => {
  const notification: Notification = {
    userId,
    title,
    message,
    type,
  };

  // Here you can integrate with your notification service (email, SMS, push notifications, etc.)
  // For this example, we will just log the notification to the console.

  console.log(`Notification sent to user ${userId}:`, notification);

  // Example integration with an email service (pseudo-code):
  // await emailService.sendEmail(userId, title, message);

  // Example integration with an SMS service (pseudo-code):
  // await smsService.sendSMS(userId, message);

  // Example integration with a push notification service (pseudo-code):
  // await pushNotificationService.send(userId, title, message);
};
