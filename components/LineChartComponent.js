import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
 export default function LineChartComponent({ data }) {
    console.log('data', data)
  const [chartData, setChartData] = useState([]);
  const [trend, setTrend] = useState({ direction: 'up', percentage: 0 });

  useEffect(() => {
    // Transform the data for Recharts
    if (data && data.labels && data.datasets && data.datasets[0] && data.datasets[0].data) {
      const transformedData = data.labels.map((label, index) => ({
        date: label,
        value: data.datasets[0].data[index] || 0
      }));
      
      setChartData(transformedData);
      
      // Calculate trend if there are at least 2 data points
      if (transformedData.length >= 2) {
        const first = transformedData[0].value;
        const last = transformedData[transformedData.length - 1].value;
        const direction = last >= first ? 'up' : 'down';
        let percentage = 0;
        if (first > 0) {
          percentage = Math.round(((last - first) / first) * 100);
        }
        setTrend({ direction, percentage: Math.abs(percentage) });
      }
    } else {
      setChartData([]);
    }
  }, [data]);

  // Check if we have valid data to work with
  const hasValidData = chartData.length > 0 && chartData.some(item => item.value > 0);

  if (!hasValidData) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500 border rounded">
        <AlertCircle className="mr-2" size={20} />
        <span>No valid data available for chart</span>
      </div>
    );
  }

  const title = data.datasets?.[0]?.label || "Sales Data";
  const chartColor = "#3B82F6";

  return (
    <div className="w-full">
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <TrendingUp className="text-blue-500 mr-2" size={20} />
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <div className="flex items-center">
          <Calendar className="text-gray-400 mr-2" size={16} />
          <span className="text-sm text-gray-500">
            {chartData.length > 0 && 
              `${new Date(chartData[0].date).toLocaleDateString()} - 
               ${new Date(chartData[chartData.length-1].date).toLocaleDateString()}`
            }
          </span>
        </div>
      </div>
      
      {trend.percentage > 0 && (
        <div className="flex items-center mb-2">
          <DollarSign className="text-gray-500 mr-1" size={14} />
          <span className="text-sm mr-2">Trend:</span>
          <div className={`flex items-center ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend.direction === 'up' ? 
              <ArrowUpRight size={16} /> : 
              <ArrowDownRight size={16} />
            }
            <span className="ml-1 text-sm font-medium">{trend.percentage}%</span>
          </div>
        </div>
      )}
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                } catch (e) {
                  return value;
                }
              }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={40}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, title]}
              labelFormatter={(label) => {
                try {
                  const date = new Date(label);
                  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                } catch (e) {
                  return label;
                }
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
              fill="url(#colorSales)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}