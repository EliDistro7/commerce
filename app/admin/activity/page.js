// pages/admin/activity.js

'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Package, ShoppingCart, UserPlus, Clock, Search,
  ArrowLeft, ArrowRight, Filter, AlertTriangle
} from 'lucide-react';
import axios from 'axios';

// Translations object
const translations = {
  en: {
    pageTitle: "Activity Log",
    searchPlaceholder: "Search activities...",
    filterAll: "All Activities",
    filterProducts: "Products",
    filterOrders: "Orders",
    filterUsers: "Users",
    noActivities: "No activities found",
    loadingText: "Loading activities...",
    errorText: "Error loading activities",
    tryAgain: "Try Again",
    previous: "Previous",
    next: "Next",
    showingResults: "Showing {start}-{end} of {total} results",
    productAdded: "Product Added",
    orderStatus: "Order Status",
    userSignup: "User Signup"
  },
  sw: {
    pageTitle: "Kumbukumbu za Shughuli",
    searchPlaceholder: "Tafuta shughuli...",
    filterAll: "Shughuli Zote",
    filterProducts: "Bidhaa",
    filterOrders: "Agizo",
    filterUsers: "Watumiaji",
    noActivities: "Hakuna shughuli zilizopatikana",
    loadingText: "Inapakia shughuli...",
    errorText: "Hitilafu katika kupakia shughuli",
    tryAgain: "Jaribu Tena",
    previous: "Iliyotangulia",
    next: "Ifuatayo",
    showingResults: "Inaonyesha {start}-{end} kati ya matokeo {total}",
    productAdded: "Bidhaa Imeongezwa",
    orderStatus: "Hali ya Agizo",
    userSignup: "Usajili wa Mtumiaji"
  }
};

// Icons mapping for activity types
const iconMapping = {
  'PackageIcon': Package,
  'ShoppingCartIcon': ShoppingCart,
  'UserPlusIcon': UserPlus
};

// Color mapping for activity types
const colorMapping = {
  'primary': 'bg-primary-100 text-primary-700',
  'secondary': 'bg-secondary-100 text-secondary-700',
  'success': 'bg-success-100 text-success-700',
  'error': 'bg-error-100 text-error-700'
};

export default function ActivityPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/admin/activity`, {
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      });
      setActivities(response.data.activities);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchActivities();
  }, [pagination.page, pagination.limit]);
  
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };
  
  const handleNextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };
  
  const filteredActivities = activities
    .filter(activity => {
      // Apply type filter
      if (filter !== 'all') {
        if (filter === 'products' && activity.type !== 'product_added') return false;
        if (filter === 'orders' && activity.type !== 'order_status') return false;
        if (filter === 'users' && activity.type !== 'customer_signup') return false;
      }
      
      // Apply search filter
      if (searchTerm) {
        const description = activity.description[language] || activity.description.en;
        return description.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  
  // Get the appropriate activity type label
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'product_added': return t.productAdded;
      case 'order_status': return t.orderStatus;
      case 'customer_signup': return t.userSignup;
      default: return type;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-heading font-semibold text-black mb-6">
          {t.pageTitle}
        </h1>
        
        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="pl-10 pr-4 py-2 w-full border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              {t.filterAll}
            </button>
            <button 
              onClick={() => setFilter('products')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'products' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              {t.filterProducts}
            </button>
            <button 
              onClick={() => setFilter('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'orders' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              {t.filterOrders}
            </button>
            <button 
              onClick={() => setFilter('users')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'users' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
            >
              {t.filterUsers}
            </button>
          </div>
        </div>
        
        {/* Activities list */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-pulse text-neutral-500">{t.loadingText}</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-10">
            <AlertTriangle size={40} className="text-error-500 mb-3" />
            <p className="text-error-600 mb-2">{t.errorText}</p>
            <button 
              onClick={fetchActivities}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {t.tryAgain}
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex justify-center items-center py-10 text-neutral-500">
            {t.noActivities}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {filteredActivities.map(activity => {
                const IconComponent = iconMapping[activity.icon] || Clock;
                const colorClass = colorMapping[activity.color] || 'bg-neutral-100 text-neutral-700';
                
                return (
                  <div key={activity.id} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <IconComponent size={18} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-neutral-900">
                              {activity.description[language] || activity.description.en}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {getActivityTypeLabel(activity.type)}
                            </p>
                          </div>
                          <span className="text-xs text-neutral-500 whitespace-nowrap">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && filteredActivities.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              {t.showingResults
                .replace('{start}', (pagination.page - 1) * pagination.limit + 1)
                .replace('{end}', Math.min(pagination.page * pagination.limit, pagination.total))
                .replace('{total}', pagination.total)
              }
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={pagination.page <= 1}
                className={`p-2 rounded-lg border ${pagination.page <= 1 ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
              >
                <ArrowLeft size={18} />
              </button>
              
              <button 
                onClick={handleNextPage}
                disabled={pagination.page >= pagination.totalPages}
                className={`p-2 rounded-lg border ${pagination.page >= pagination.totalPages ? 'border-neutral-200 text-neutral-300 cursor-not-allowed' : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'}`}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}