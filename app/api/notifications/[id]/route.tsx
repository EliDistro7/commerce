// app/api/notifications/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/utils/db'; // Use your existing Prisma client import

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.notification.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}

// Optional: Add this if you want to handle other methods
export async function GET() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: 'PATCH, DELETE' }
  });
}