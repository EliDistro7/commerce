const express = require("express");
const bcrypt = require('bcryptjs');
const fileUpload = require("express-fileupload");
const http = require('http');
const { Server } = require('socket.io');
const productsRouter = require("./routes/products");
const productImagesRouter = require("./routes/productImages");
const categoryRouter = require("./routes/category");
const searchRouter = require("./routes/search");
const mainImageRouter = require("./routes/mainImages");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/customer_orders");
const slugRouter = require("./routes/slugs");
const orderProductRouter = require('./routes/customer_order_product');
const wishlistRouter = require('./routes/wishlist');
const reportRouter = require('./routes/reports');

const { PrismaClient } = require('@prisma/client');
var cors = require("cors");

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? "https://commerce-bari1.vercel.app" : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
  
});

app.use(express.json());
// Also match Express CORS middleware:
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? "https://commerce-bari1.vercel.app" 
    : "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(fileUpload());

app.use("/api/products", productsRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/images", productImagesRouter);
app.use("/api/main-image", mainImageRouter);
app.use("/api/users", userRouter);
app.use("/api/search", searchRouter);
app.use("/api/orders", orderRouter);
app.use('/api/order-product', orderProductRouter);
app.use("/api/slugs", slugRouter);
app.use("/api/wishlist", wishlistRouter);
app.use('/api/reports', reportRouter)

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle user authentication for notifications
  socket.on('authenticate', async (userId) => {
    console.log(`User ${userId} authenticated`);
    // Associate this socket with the user ID
    socket.join(userId);
    
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
      socket.emit('notifications', []);
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

// Create notification endpoint
app.post('/api/notifications', async (req, res) => {
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

    // Emit to Socket.io client
    io.to(userId).emit('newNotification', notification);

    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get notifications endpoint
app.get('/api/notifications', async (req, res) => {
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
});

// Mark notification as read endpoint
app.patch('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true }
    });

    return res.status(200).json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Delete notification endpoint
app.delete('/api/notifications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.notification.delete({
      where: { id }
    });

    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Dashboard stats endpoint
// Dashboard stats endpoint
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    // Get total sales data
    const totalSales = await prisma.customer_order.aggregate({
      _sum: {
        total: true // Changed from total_price to total as per schema
      }
    });
    
    // Get previous period sales (last month)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const sixtyDaysAgo = new Date(today);
    sixtyDaysAgo.setDate(today.getDate() - 60);
    
    // Current month sales - using dateTime instead of created_at
    const currentSales = await prisma.customer_order.aggregate({
      where: {
        dateTime: {
          gte: thirtyDaysAgo
        }
      },
      _sum: {
        total: true
      }
    });
    
    // Previous month sales
    const previousSales = await prisma.customer_order.aggregate({
      where: {
        dateTime: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      },
      _sum: {
        total: true // Changed from total_price to total
      }
    });
    
    // Calculate sales change percentage
    const currentSalesValue = currentSales._sum.total || 0;
    const prevSalesValue = previousSales._sum.total || 0;
    const salesChange = prevSalesValue > 0 ? 
      ((currentSalesValue - prevSalesValue) / prevSalesValue) * 100 : 0;
    
    // Get orders count
    const currentOrdersCount = await prisma.customer_order.count({
      where: {
        dateTime: { // Changed from created_at
          gte: thirtyDaysAgo
        }
      }
    });
    
    const prevOrdersCount = await prisma.customer_order.count({
      where: {
        dateTime: { // Changed from created_at
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });
    
    const ordersChange = prevOrdersCount > 0 ?
      ((currentOrdersCount - prevOrdersCount) / prevOrdersCount) * 100 : 0;
    
    // Get customers count - note that without created_at field in User model
    // we can't accurately filter by date, so we'll count all users with role 'user'
    const totalCustomersCount = await prisma.user.count({
      where: {
        role: 'user' // Changed from CUSTOMER to user as per schema
      }
    });
    
    // Since we can't filter by date without created_at, we'll set these to 0
    // Alternatively, you could use ID ranges as an approximation
    const newCustomersCount = 0;
    const prevPeriodNewCustomersCount = 0;
    const customersChange = 0;
    
    // Get products count - same issue with created_at
    const totalProductsCount = await prisma.product.count();
    
    // Since we can't filter by date without created_at, we'll set these to 0
    const newProductsCount = 0;
    const prevPeriodNewProductsCount = 0;
    const productsChange = 0;
    
    res.json({
      stats: {
        sales: { 
          value: totalSales._sum.total || 0, // Changed from total_price to total
          change: parseFloat(salesChange.toFixed(1)), 
          direction: salesChange >= 0 ? 'up' : 'down' 
        },
        orders: { 
          value: await prisma.customer_order.count(), 
          change: parseFloat(ordersChange.toFixed(1)), 
          direction: ordersChange >= 0 ? 'up' : 'down' 
        },
        customers: { 
          value: totalCustomersCount, 
          change: parseFloat(customersChange.toFixed(1)), 
          direction: customersChange >= 0 ? 'up' : 'down' 
        },
        products: { 
          value: totalProductsCount, 
          change: parseFloat(productsChange.toFixed(1)), 
          direction: productsChange >= 0 ? 'up' : 'down' 
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Recent orders endpoint
app.get('/api/dashboard/recent-orders', async (req, res) => {
  try {
    const recentOrders = await prisma.customer_order.findMany({
      take: 5,
      orderBy: {
        dateTime: 'desc'
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    // Format the orders data
    const formattedOrders = recentOrders.map(order => ({
      id: `ORD-${order.id}`,
      customer: `${order.name} ${order.lastname}`, // Using name and lastname from Customer_order
      date: order.dateTime ? order.dateTime.toISOString().split('T')[0] : '',
      total: order.total, // It's already an Int in your schema
      status: order.status.toLowerCase()
    }));

    res.json({ recentOrders: formattedOrders });
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// Recent activity endpoint
// Recent activity endpoint
app.get('/api/dashboard/recent-activity', async (req, res) => {
  try {
    // Get recent products added - using ID as proxy since created_at doesn't exist
    const recentProducts = await prisma.product.findMany({
      take: 2,
      orderBy: {
        id: 'desc' // Assuming newer products have higher IDs since created_at isn't in schema
      },
      select: {
        id: true,
        title: true // Using title instead of name
      }
    });

    // Get recent order status changes
    const recentOrderStatusChanges = await prisma.customer_order.findMany({
      take: 2,
      orderBy: {
        dateTime: 'desc' // Using dateTime since updated_at doesn't exist
      },
      select: {
        id: true,
        status: true,
        dateTime: true
      }
    });

    // Get recent user signups - using ID as proxy for created_at
    const recentSignups = await prisma.user.findMany({
      take: 2,
      where: {
        role: 'user' // Your schema uses 'user' as default, not 'CUSTOMER'
      },
      orderBy: {
        id: 'desc' // Using ID as proxy for recent since created_at isn't in schema
      },
      select: {
        id: true,
        email: true
      }
    });

    // Format the time difference to human-readable format
    const formatTimeAgo = (date) => {
      if (!date) return 'recently';
      
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(minutes / 1440);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    };

    // Combine and sort all activities
    const activities = [
      ...recentProducts.map(product => ({
        id: `product_${product.id}`,
        type: 'product_added',
        description: `New product '${product.title}' added`, // Using title instead of name
        time: 'recently' // Since we don't have created_at timestamp
      })),
      
      ...recentOrderStatusChanges.map(order => ({
        id: `order_${order.id}`,
        type: 'order_status',
        description: `Order #ORD-${order.id} marked as ${order.status.toLowerCase()}`,
        time: formatTimeAgo(order.dateTime)
      })),
      
      ...recentSignups.map(user => ({
        id: `user_${user.id}`,
        type: 'customer_signup',
        description: `New user ${user.email} signed up`,
        time: 'recently' // Since we don't have created_at timestamp
      }))
    ];

    // Take top 5 activities (sorted by most recent first if possible)
    const sortedActivities = activities.slice(0, 5);

    res.json({ recentActivity: sortedActivities });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
});

// Full activity list endpoint
app.get('/api/admin/activity', async (req, res) => {
  try {
    // Optional pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get products added - using ID as proxy since created_at doesn't exist
    const products = await prisma.product.findMany({
      orderBy: {
        id: 'desc' // Assuming newer products have higher IDs
      },
      select: {
        id: true,
        title: true
      },
      take: limit,
      skip: skip
    });

    // Get order status changes
    const orderStatusChanges = await prisma.customer_order.findMany({
      orderBy: {
        dateTime: 'desc'
      },
      select: {
        id: true,
        status: true,
        dateTime: true
      },
      take: limit,
      skip: skip
    });

    // Get user signups
    const userSignups = await prisma.user.findMany({
      where: {
        role: 'user'
      },
      orderBy: {
        id: 'desc' // Using ID as proxy for recency
      },
      select: {
        id: true,
        email: true
      },
      take: limit,
      skip: skip
    });

    // Format the time difference to human-readable format
    const formatTimeAgo = (date) => {
      if (!date) return 'recently';
      
      const now = new Date();
      const diff = now - new Date(date);
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
      } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(minutes / 1440);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
      }
    };

    // Combine all activities
    const activities = [
      ...products.map(product => ({
        id: `product_${product.id}`,
        type: 'product_added',
        description: {
          en: `New product '${product.title}' added`,
          sw: `Bidhaa mpya '${product.title}' imeongezwa`
        },
        time: 'recently',
        icon: 'PackageIcon', // For frontend display
        color: 'success'
      })),
      
      ...orderStatusChanges.map(order => ({
        id: `order_${order.id}`,
        type: 'order_status',
        description: {
          en: `Order #ORD-${order.id} marked as ${order.status.toLowerCase()}`,
          sw: `Oda #ORD-${order.id} imewekwa kama ${order.status.toLowerCase()}`
        },
        time: formatTimeAgo(order.dateTime),
        icon: 'ShoppingCartIcon',
        color: 'primary'
      })),
      
      ...userSignups.map(user => ({
        id: `user_${user.id}`,
        type: 'customer_signup',
        description: {
          en: `New user ${user.email} signed up`,
          sw: `Mtumiaji mpya ${user.email} amejisajili`
        },
        time: 'recently',
        icon: 'UserPlusIcon',
        color: 'secondary'
      }))
    ];

    // Get total count for pagination
    const totalActivities = activities.length;

    res.json({ 
      activities,
      pagination: {
        total: totalActivities,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalActivities / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});


// Combined dashboard data endpoint (for convenience)
// Combined dashboard data endpoint (for convenience)
app.get('/api/dashboard', async (req, res) => {
  try {
    const axios = require('axios');
    const baseUrl = process.env.NEXT_PUBLIC_SERVER;
    console.log('base url')

    // Make internal requests to our other endpoints
    const statsPromise = axios.get(`${baseUrl}/api/dashboard/stats`)
      .then(response => response.data);
    
    const ordersPromise = axios.get(`${baseUrl}/api/dashboard/recent-orders`)
      .then(response => response.data);
    
    const activityPromise = axios.get(`${baseUrl}/api/dashboard/recent-activity`)
      .then(response => response.data);
    
    // Wait for all promises to resolve
    const [statsData, ordersData, activityData] = await Promise.all([
      statsPromise, ordersPromise, activityPromise
    ]);
    
    // Combine the data
    const dashboardData = {
      stats: statsData.stats,
      recentOrders: ordersData.recentOrders,
      recentActivity: activityData.recentActivity
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});