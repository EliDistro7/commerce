"use client";

// File: pages/admin/orders/index.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  MoreHorizontal,
  Loader2,
  FileText,
  Truck as TruckDelivery,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminOrders() {
  const { language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dateTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  // Bilingual content
  const translations = {
    title: {
      en: "Orders Management",
      sw: "Usimamizi wa Oda"
    },
    search: {
      en: "Search orders...",
      sw: "Tafuta oda..."
    },
    tableHeaders: {
      id: {
        en: "Order ID",
        sw: "Kitambulisho cha Oda"
      },
      customer: {
        en: "Customer",
        sw: "Mteja"
      },
      status: {
        en: "Status",
        sw: "Hali"
      },
      total: {
        en: "Total",
        sw: "Jumla"
      },
      location: {
        en: "Location",
        sw: "Mahali"
      },
      date: {
        en: "Order Date",
        sw: "Tarehe ya Oda"
      },
      actions: {
        en: "Actions",
        sw: "Vitendo"
      }
    },
    statuses: {
      pending: {
        en: "Pending",
        sw: "Inasubiri"
      },
      processing: {
        en: "Processing",
        sw: "Inachakatwa"
      },
      shipped: {
        en: "Shipped",
        sw: "Imetumwa"
      },
      delivered: {
        en: "Delivered",
        sw: "Imefikishwa"
      },
      cancelled: {
        en: "Cancelled",
        sw: "Imeghairiwa"
      }
    },
    filters: {
      all: {
        en: "All Orders",
        sw: "Oda Zote"
      },
      pending: {
        en: "Pending",
        sw: "Zinazosubiri"
      },
      processing: {
        en: "Processing",
        sw: "Zinazochakatwa"
      },
      shipped: {
        en: "Shipped",
        sw: "Zilizotumwa"
      },
      delivered: {
        en: "Delivered",
        sw: "Zilizofikishwa"
      },
      cancelled: {
        en: "Cancelled",
        sw: "Zilizoghairiwa"
      }
    },
    actions: {
      view: {
        en: "View Order",
        sw: "Angalia Oda"
      },
      edit: {
        en: "Edit Order",
        sw: "Hariri Oda"
      },
      delete: {
        en: "Delete Order",
        sw: "Futa Oda"
      },
      invoice: {
        en: "Download Invoice",
        sw: "Pakua Ankara"
      },
      track: {
        en: "Track Order",
        sw: "Fuatilia Oda"
      }
    },
    confirmDelete: {
      en: "Are you sure you want to delete this order?",
      sw: "Una uhakika unataka kufuta oda hii?"
    },
    loading: {
      en: "Loading orders...",
      sw: "Inapakia oda..."
    },
    error: {
      en: "Error loading orders:",
      sw: "Hitilafu kupakia oda:"
    },
    noOrders: {
      en: "No orders found",
      sw: "Hakuna oda zilizopatikana"
    },
    noMatches: {
      en: "No orders matching your search",
      sw: "Hakuna oda zinazofanana na utafutaji wako"
    },
    showing: {
      en: "Showing",
      sw: "Inaonyesha"
    },
    of: {
      en: "of",
      sw: "kati ya"
    },
    orders: {
      en: "orders",
      sw: "oda"
    },
    pagination: {
      previous: {
        en: "Previous",
        sw: "Iliyotangulia"
      },
      next: {
        en: "Next",
        sw: "Ifuatayo"
      }
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/orders`);
        
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(translations.confirmDelete[language])) {
      try {
        // Show loading indicator or disable button during delete operation
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/orders/${orderId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Error deleting order: ${response.statusText}`);
        }
        
        // Optimistically update UI
        setOrders(orders.filter(order => order.id !== orderId));
      } catch (err) {
        console.error("Failed to delete order:", err);
        alert("Error deleting order. Please try again.");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'sw-TZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'sw-TZ', {
      style: 'currency',
      currency: 'TZS'
    }).format(amount);
  };

  // Get appropriate icon for order status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <Package size={16} className="text-blue-500" />;
      case 'shipped':
        return <TruckDelivery size={16} className="text-indigo-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <ShoppingBag size={16} className="text-neutral-500" />;
    }
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  // Apply filters
  const filteredOrders = orders.filter(order => {
    // Apply search filter (search by order ID, name, email, or phone)
    const matchesSearch = 
      (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (order.name && order.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.lastname && order.lastname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.email && order.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.phone && order.phone.includes(searchTerm));
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    // Handle different field types
    if (sortField === 'total') {
      // Numeric sort
      const aTotal = typeof a.total === 'number' ? a.total : 0;
      const bTotal = typeof b.total === 'number' ? b.total : 0;
      return sortDirection === 'asc' ? aTotal - bTotal : bTotal - aTotal;
    } else if (sortField === 'dateTime') {
      // Date sort
      return sortDirection === 'asc' 
        ? new Date(a.dateTime) - new Date(b.dateTime) 
        : new Date(b.dateTime) - new Date(a.dateTime);
    } else {
      // String sort (ensure values exist before comparing)
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  // Helper for sort indicator
  const getSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center text-primary-500">
            <Loader2 size={24} className="mr-2 animate-spin" />
            <span>{translations.loading[language]}</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-error-100 p-4 rounded-lg text-error-700 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{translations.error[language]} {error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-heading font-bold"
          >
            {translations.title[language]}
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
              <input
                type="text"
                placeholder={translations.search[language]}
                className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2 border-b border-neutral-200">
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'all' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('all')}
          >
            {translations.filters.all[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'pending' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('pending')}
          >
            {translations.filters.pending[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'processing' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('processing')}
          >
            {translations.filters.processing[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'shipped' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('shipped')}
          >
            {translations.filters.shipped[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'delivered' ? 'text-green-500 border-b-2 border-green-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('delivered')}
          >
            {translations.filters.delivered[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${statusFilter === 'cancelled' ? 'text-red-500 border-b-2 border-red-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleStatusFilter('cancelled')}
          >
            {translations.filters.cancelled[language]}
          </button>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('id')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.id[language]}
                      {getSortIndicator('id')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.customer[language]}
                      {getSortIndicator('name')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.status[language]}
                      {getSortIndicator('status')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('total')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.total[language]}
                      {getSortIndicator('total')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('city')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.location[language]}
                      {getSortIndicator('city')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('dateTime')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.date[language]}
                      {getSortIndicator('dateTime')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {translations.tableHeaders.actions[language]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedOrders.length > 0 ? (
                  sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500 font-mono">
                          #{order.id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                            <ShoppingBag size={16} className="text-neutral-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{order.name} {order.lastname}</div>
                            <div className="text-xs text-neutral-500">{order.email}</div>
                            <div className="text-xs text-neutral-500">{order.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full flex items-center w-fit ${getStatusBadgeStyle(order.status)}`}
                        >
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {translations.statuses[order.status] ? translations.statuses[order.status][language] : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">
                          {formatCurrency(order.total)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin size={16} className="text-neutral-500 mr-1" />
                          <div className="text-sm">
                            {order.city}, {order.country}
                            {order.apartment && <div className="text-xs text-neutral-500">{order.apartment}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500">
                          {formatDate(order.dateTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="p-1 rounded-full hover:bg-neutral-100"
                            title={translations.actions.view[language]}
                          >
                            <Edit size={18} className="text-primary-500" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            title={translations.actions.delete[language]}
                            className="p-1 rounded-full hover:bg-neutral-100 text-error-500"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="relative group">
                            <button className="p-1 rounded-full hover:bg-neutral-100">
                              <MoreHorizontal size={18} className="text-neutral-500" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                              <div className="py-1">
                                <button
                                  onClick={() => router.push(`/admin/orders/invoice/${order.id}`)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100 w-full text-left"
                                >
                                  <FileText size={16} className="mr-2" />
                                  {translations.actions.invoice[language]}
                                </button>
                                <button
                                  onClick={() => router.push(`/admin/orders/track/${order.id}`)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100 w-full text-left"
                                >
                                  <TruckDelivery size={16} className="mr-2" />
                                  {translations.actions.track[language]}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                      {searchTerm ? translations.noMatches[language] : translations.noOrders[language]}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table footer with pagination */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              {translations.showing[language]} <span className="font-medium">{sortedOrders.length}</span> {translations.of[language]} <span className="font-medium">{orders.length}</span> {translations.orders[language]}
            </div>
            
            {/* Simple pagination */}
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-neutral-200 rounded-md bg-white text-sm disabled:opacity-50">
                {translations.pagination.previous[language]}
              </button>
              <button className="px-3 py-1 border border-neutral-200 rounded-md bg-white text-sm disabled:opacity-50">
                {translations.pagination.next[language]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}