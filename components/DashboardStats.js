import { useLanguage } from '@/context/LanguageContext';
import { CreditCard, ShoppingBag, Users, Package, ArrowUp, ArrowDown } from 'lucide-react';

// Translations object
const translations = {
  en: {
    totalSales: "Total Sales",
    orders: "Orders",
    customers: "Customers",
    products: "Products",
    fromLastMonth: "from last month"
  },
  sw: {
    totalSales: "Mauzo Jumla",
    orders: "Orders",
    customers: "Wateja",
    products: "Bidhaa",
    fromLastMonth: "kutoka mwezi uliopita"
  }
};

// Stats card component to reduce repetition
const StatCard = ({ title, value, icon: Icon, direction, change, isLoading, language }) => {
  // Get the translations based on language
  const t = translations[language] || translations.en;
  
  // Handle loading or empty state
  const displayValue = isLoading ? '—' : (value !== undefined ? value : 0);
  const displayDirection = direction || 'up';
  const displayChange = change !== undefined ? change : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">
            {title === t.totalSales ? `TZS ${isLoading ? '—' : (displayValue).toLocaleString()}` : displayValue}
          </h3>
        </div>
        <div className={`p-3 rounded-full ${displayDirection === 'up' ? 'bg-success-100' : 'bg-error-100'}`}>
          <Icon size={24} className={displayDirection === 'up' ? 'text-success-500' : 'text-error-500'} />
        </div>
      </div>
      <div className="flex items-center mt-4">
        {displayDirection === 'up' ? (
          <ArrowUp size={16} className="text-success-500 mr-1" />
        ) : (
          <ArrowDown size={16} className="text-error-500 mr-1" />
        )}
        <span className={`text-sm ${displayDirection === 'up' ? 'text-success-500' : 'text-error-500'}`}>
          {displayChange}% {t.fromLastMonth}
        </span>
      </div>
    </div>
  );
};

// Dashboard Component
const DashboardStats = ({ dashboardData }) => {
  // Get the language from context
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  // Check if data is available
  const isLoading = !dashboardData || !dashboardData.stats;
  
  // Default data structure for empty state
  const stats = isLoading ? {
    sales: { value: 0, direction: 'up', change: 0 },
    orders: { value: 0, direction: 'up', change: 0 },
    customers: { value: 0, direction: 'up', change: 0 },
    products: { value: 0, direction: 'up', change: 0 }
  } : dashboardData.stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title={t.totalSales} 
        value={stats.sales.value}
        icon={CreditCard}
        direction={stats.sales.direction}
        change={stats.sales.change}
        isLoading={isLoading}
        language={language}
      />
      
      <StatCard 
        title={t.orders} 
        value={stats.orders.value}
        icon={ShoppingBag}
        direction={stats.orders.direction}
        change={stats.orders.change}
        isLoading={isLoading}
        language={language}
      />
      
      <StatCard 
        title={t.customers} 
        value={stats.customers.value}
        icon={Users}
        direction={stats.customers.direction}
        change={stats.customers.change}
        isLoading={isLoading}
        language={language}
      />
      
      <StatCard 
        title={t.products} 
        value={stats.products.value}
        icon={Package}
        direction={stats.products.direction}
        change={stats.products.change}
        isLoading={isLoading}
        language={language}
      />
    </div>
  );
};

export default DashboardStats;