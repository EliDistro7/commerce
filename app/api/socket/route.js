// pages/api/socket.js
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function SocketHandler(req, res) {
  // Check if socket.io server is already running

  console.log('it reached to socket api')
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Setting up socket');
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle user authentication for notifications
    socket.on('authenticate', async (userId) => {
      console.log(`User ${userId} authenticated`);
      // Associate this socket with the user ID
      socket.join(userId);
      
      // Send existing unread notifications to the user
      try {
        const notifications = await prisma.notification.findMany({
          where: {
            userId: userId,
            read: false
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        socket.emit('notifications', notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    });

    // Mark notification as read
    socket.on('markAsRead', async (notificationId) => {
      try {
        await prisma.notification.update({
          where: { id: notificationId },
          data: { read: true }
        });
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  res.end();
}