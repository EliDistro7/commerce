// components/admin/layout/AdminLayout.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import {io} from 'socket.io-client';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  FileText, 
  Tag,
  Receipt,
  Heart,
  Check
} from 'lucide-react';

// Initialize socket connection outside of component to prevent multiple connections
let socket;

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const socketRef = useRef(null);
  
  // Mock user data - replace with actual auth logic
  const user = {
    id: "admin-user-id", // You'll need to replace this with actual user ID
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/api/placeholder/40/40"
  };

  

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER);

      socketRef.current.on('connect', () => {
        console.log('Connected to notification server');
        socketRef.current.emit('authenticate', user.id);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err);
      });

      socketRef.current.on('notifications', (data) => {
        console.log('Initial notifications:', data);
        setNotifications(data);
      });

      socketRef.current.on('newNotification', (notif) => {
        console.log('New notification:', notif);
        setNotifications((prev) => [notif, ...prev]);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Fetch all notifications when the component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/notifications?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log('notis', data)
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
  }, [user.id]);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
    { name: "Products", icon: <ShoppingBag size={20} />, href: "/admin/products2" },
    { name: "Categories", icon: <Tag size={20} />, href: "/admin/categories2" },
    { name: "Orders", icon: <FileText size={20} />, href: "/admin/orders2" },
    { name: "Customers", icon: <Users size={20} />, href: "/admin/users2" },
    { name: "Wishlist Data", icon: <Heart size={20} />, href: "/admin/wishlist2" },
    { name: "Reports", icon: <Receipt size={20} />, href: "/admin/reports" },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (id) => {
    try {
      // Update via API
      await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      // Update via Socket
      socket.emit('markAsRead', id);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
    // router.push("/admin/login");
  };
  
  // Helper function to format notification time
  const formatNotificationTime = (dateTime) => {
    const now = new Date();
    const notificationDate = new Date(dateTime);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-primary-500 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo/Brand */}
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && (
            <Link href="/admin" className="text-xl font-heading font-bold">
              Admin Panel
            </Link>
          )}
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-primary-600">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-3 ${
                    router.pathname === item.href 
                      ? 'bg-primary-600 border-l-4 border-accent-mint' 
                      : 'hover:bg-primary-600'
                  } transition-colors duration-200`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-600">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 rounded-md hover:bg-primary-600 transition-colors duration-200"
          >
            <LogOut size={20} className="mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 shadow-soft">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="text-xl font-medium text-black">
              {navItems.find(item => item.href === router.pathname)?.name || "Admin Dashboard"}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 rounded-full hover:bg-neutral-100 relative"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 rounded-full text-white text-xs flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
                
                {/* Notification dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 w-72 mt-2 bg-white border border-neutral-200 rounded-md shadow-lg z-50">
                    <div className="p-3 border-b border-neutral-200 flex justify-between items-center">
                      <h3 className="font-medium">Notifications</h3>
                      <span className="text-xs text-neutral-500">
                        {notifications.filter(n => !n.read).length} unread
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-3 border-b border-neutral-100 flex items-start ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <p className="text-sm">{notification.text}</p>
                              <p className="text-xs text-neutral-500 mt-1">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.read && (
                              <button 
                                onClick={() => markAsRead(notification.id)}
                                className="ml-2 p-1 text-blue-500 hover:text-blue-700"
                                title="Mark as read"
                              >
                                <Check size={16} />
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-neutral-500 text-sm">
                          No notifications
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-neutral-200">
                      <Link 
                        href="/admin/notifications" 
                        className="block text-center text-sm text-blue-500 hover:text-blue-700"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex items-center">
                <img 
                  src={user.avatar} 
                  alt="User" 
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}