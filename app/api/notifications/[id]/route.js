// pages/api/notifications/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    // Mark notification as read
    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true }
      });

      return res.status(200).json(notification);
    } catch (error) {
      console.error('Error updating notification:', error);
      return res.status(500).json({ error: 'Failed to update notification' });
    }
  } else if (req.method === 'DELETE') {
    // Delete notification
    try {
      await prisma.notification.delete({
        where: { id }
      });

      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting notification:', error);
      return res.status(500).json({ error: 'Failed to delete notification' });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}