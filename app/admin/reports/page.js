'use client';

// File: pages/admin/reports/index.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BarChart3,
  LineChart,
  PieChart,
  CalendarDays,
  Download,
  Filter,
  RefreshCw,
  Search,
  Tag,
  Users,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Layers,
  AlertTriangle,
  Clock
} from 'lucide-react';
import ReportCard from '@/components/admin/ReportCard';
import DateRangePicker from '@/components/admin/DateRangePicker';
import axios from 'axios';

// Translations
const translations = {
  en: {
    reportsTitle: "Reports & Analytics",
    reportsSubtitle: "Get insights into your store's performance",
    dateRange: "Date Range",
    exportReport: "Export Report",
    regenerateReport: "Regenerate",
    filterOptions: "Filter Options",
    searchPlaceholder: "Search reports...",
    loadingText: "Loading reports data...",
    errorText: "Failed to load reports. Please try again later.",
    categories: {
      sales: "Sales Reports",
      inventory: "Inventory Reports",
      customers: "Customer Reports",
      orders: "Order Reports"
    },
    reports: {
      salesOverTime: "Sales Over Time",
      revenueByCategory: "Revenue by Category",
      topSellingProducts: "Top Selling Products",
      lowStockItems: "Low Stock Items",
      inventoryValue: "Inventory Value",
      categoryBreakdown: "Category Breakdown",
      customerAcquisition: "Customer Acquisition",
      orderStatus: "Order Status",
      averageOrderValue: "Average Order Value",
      salesByCountry: "Sales by Country"
    },
    recentActivity: "Recent Activity",
    noActivity: "No recent activity found",
    recentOrders: "Recent Orders"
  },
  sw: {
    reportsTitle: "Ripoti na Uchambuzi",
    reportsSubtitle: "Pata maarifa kuhusu utendaji wa duka lako",
    dateRange: "Kipindi cha Tarehe",
    exportReport: "Hamisha Ripoti",
    regenerateReport: "Tengeneza Upya",
    filterOptions: "Chaguo za Kuchuja",
    searchPlaceholder: "Tafuta ripoti...",
    loadingText: "Inapakia data za ripoti...",
    errorText: "Imeshindwa kupakia ripoti. Tafadhali jaribu tena baadaye.",
    categories: {
      sales: "Ripoti za Mauzo",
      inventory: "Ripoti za Bidhaa",
      customers: "Ripoti za Wateja",
      orders: "Ripoti za Oda"
    },
    reports: {
      salesOverTime: "Mauzo kwa Muda",
      revenueByCategory: "Mapato kwa kila Category",
      topSellingProducts: "Bidhaa Zinazouza Zaidi",
      lowStockItems: "Bidhaa za Hifadhi ya Chini",
      inventoryValue: "Thamani ya Bidhaa",
      categoryBreakdown: "Mgawanyo wa Kategoria",
      customerAcquisition: "Upatikanaji wa Wateja",
      orderStatus: "Hali ya Oda",
      averageOrderValue: "Wastani wa Thamani ya Agizo",
      salesByCountry: "Mauzo kwa Nchi"
    },
    recentActivity: "Shughuli za Hivi Karibuni",
    noActivity: "Hakuna shughuli za hivi karibuni",
    recentOrders: "Oda za Hivi Karibuni"
  }
};

