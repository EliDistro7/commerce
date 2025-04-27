// app/api/socket/route.js
import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Store the Socket.io server instance
let io;

export async function GET(req) {
  // Get the response object and create a ReadableStream
  const res = new NextResponse(
    new ReadableStream({
      start(controller) {
        // Keep the connection open
      }
    })
  );

  // Check if socket.io server is already running
  if (!io) {
    console.log('Setting up socket');
    
    // Create a new Socket.io server
    // You'll need to adapt this to your specific server setup
    // This is just a conceptual example
    io = new SocketIOServer(res.socket?.server || global);
    
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
  }

  return new NextResponse('Socket server initialized', {
    status: 200,
  });
}