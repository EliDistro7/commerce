'use client';

// File: pages/admin/reports/top-selling-products.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LineChartComponent from '@/components/LineChartComponent';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  BarChart, 
  CalendarDays, 
  Download, 
  ChevronLeft, 
  AlertTriangle, 
  ShoppingBag,
  Loader2,
  Search
} from 'lucide-react';
import Link from 'next/link';
import DateRangePicker from '@/components/admin/DateRangePicker';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

// Translations
const translations = {
  en: {
    topSellingProducts: "Top Selling Products",
    backToReports: "Back to Reports",
    dateRange: "Date Range",
    exportReport: "Export Report",
    loadingText: "Loading product data...",
    errorText: "Failed to load product data. Please try again later.",
    limitResults: "Limit Results",
    product: "Product",
    category: "Category",
    quantitySold: "Quantity Sold",
    revenue: "Revenue",
    percentageOfSales: "% of Sales",
    noData: "No product sales data available for the selected period",
    searchProducts: "Search products",
    unitsSold: "Units Sold",
    topProducts: "Top Products by Sales Volume",
    productImage: "Product Image",
    productName: "Product Name",
    price: "Price",
    totalSales: "Total Sales:"
  },
  sw: {
    topSellingProducts: "Bidhaa Zinazouza Zaidi",
    backToReports: "Rudi kwenye Ripoti",
    dateRange: "Kipindi cha Tarehe",
    exportReport: "Hamisha Ripoti",
    loadingText: "Inapakia data za bidhaa...",
    errorText: "Imeshindwa kupakia data za bidhaa. Tafadhali jaribu tena baadaye.",
    limitResults: "Idadi ya Matokeo",
    product: "Bidhaa",
    category: "Kategoria",
    quantitySold: "Idadi Iliyouzwa",
    revenue: "Mapato",
    percentageOfSales: "% ya Mauzo",
    noData: "Hakuna data ya mauzo ya bidhaa inayopatikana kwa kipindi kilichochaguliwa",
    searchProducts: "Tafuta bidhaa",
    unitsSold: "Vilivyouzwa",
    topProducts: "Bidhaa Bora kwa Kiasi cha Mauzo",
    productImage: "Picha ya Bidhaa",
    productName: "Jina la Bidhaa",
    price: "Bei",
    totalSales: "Jumla ya Mauzo:"
  }
};

