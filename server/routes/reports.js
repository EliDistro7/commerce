// Create a new file: routes/reports.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
//const authenticateAdmin = require('../middleware/auth'); // You'll need to create this middleware

const router = express.Router();
const prisma = new PrismaClient();

// Sales over time report
router.get('/sales-over-time', async (req, res) => {
  try {
    const { startDate, endDate, granularity = 'daily' } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Get orders for the current period
    const orders = await prisma.customer_order.findMany({
      where: {
        dateTime: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        dateTime: 'asc'
      }
    });

    // Get orders for the previous period (same duration)
    const previousPeriodStart = new Date(start);
    const previousPeriodEnd = new Date(end);
    const duration = end.getTime() - start.getTime();
    previousPeriodStart.setTime(previousPeriodStart.getTime() - duration);
    previousPeriodEnd.setTime(previousPeriodEnd.getTime() - duration);

    const previousPeriodOrders = await prisma.customer_order.findMany({
      where: {
        dateTime: {
          gte: previousPeriodStart,
          lte: previousPeriodEnd
        }
      }
    });

    // Calculate metrics
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const numberOfOrders = orders.length;
    const averageOrderValue = numberOfOrders > 0 ? totalSales / numberOfOrders : 0;
    
    const prevTotalSales = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const prevNumberOfOrders = previousPeriodOrders.length;
    const prevAverageOrderValue = prevNumberOfOrders > 0 ? prevTotalSales / prevNumberOfOrders : 0;
    
    // Calculate percentage changes
    const totalSalesChange = prevTotalSales > 0 
      ? ((totalSales - prevTotalSales) / prevTotalSales * 100).toFixed(2)
      : 0;
    
    const numberOfOrdersChange = prevNumberOfOrders > 0 
      ? ((numberOfOrders - prevNumberOfOrders) / prevNumberOfOrders * 100).toFixed(2)
      : 0;
    
    const averageOrderValueChange = prevAverageOrderValue > 0 
      ? ((averageOrderValue - prevAverageOrderValue) / prevAverageOrderValue * 100).toFixed(2)
      : 0;

    // Group data by the specified granularity
    const timePoints = [];
    const values = [];

    if (orders.length > 0) {
      // Create date formatter
      const formatDate = (date, gran) => {
        // Ensure date is valid before processing
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          console.warn('Invalid date encountered:', date);
          return 'Invalid Date';
        }
        
        switch (gran) {
          case 'daily':
            return date.toISOString().split('T')[0];
          case 'weekly':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            return `Week of ${weekStart.toISOString().split('T')[0]}`;
          case 'monthly':
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          case 'quarterly':
            const quarter = Math.floor(date.getMonth() / 3) + 1;
            return `Q${quarter} ${date.getFullYear()}`;
          case 'annually':
            return date.getFullYear().toString();
          default:
            return date.toISOString().split('T')[0];
        }
      };

      // Group orders by granularity
      const groupedData = {};
      
      orders.forEach(order => {
        // Use dateTime instead of createdAt since that's what's in your schema
        if (!order.dateTime) {
          console.warn('Order has no dateTime:', order.id);
          return;
        }
        
        const dateObj = new Date(order.dateTime);
        if (isNaN(dateObj.getTime())) {
          console.warn('Invalid dateTime for order:', order.id, order.dateTime);
          return;
        }
        
        const timeKey = formatDate(dateObj, granularity);
        
        if (!groupedData[timeKey]) {
          groupedData[timeKey] = 0;
        }
        
        groupedData[timeKey] += order.total;
      });

      // Convert grouped data to arrays
      Object.keys(groupedData).sort().forEach(timeKey => {
        timePoints.push(timeKey);
        values.push(groupedData[timeKey]);
      });
    }

    res.status(200).json({
      timePoints,
      values,
      metrics: {
        totalSales,
        averageOrderValue,
        numberOfOrders,
        totalSalesChange,
        averageOrderValueChange,
        numberOfOrdersChange
      }
    });
  } catch (error) {
    console.error('Error in sales-over-time API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Dashboard data
router.get('/report-dashboard', async (req, res) => {
    try {
      // Get current date
      const currentDate = new Date();
      
      // Get start of current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Get start of previous month
      const startOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      
      // Get end of previous month
      const endOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  
      // Get orders from current month
      const currentMonthOrders = await prisma.customer_order.findMany({
        where: {
          dateTime: {
            gte: startOfMonth,
            lte: currentDate
          }
        }
      });
  
      // Get orders from previous month
      const prevMonthOrders = await prisma.customer_order.findMany({
        where: {
          dateTime: {
            gte: startOfPrevMonth,
            lte: endOfPrevMonth
          }
        }
      });
  
      // Calculate sales metrics
      const currentMonthSales = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
      const prevMonthSales = prevMonthOrders.reduce((sum, order) => sum + order.total, 0);
      const salesChange = prevMonthSales > 0 
        ? ((currentMonthSales - prevMonthSales) / prevMonthSales) * 100
        : 100;
  
      // Get recent orders (last 5)
      const recentOrders = await prisma.customer_order.findMany({
        take: 5,
        orderBy: {
          dateTime: 'desc'
        },
        select: {
          id: true,
          name: true,
          email: true,
          total: true,
          status: true,
          dateTime: true
        }
      });
  
      // Format recent orders for display
      const formattedRecentOrders = recentOrders.map(order => ({
        id: order.id,
        customer: `${order.name}`,
        date: order.dateTime ? new Date(order.dateTime).toLocaleDateString() : 'N/A',
        total: order.total / 100, // Convert from cents to dollars
        status: order.status
      }));
  
      // Get product count
      const productCount = await prisma.product.count();

      // For the previous month product count, handle potential missing createdAt field
      let prevMonthProductCount;
      try {
        prevMonthProductCount = await prisma.product.count({
          where: {
            createdAt: {
              lt: startOfMonth
            }
          }
        });
      } catch (error) {
        // If the query fails due to missing createdAt field, fallback to total count
        console.warn("Failed to filter products by createdAt, using total count instead:", error.message);
        prevMonthProductCount = productCount;
      }

      // Calculate change with the retrieved counts
      const productChange = prevMonthProductCount > 0
        ? ((productCount - prevMonthProductCount) / prevMonthProductCount) * 100
        : 100;
      
      // Get customer (user) count
      const customerCount = await prisma.user.count({
        where: {
          role: 'user'
        }
      });

      // For the previous month customer count, handle potential missing createdAt field
      let prevMonthCustomerCount;
      try {
        prevMonthCustomerCount = await prisma.user.count({
          where: {
            role: 'user',
            createdAt: {
              lt: startOfMonth
            }
          }
        });
      } catch (error) {
        // If the query fails due to missing createdAt field, fallback to total count
        console.warn("Failed to filter users by createdAt, using total user count instead:", error.message);
        prevMonthCustomerCount = customerCount;
      }

      // Then calculate the change as before
      const customerChange = prevMonthCustomerCount > 0
        ? ((customerCount - prevMonthCustomerCount) / prevMonthCustomerCount) * 100
        : 100;
      
      // Generate recent activity
      const recentActivity = [
        {
          id: '1',
          description: 'New product added: Gaming Headset X3',
          time: '2 hours ago'
        },
        {
          id: '2',
          description: 'Order #12345 status changed to "Shipped"',
          time: '3 hours ago'
        },
        {
          id: '3',
          description: 'Inventory alert: "Bluetooth Speaker" is low in stock',
          time: '5 hours ago'
        },
        {
          id: '4',
          description: 'New customer registered: john.doe@example.com',
          time: '1 day ago'
        }
      ];
  
      res.status(200).json({
        stats: {
          sales: { 
            value: currentMonthSales / 100, // Convert from cents to dollars
            direction: salesChange >= 0 ? 'up' : 'down',
            change: Math.abs(Math.round(salesChange))
          },
          orders: { 
            value: currentMonthOrders.length,
            direction: currentMonthOrders.length >= prevMonthOrders.length ? 'up' : 'down',
            change: Math.abs(Math.round(((currentMonthOrders.length - prevMonthOrders.length) / Math.max(1, prevMonthOrders.length)) * 100))
          },
          customers: { 
            value: customerCount,
            direction: customerChange >= 0 ? 'up' : 'down',
            change: Math.abs(Math.round(customerChange))
          },
          products: { 
            value: productCount,
            direction: productChange >= 0 ? 'up' : 'down',
            change: Math.abs(Math.round(productChange))
          }
        },
        recentOrders: formattedRecentOrders,
        recentActivity: recentActivity
      });
    } catch (error) {
      console.error('Error in dashboard API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Top selling products report
router.get('/top-selling-products', async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;
    
    // Parse limit to integer
    const resultLimit = parseInt(limit, 10);
    
    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.dateTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const whereClause = startDate && endDate
    ? `WHERE co.dateTime >= '${new Date(startDate).toISOString()}' AND co.dateTime <= '${new Date(endDate).toISOString()}'`
    : '';
  

  const query = `
    SELECT 
      p.id,
    
      p.title,
      p.mainImage,
      p.price,
      p.categoryId,
      c.name as categoryName,
      SUM(cop.quantity) as totalQuantitySold,
      SUM(cop.quantity * p.price) as totalRevenue
    FROM customer_order_product cop
    JOIN product p ON cop.productId = p.id
    JOIN category c ON p.categoryId = c.id
    JOIN customer_order co ON cop.customerOrderId = co.id
    ${whereClause}
    GROUP BY p.id, p.title, p.mainImage, p.price, p.categoryId, c.name
    ORDER BY totalQuantitySold DESC
    LIMIT ${Number(resultLimit)}
  `;
  
  const topProducts = await prisma.$queryRawUnsafe(query);
  

    // Calculate total sales across all products in the report
    const totalSales = topProducts.reduce((sum, product) => sum + Number(product.totalRevenue), 0);

    // Add percentage of total sales to each product
    const productsWithPercentage = topProducts.map(product => ({
      id: product.id,
      title: product.title,
      mainImage: product.mainImage,
      price: product.price / 100, // Convert from cents to dollars for display
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      quantitySold: Number(product.totalQuantitySold),
      revenue: Number(product.totalRevenue) / 100, // Convert from cents to dollars
      percentageOfSales: totalSales > 0 ? ((Number(product.totalRevenue) / totalSales) * 100).toFixed(2) : 0
    }));

    // Get data for chart visualization
    const chartData = {
      labels: productsWithPercentage.map(product => product.title),
      datasets: [
        {
          label: 'Units Sold',
          data: productsWithPercentage.map(product => product.quantitySold)
        },
        {
          label: 'Revenue ($)',
          data: productsWithPercentage.map(product => product.revenue)
        }
      ]
    };

    res.status(200).json({
      products: productsWithPercentage,
      totalProducts: productsWithPercentage.length,
      totalSales: totalSales / 100, // Convert from cents to dollars
      chartData
    });
  } catch (error) {
    console.error('Error in top-selling-products API:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
  
  module.exports = router;