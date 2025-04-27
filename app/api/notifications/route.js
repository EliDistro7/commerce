// pages/api/notifications/index.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Get all notifications for a specific user
    try {
      const userId = req.query.userId;
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  } else if (req.method === 'POST') {
    // Create a new notification
    try {
      const { userId, text, type } = req.body;
      
      if (!userId || !text || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const notification = await prisma.notification.create({
        data: {
          userId,
          text,
          type,
          read: false
        }
      });

      // Emit to Socket.io server
      if (req.socket.server.io) {
        req.socket.server.io.to(userId).emit('newNotification', notification);
      }

      return res.status(201).json(notification);
    } catch (error) {
      console.error('Error creating notification:', error);
      return res.status(500).json({ error: 'Failed to create notification' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}