

"use client";

// File: pages/admin/users/index.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle, 
  Shield, 
  UserPlus,
  User,
  UserCheck,
  Filter,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminUsers() {
  const { language } = useLanguage();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('email');
  const [sortDirection, setSortDirection] = useState('asc');
  const [roleFilter, setRoleFilter] = useState('all');
  const router = useRouter();

  // Bilingual content
  const translations = {
    title: {
      en: "Users Management",
      sw: "Usimamizi wa Watumiaji"
    },
    search: {
      en: "Search users...",
      sw: "Tafuta watumiaji..."
    },
    addNew: {
      en: "Add New User",
      sw: "Ongeza Mtumiaji Mpya"
    },
    tableHeaders: {
      id: {
        en: "ID",
        sw: "Kitambulisho"
      },
      email: {
        en: "Email",
        sw: "Barua pepe"
      },
      role: {
        en: "Role",
        sw: "Wajibu"
      },
      actions: {
        en: "Actions",
        sw: "Vitendo"
      }
    },
    roles: {
      admin: {
        en: "Admin",
        sw: "Msimamizi"
      },
      user: {
        en: "User",
        sw: "Mtumiaji"
      }
    },
    filters: {
      all: {
        en: "All Users",
        sw: "Watumiaji Wote"
      },
      admin: {
        en: "Admins Only",
        sw: "Wasimamizi Tu"
      },
      user: {
        en: "Regular Users",
        sw: "Watumiaji wa Kawaida"
      }
    },
    actions: {
      edit: {
        en: "Edit User",
        sw: "Hariri Mtumiaji"
      },
      delete: {
        en: "Delete User",
        sw: "Futa Mtumiaji"
      },
      resetPassword: {
        en: "Reset Password",
        sw: "Weka Upya Nenosiri"
      }
    },
    confirmDelete: {
      en: "Are you sure you want to delete this user?",
      sw: "Una uhakika unataka kufuta mtumiaji huyu?"
    },
    loading: {
      en: "Loading users...",
      sw: "Inapakia watumiaji..."
    },
    error: {
      en: "Error loading users:",
      sw: "Hitilafu kupakia watumiaji:"
    },
    noUsers: {
      en: "No users found",
      sw: "Hakuna watumiaji waliopatikana"
    },
    noMatches: {
      en: "No users matching your search",
      sw: "Hakuna watumiaji wanaofanana na utafutaji wako"
    },
    showing: {
      en: "Showing",
      sw: "Inaonyesha"
    },
    of: {
      en: "of",
      sw: "kati ya"
    },
    users: {
      en: "users",
      sw: "watumiaji"
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
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/users`);
        
        if (!response.ok) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
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

  const handleRoleFilter = (role) => {
    setRoleFilter(role);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(translations.confirmDelete[language])) {
      try {
        // Show loading indicator or disable button during delete operation
        // Actual API call would go here
        // await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/users/${userId}`, {
        //   method: 'DELETE',
        // });
        
        // Optimistically update UI
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Error deleting user. Please try again.");
      }
    }
  };

  // Apply filters
  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply role filter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Apply sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    // All fields are strings for now
    if (sortDirection === 'asc') {
      return a[sortField].localeCompare(b[sortField]);
    } else {
      return b[sortField].localeCompare(a[sortField]);
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
        
        {/* Role filter tabs */}
        <div className="flex space-x-2 border-b border-neutral-200">
          <button 
            className={`px-4 py-2 text-sm font-medium ${roleFilter === 'all' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleRoleFilter('all')}
          >
            {translations.filters.all[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${roleFilter === 'admin' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleRoleFilter('admin')}
          >
            {translations.filters.admin[language]}
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${roleFilter === 'user' ? 'text-primary-500 border-b-2 border-primary-500' : 'text-neutral-600 hover:text-neutral-900'}`}
            onClick={() => handleRoleFilter('user')}
          >
            {translations.filters.user[language]}
          </button>
        </div>
        
        {/* Users Table */}
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
                      onClick={() => handleSort('email')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.email[language]}
                      {getSortIndicator('email')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('role')}
                      className="flex items-center"
                    >
                      {translations.tableHeaders.role[language]}
                      {getSortIndicator('role')}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {translations.tableHeaders.actions[language]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sortedUsers.length > 0 ? (
                  sortedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-500 font-mono">
                          {user.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                            {user.role === 'admin' ? (
                              <Shield size={16} className="text-primary-500" />
                            ) : (
                              <User size={16} className="text-neutral-500" />
                            )}
                          </div>
                          <div className="text-sm font-medium">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-primary-100 text-primary-700' 
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {translations.roles[user.role][language]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                            className="p-1 rounded-full hover:bg-neutral-100"
                            title={translations.actions.edit[language]}
                          >
                            <Edit size={18} className="text-primary-500" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            
                            title={translations.actions.delete[language]}
                            disabled={user.role === 'admin'} // Prevent deleting admins
                            className={`p-1 rounded-full ${user.role === 'admin' ? 'text-neutral-300 cursor-not-allowed' : 'hover:bg-neutral-100 text-error-500'}`}
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="relative group">
                            <button 
                              className="p-1 rounded-full hover:bg-neutral-100"
                            >
                              <MoreHorizontal size={18} className="text-neutral-500" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                              <div className="py-1">
                                <button
                                  onClick={() => {/* Handle password reset */}}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-neutral-100 w-full text-left"
                                >
                                  <UserCheck size={16} className="mr-2" />
                                  {translations.actions.resetPassword[language]}
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
                    <td colSpan="4" className="px-6 py-8 text-center text-neutral-500">
                      {searchTerm ? translations.noMatches[language] : translations.noUsers[language]}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Table footer with pagination */}
          <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center">
            <div className="text-sm text-neutral-500">
              {translations.showing[language]} <span className="font-medium">{sortedUsers.length}</span> {translations.of[language]} <span className="font-medium">{users.length}</span> {translations.users[language]}
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