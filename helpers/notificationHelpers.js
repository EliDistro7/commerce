// utils/notificationHelpers.js

/**
 * Creates a new notification for a user
 * 
 * @param {string} userId - ID of the user to notify
 * @param {string} text - Content of the notification
 * @param {string} type - Type of notification (order, inventory, report)
 * @returns {Promise<Object>} - The created notification object
 */
export const createNotification = async (userId, text, type) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, text, type }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create notification');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };
  
  /**
   * Marks a notification as read
   * 
   * @param {string} notificationId - ID of the notification to mark as read
   * @returns {Promise<Object>} - The updated notification object
   */
  export const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };
  
  /**
   * Deletes a notification
   * 
   * @param {string} notificationId - ID of the notification to delete
   * @returns {Promise<void>}
   */
  export const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };