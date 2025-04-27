'use client';

// File: pages/admin/index.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import DashboardStats from '@/components/DashboardStats';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Plus, 
  List, 
  BarChart3, 
  Package, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

// Translations object
const translations = {
  en: {
    welcomeBack: "Welcome back, Admin",
    quickActions: "Quick Actions",
    viewAll: "View All",
    recentOrders: "Recent Orders",
    recentActivity: "Recent Activity",
    loadingText: "Loading dashboard data...",
    errorText: "Failed to load dashboard data. Please try again later.",
    noOrdersFound: "No recent orders found",
    noActivityFound: "No recent activity found",
    orderId: "Order ID",
    customer: "Customer",
    date: "Date",
    amount: "Amount",
    status: "Status",
    addNewProduct: "Add New Product",
    viewAllOrders: "View All Orders",
    runReports: "Run Reports",
    manageInventory: "Manage Inventory"
  },
  sw: {
    welcomeBack: "Karibu tena, Msimamizi",
    quickActions: "Vitendo vya Haraka",
    viewAll: "Tazama Zote",
    recentOrders: "Orders za Hivi Karibuni",
    recentActivity: "Shughuli za Hivi Karibuni",
    loadingText: "Inapakia data za dashibodi...",
    errorText: "Imeshindwa kupakia data za dashibodi. Tafadhali jaribu tena baadaye.",
    noOrdersFound: "Hakuna orders za hivi karibuni yaliyopatikana",
    noActivityFound: "Hakuna shughuli za hivi karibuni zilizopatikana",
    orderId: "Kitambulisho cha Order",
    customer: "Mteja",
    date: "Tarehe",
    amount: "Kiasi",
    status: "Hali",
    addNewProduct: "Ongeza Bidhaa Mpya",
    viewAllOrders: "Tazama orders zote",
    runReports: "Ripoti",
    manageInventory: "Inventory"
  }
};

// API call to fetch real data
const fetchDashboardData = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/dashboard`);
    console.log("dashboard response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export default function AdminDashboard() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [dashboardData, setDashboardData] = useState({
    // Default empty data structure to prevent errors
    stats: {
      sales: { value: 0, direction: 'up', change: 0 },
      orders: { value: 0, direction: 'up', change: 0 },
      customers: { value: 0, direction: 'up', change: 0 },
      products: { value: 0, direction: 'up', change: 0 }
    },
    recentOrders: [],
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        // Ensure we have proper data structure to prevent errors
        setDashboardData({
          stats: data.stats || {
            sales: { value: 0, direction: 'up', change: 0 },
            orders: { value: 0, direction: 'up', change: 0 },
            customers: { value: 0, direction: 'up', change: 0 },
            products: { value: 0, direction: 'up', change: 0 }
          },
          recentOrders: data.recentOrders || [],
          recentActivity: data.recentActivity || []
        });
        setError(null);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(t.errorText);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [t.errorText]);

  // Quick actions list
  const quickActions = [
    { name: t.addNewProduct, icon: <Plus size={18} />, color: "bg-primary-500", href: "/admin/new-product" },
    { name: t.viewAllOrders, icon: <List size={18} />, color: "bg-accent-emerald", href: "/admin/orders2" },
    { name: t.runReports, icon: <BarChart3 size={18} />, color: "bg-secondary-500", href: "/admin/reports" },
    { name: t.manageInventory, icon: <Package size={18} />, color: "bg-accent-forest", href: "/admin/inventory" }
  ];

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
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-bold text-black">{t.welcomeBack}</h2>
          <p className="text-neutral-500">{new Date().toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        
        {/* Dashboard Stats */}
        <DashboardStats dashboardData={dashboardData} />
        
        {/* Quick Actions Row */}
        <div>
          <h3 className="text-lg font-bold mb-4">{t.quickActions}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <a 
                key={action.name}
                href={action.href}
                className="bg-white shadow-soft rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${action.color} text-white flex items-center justify-center mb-3`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.name}</span>
              </a>
            ))}
          </div>
        </div>
        
        {/* Recent Activity and Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{t.recentOrders}</h3>
              <a href="/admin/orders" className="text-primary-500 text-sm hover:underline">{t.viewAll}</a>
            </div>
            
            {error ? (
              <div className="flex items-center justify-center p-6 text-error-500">
                <AlertTriangle size={18} className="mr-2" />
                <span>{error}</span>
              </div>
            ) : dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-neutral-200">
                      <th className="pb-2">{t.orderId}</th>
                      <th className="pb-2">{t.customer}</th>
                      <th className="pb-2">{t.date}</th>
                      <th className="pb-2">{t.amount}</th>
                      <th className="pb-2">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="py-3">{order.id.substring(0, 8)}...</td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3">{order.date}</td>
                        <td className="py-3">${order.total.toFixed(2)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            order.status === 'completed' ? 'bg-success-100 text-success-700' : 
                            order.status === 'processing' ? 'bg-neutral-100 text-neutral-700' :
                            'bg-accent-mint text-primary-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-neutral-500">
                <ShoppingBag size={24} className="mb-2 opacity-50" />
                <p>{t.noOrdersFound}</p>
              </div>
            )}
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{t.recentActivity}</h3>
              <a href="/admin/activity" className="text-primary-500 text-sm hover:underline">{t.viewAll}</a>
            </div>
            
            {error ? (
              <div className="flex items-center justify-center p-6 text-error-500">
                <AlertTriangle size={18} className="mr-2" />
                <span>{error}</span>
              </div>
            ) : dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="bg-neutral-100 rounded-full p-2 mr-3">
                      <Clock size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-neutral-500">
                <Clock size={24} className="mb-2 opacity-50" />
                <p>{t.noActivityFound}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}