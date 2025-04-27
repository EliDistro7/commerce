'use client';

// File: pages/admin/reports/sales-over-time.jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LineChartComponent from '@/components/LineChartComponent';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  LineChart, 
  CalendarDays, 
  Download, 
  ChevronLeft, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import DateRangePicker from '@/components/admin/DateRangePicker';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// Translations
const translations = {
  en: {
    salesOverTime: "Sales Over Time",
    backToReports: "Back to Reports",
    dateRange: "Date Range",
    exportReport: "Export Report",
    loadingText: "Loading sales data...",
    errorText: "Failed to load sales data. Please try again later.",
    timeGranularity: "Time Granularity",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    annually: "Annually",
    totalSales: "Total Sales",
    averageOrderValue: "Average Order Value",
    numberOfOrders: "Number of Orders",
    period: "Period",
    amount: "Amount",
    noData: "No sales data available for the selected period",
    compared: "compared to previous period"
  },
  sw: {
    salesOverTime: "Mauzo kwa Muda",
    backToReports: "Rudi kwenye Ripoti",
    dateRange: "Kipindi cha Tarehe",
    exportReport: "Hamisha Ripoti",
    loadingText: "Inapakia data za mauzo...",
    errorText: "Imeshindwa kupakia data za mauzo. Tafadhali jaribu tena baadaye.",
    timeGranularity: "Mgawanyiko wa Muda",
    daily: "Kila Siku",
    weekly: "Kila Wiki",
    monthly: "Kila Mwezi",
    quarterly: "Kila Robo Mwaka",
    annually: "Kila Mwaka",
    totalSales: "Jumla ya Mauzo",
    averageOrderValue: "Wastani wa Thamani ya Agizo",
    numberOfOrders: "Idadi ya Oda",
    period: "Kipindi",
    amount: "Kiasi",
    noData: "Hakuna data ya mauzo inayopatikana kwa kipindi kilichochaguliwa",
    compared: "ikilinganishwa na kipindi kilichopita"
  }
};

// API call to fetch sales data
const fetchSalesData = async (dateRange, granularity = 'daily') => {
  try {
    const { startDate, endDate } = dateRange;
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/reports/sales-over-time`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        granularity
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw error;
  }
};

export default function SalesOverTimeReport() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [granularity, setGranularity] = useState('daily');
  const [salesData, setSalesData] = useState({
    timePoints: [],
    values: [],
    metrics: {
      totalSales: 0,
      averageOrderValue: 0,
      numberOfOrders: 0,
      totalSalesChange: 0,
      averageOrderValueChange: 0,
      numberOfOrdersChange: 0
    }
  });

  // Parse URL parameters for date range
  useEffect(() => {
    // Check for both 'start' and 'end' params to prevent partial updates
    if (searchParams.has('start') && searchParams.has('end')) {
      try {
        const startDateParam = searchParams.get('start');
        const endDateParam = searchParams.get('end');
        
        // Validate that these are actual dates
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
        const data = await fetchSalesData(dateRange, granularity);
        setSalesData(data);
        setError(null);
      } catch (error) {
        console.error("Error loading sales data:", error);
        setError(t.errorText);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [dateRange, granularity, t.errorText]);

  // Handle date range change
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
    
    // Update URL with new date range
    const params = new URLSearchParams();
    params.set('start', newDateRange.startDate.toISOString());
    params.set('end', newDateRange.endDate.toISOString());
    
    // Use the router to update the URL without refreshing the page
    router.push(`/admin/reports/sales-over-time?${params.toString()}`);
  };

  // Handle export report
  const handleExportReport = () => {
    // Implementation for exporting the report
    console.log("Exporting report for dates:", dateRange);
    // Additional export logic would go here
  };

  // Generate chart data points
  const chartData = {
    labels: salesData.timePoints,
    datasets: [
      {
        label: t.totalSales,
        data: salesData.values,
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
              <LineChart size={24} className="mr-2 text-primary-500" />
              {t.salesOverTime}
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
        
        {/* Time Granularity Selector */}
        <div className="bg-white p-4 rounded-lg shadow-soft">
          <div className="mb-4">
            <label className="text-sm font-medium text-neutral-700 mb-2 block">{t.timeGranularity}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'daily', label: t.daily },
                { id: 'weekly', label: t.weekly },
                { id: 'monthly', label: t.monthly },
                { id: 'quarterly', label: t.quarterly },
                { id: 'annually', label: t.annually }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGranularity(option.id)}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    granularity === option.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Sales */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-neutral-600 text-sm">{t.totalSales}</h3>
                <div className={`flex items-center text-xs ${
                  salesData.metrics.totalSalesChange >= 0 
                    ? 'text-success-500'
                    : 'text-error-500'
                }`}>
                  {salesData.metrics.totalSalesChange >= 0 ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : (
                    <ArrowDown size={12} className="mr-1" />
                  )}
                  <span>{Math.abs(salesData.metrics.totalSalesChange)}% {t.compared}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{formatCurrency(salesData.metrics.totalSales)}</p>
            </div>
            
            {/* Average Order Value */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-neutral-600 text-sm">{t.averageOrderValue}</h3>
                <div className={`flex items-center text-xs ${
                  salesData.metrics.averageOrderValueChange >= 0 
                    ? 'text-success-500'
                    : 'text-error-500'
                }`}>
                  {salesData.metrics.averageOrderValueChange >= 0 ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : (
                    <ArrowDown size={12} className="mr-1" />
                  )}
                  <span>{Math.abs(salesData.metrics.averageOrderValueChange)}% {t.compared}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{formatCurrency(salesData.metrics.averageOrderValue)}</p>
            </div>
            
            {/* Number of Orders */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-neutral-600 text-sm">{t.numberOfOrders}</h3>
                <div className={`flex items-center text-xs ${
                  salesData.metrics.numberOfOrdersChange >= 0 
                    ? 'text-success-500'
                    : 'text-error-500'
                }`}>
                  {salesData.metrics.numberOfOrdersChange >= 0 ? (
                    <ArrowUp size={12} className="mr-1" />
                  ) : (
                    <ArrowDown size={12} className="mr-1" />
                  )}
                  <span>{Math.abs(salesData.metrics.numberOfOrdersChange)}% {t.compared}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{salesData.metrics.numberOfOrders}</p>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-96 relative">
            {error ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-error-50 text-error-700 p-4 rounded-lg flex items-center">
                  <AlertTriangle size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            ) : salesData.timePoints.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                <p>{t.noData}</p>
              </div>
            ) : (
              <LineChartComponent data={chartData} />
            )}
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white p-4 rounded-lg shadow-soft overflow-hidden">
          <h3 className="text-lg font-bold mb-4">{t.salesOverTime} - {t[granularity]}</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.period}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.amount}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.numberOfOrders}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    {t.averageOrderValue}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-100">
                {salesData.timePoints.length > 0 ? (
                  salesData.timePoints.map((time, index) => (
                    <tr key={time} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900">
                        {time}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">
                        {formatCurrency(salesData.values[index])}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">
                        {Math.round(salesData.values[index] / salesData.metrics.averageOrderValue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 text-right">
                        {formatCurrency(salesData.metrics.averageOrderValue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-6 text-center text-neutral-500">
                      {t.noData}
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