// API call to fetch reports data
const fetchReportsData = async (dateRange) => {
  try {
    const { startDate, endDate } = dateRange;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/reports/report-dashboard`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
    console.log('reports', response);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    throw error;
  }
};

export default function ReportsPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('sales');
  const [reportsData, setReportsData] = useState(null);
  
  // Default date range - last 30 days
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  // Reports categories
  const categories = [
    { id: 'sales', name: t.categories.sales, icon: <CreditCard size={18} /> },
    { id: 'inventory', name: t.categories.inventory, icon: <Layers size={18} /> },
    { id: 'customers', name: t.categories.customers, icon: <Users size={18} /> },
    { id: 'orders', name: t.categories.orders, icon: <ShoppingBag size={18} /> }
  ];

  // Reports configuration
  const reports = {
    sales: [
      { id: 'salesOverTime', title: t.reports.salesOverTime, icon: <LineChart size={18} />, chartType: 'line', color: 'bg-primary-500', link: '/admin/reports/sales-over-time' },
      { id: 'revenueByCategory', title: t.reports.revenueByCategory, icon: <PieChart size={18} />, chartType: 'pie', color: 'bg-accent-emerald', link: '/admin/reports/revenue-by-category' },
      { id: 'topSellingProducts', title: t.reports.topSellingProducts, icon: <TrendingUp size={18} />, chartType: 'bar', color: 'bg-secondary-500', link: '/admin/reports/top-selling-products' },
      { id: 'salesByCountry', title: t.reports.salesByCountry, icon: <BarChart3 size={18} />, chartType: 'geo', color: 'bg-accent-sky', link: '/admin/reports/sales-by-country' }
    ],
    inventory: [
      { id: 'lowStockItems', title: t.reports.lowStockItems, icon: <Tag size={18} />, chartType: 'table', color: 'bg-error-500', link: '/admin/reports/low-stock-items' },
      { id: 'inventoryValue', title: t.reports.inventoryValue, icon: <BarChart3 size={18} />, chartType: 'bar', color: 'bg-accent-forest', link: '/admin/reports/inventory-value' },
      { id: 'categoryBreakdown', title: t.reports.categoryBreakdown, icon: <PieChart size={18} />, chartType: 'pie', color: 'bg-primary-500', link: '/admin/reports/category-breakdown' }
    ],
    customers: [
      { id: 'customerAcquisition', title: t.reports.customerAcquisition, icon: <LineChart size={18} />, chartType: 'line', color: 'bg-secondary-500', link: '/admin/reports/customer-acquisition' }
    ],
    orders: [
      { id: 'orderStatus', title: t.reports.orderStatus, icon: <PieChart size={18} />, chartType: 'pie', color: 'bg-accent-emerald', link: '/admin/reports/order-status' },
      { id: 'averageOrderValue', title: t.reports.averageOrderValue, icon: <LineChart size={18} />, chartType: 'line', color: 'bg-primary-500', link: '/admin/reports/average-order-value' }
    ]
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchReportsData(dateRange);
        setReportsData(data);
        setError(null);
      } catch (error) {
        console.error("Error loading reports data:", error);
        setError(t.errorText);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dateRange, t.errorText]);

  // Filter reports based on search term
  const filteredReports = reports[activeCategory]?.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm('');
  };

  // Handle regenerate reports
  const handleRegenerateReports = async () => {
    setIsLoading(true);
    try {
      const data = await fetchReportsData(dateRange);
      setReportsData(data);
      setError(null);
    } catch (error) {
      setError(t.errorText);
    } finally {
      setIsLoading(false);
    }
  };

  // Get stats for a particular category
  const getStatsForCategory = (category) => {
    if (!reportsData || !reportsData.stats) return null;
    
    switch(category) {
      case 'sales':
        return reportsData.stats.sales;
      case 'inventory':
        return reportsData.stats.products;
      case 'customers':
        return reportsData.stats.customers;
      case 'orders':
        return reportsData.stats.orders;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-primary-500">{t.loadingText}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-heading font-bold text-black">{t.reportsTitle}</h2>
          <p className="text-neutral-500 mt-1">{t.reportsSubtitle}</p>
        </div>
        
        {/* Control Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-soft">
          {/* Date Range Picker */}
          <div className="flex items-center space-x-2">
            <CalendarDays size={18} className="text-neutral-500" />
            <span className="text-sm font-medium mr-2">{t.dateRange}:</span>
            <DateRangePicker 
              startDate={dateRange.startDate}
              endDate={dateRange.endDate} 
              onChange={handleDateRangeChange}
              language={language}
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleRegenerateReports}
              className="flex items-center space-x-1 bg-primary-50 text-primary-700 px-3 py-2 rounded-md text-sm hover:bg-primary-100 transition-colors"
            >
              <RefreshCw size={16} />
              <span>{t.regenerateReport}</span>
            </button>
            
            <button 
              className="flex items-center space-x-1 bg-neutral-100 text-neutral-700 px-3 py-2 rounded-md text-sm hover:bg-neutral-200 transition-colors"
            >
              <Download size={16} />
              <span>{t.exportReport}</span>
            </button>
          </div>
        </div>
        
        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Categories */}
          <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center space-x-2 whitespace-nowrap px-4 py-2 rounded-md text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
                {reportsData?.stats && (
                  <span className="ml-1 bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full">
                    {getStatsForCategory(category.id)?.value || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative flex-grow">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-neutral-200 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-error-50 text-error-700 p-4 rounded-lg flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Stats Summary */}
        {reportsData?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-neutral-500">Total Sales</p>
                  <h3 className="text-xl font-bold">Tsh {reportsData.stats.sales.value.toFixed(2)}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${reportsData.stats.sales.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reportsData.stats.sales.direction === 'up' ? '+' : '-'}{reportsData.stats.sales.change}%
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-neutral-500">Orders</p>
                  <h3 className="text-xl font-bold">{reportsData.stats.orders.value}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${reportsData.stats.orders.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reportsData.stats.orders.direction === 'up' ? '+' : '-'}{reportsData.stats.orders.change}%
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-neutral-500">Products</p>
                  <h3 className="text-xl font-bold">{reportsData.stats.products.value}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${reportsData.stats.products.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reportsData.stats.products.direction === 'up' ? '+' : '-'}{reportsData.stats.products.change}%
                </span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-soft">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-neutral-500">Customers</p>
                  <h3 className="text-xl font-bold">{reportsData.stats.customers.value}</h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${reportsData.stats.customers.direction === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {reportsData.stats.customers.direction === 'up' ? '+' : '-'}{reportsData.stats.customers.change}%
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                title={report.title}
                icon={report.icon}
                chartType={report.chartType}
                color={report.color}
                link={report.link}
                dateRange={dateRange}
                data={reportsData}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-neutral-500">
              <Search size={24} className="mb-2 opacity-50" />
              <p>No reports found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        {/* Recent Activity Section */}
        {reportsData?.recentActivity && reportsData.recentActivity.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-soft">
            <h3 className="text-lg font-medium mb-4">{t.recentActivity}</h3>
            <div className="space-y-4">
              {reportsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2 pb-3 border-b border-neutral-100">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <Clock size={16} className="text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.description}</p>
                    <span className="text-xs text-neutral-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Orders Section */}
        {reportsData?.recentOrders && reportsData.recentOrders.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-soft">
            <h3 className="text-lg font-medium mb-4">{t.recentOrders}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {reportsData.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-2 text-sm">{order.id}</td>
                      <td className="px-4 py-2 text-sm">{order.customer}</td>
                      <td className="px-4 py-2 text-sm">{order.date}</td>
                      <td className="px-4 py-2 text-sm">Tsh {order.total.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
    
  );
}