// API call to fetch top selling products data
const fetchTopProductsData = async (dateRange, limit = 10) => {
  try {
    const { startDate, endDate } = dateRange;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/reports/top-selling-products`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top products data:", error);
    throw error;
  }
};

export default function TopSellingProductsReport() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [productsData, setProductsData] = useState({
    products: [],
    totalProducts: 0,
    totalSales: 0,
    chartData: {
      labels: [],
      datasets: []
    }
  });

  // Parse URL parameters for date range
  useEffect(() => {
    if (searchParams.has('start') && searchParams.has('end')) {
      try {
        const startDateParam = searchParams.get('start');
        const endDateParam = searchParams.get('end');
        
        const startDate = new Date(startDateParam);
        const endDate = new Date(endDateParam);
        
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          setDateRange({
            startDate,
            endDate
          });
        } else {
          console.error("Invalid date parameters in URL");
        }
      } catch (error) {
        console.error("Error parsing date parameters:", error);
      }
    }
    
    if (searchParams.has('limit')) {
      const limitParam = parseInt(searchParams.get('limit'), 10);
      if (!isNaN(limitParam) && limitParam > 0) {
        setLimit(limitParam);
      }
    }
  }, [searchParams]);

  // Get initial date range from URL params or default to last 30 days
  const initialStartDate = searchParams.get('start')
    ? new Date(searchParams.get('start'))
    : new Date(new Date().setDate(new Date().getDate() - 30));
  
  const initialEndDate = searchParams.get('end')
    ? new Date(searchParams.get('end'))
    : new Date();

  const [dateRange, setDateRange] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === 'sw' ? 'sw-TZ' : 'en-US', {
      style: 'currency',
      currency: 'TZS'
    }).format(amount);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTopProductsData(dateRange, limit);
        setProductsData(data);
        setError(null);
      } catch (error) {
        console.error("Error loading top products data:", error);
        setError(t.errorText);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dateRange, limit, t.errorText]);

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    
    // Update URL with new date range
    const params = new URLSearchParams(searchParams);
    params.set('start', newDateRange.startDate.toISOString());
    params.set('end', newDateRange.endDate.toISOString());
    
    router.push(`/admin/reports/top-selling-products?${params.toString()}`);
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    
    // Update URL with new limit
    const params = new URLSearchParams(searchParams);
    params.set('limit', newLimit.toString());
    
    router.push(`/admin/reports/top-selling-products?${params.toString()}`);
  };

  // Handle export report
  const handleExportReport = () => {
    console.log("Exporting top products report for dates:", dateRange);
    // Implementation for exporting the report would go here
  };

  // Filter products based on search term
  const filteredProducts = productsData.products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare chart data
  const chartData = {
    labels: productsData.chartData.labels,
    datasets: [
      {
        label: t.unitsSold,
        data: productsData.chartData.datasets?.[0]?.data || [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      }
    ]
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 size={24} className="animate-spin text-primary-500 mr-2" />
          <div className="text-primary-500">{t.loadingText}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link href="/admin/reports" className="inline-flex items-center text-neutral-500 hover:text-primary-500 mb-2">
              <ChevronLeft size={16} className="mr-1" />
              <span className="text-sm">{t.backToReports}</span>
            </Link>
            <h2 className="text-2xl font-heading font-bold text-black flex items-center">
              <BarChart size={24} className="mr-2 text-primary-500" />
              {t.topSellingProducts}
            </h2>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">{t.dateRange}:</span>
            <DateRangePicker 
              startDate={dateRange.startDate}
              endDate={dateRange.endDate} 
              onChange={handleDateRangeChange}
              language={language}
            />
            
            <button 
              className="ml-3 flex items-center space-x-1 bg-neutral-100 text-neutral-700 px-3 py-2 rounded-md text-sm hover:bg-neutral-200 transition-colors"
              onClick={handleExportReport}
            >
              <Download size={16} />
              <span>{t.exportReport}</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white p-4 rounded-lg shadow-soft">
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={t.searchProducts}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
            
            <div className="flex items-center">
              <span className="text-sm text-neutral-600 mr-2">{t.limitResults}:</span>
              <div className="flex space-x-2">
                {[5, 10, 20, 50].map(val => (
                  <button
                    key={val}
                    onClick={() => handleLimitChange(val)}
                    className={`px-3 py-1 text-sm rounded ${
                      limit === val 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="text-primary-500 mr-2" size={20} />
                <h3 className="font-medium">{t.totalSales} {formatCurrency(productsData.totalSales)}</h3>
              </div>
              <div className="text-sm text-neutral-500">
                <CalendarDays className="inline mr-1" size={14} />
                {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-72 mb-6">
            {error ? (
              <div className="h-full flex items-center justify-center">
                <div className="bg-error-50 text-error-700 p-4 rounded-lg flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            ) : productsData.products.length === 0 ? (
              <div className="h-full flex items-center justify-center text-neutral-500">
                <p>{t.noData}</p>
              </div>
            ) : (
              <LineChartComponent data={chartData} />
            )}
          </div>
          
          {/* Products Table */}
          <h3 className="text-lg font-bold mb-4">{t.topProducts}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.product}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.category}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.price}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.quantitySold}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.revenue}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.percentageOfSales}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3 bg-neutral-100 rounded-md overflow-hidden">
                            {product.mainImage ? (
                              <Image 
                                src={`/${product.mainImage}`} 
                                alt={product.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-neutral-400">
                                <ShoppingBag size={16} />
                              </div>
                            )}
                          </div>
                          <div className="text-sm font-medium text-neutral-900">{product.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                        {product.categoryName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">
                        {product.quantitySold}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          <div className="w-16 bg-neutral-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${product.percentageOfSales}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-700">{product.percentageOfSales}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-neutral-500">
                      {searchTerm ? "No matching products found" : t.noData}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}