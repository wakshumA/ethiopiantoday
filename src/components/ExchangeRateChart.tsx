'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface ChartDataPoint {
  timestamp: number;
  USD: number;
  EUR: number;
  GBP: number;
}

export default function ExchangeRateChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [timeRange, setTimeRange] = useState<'24h' | '12h' | '6h'>('24h');

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        const response = await fetch('/api/rates/historical');
        const result = await response.json();
        
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistoricalData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchHistoricalData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter data based on time range
  const filteredData = data.filter((item) => {
    const now = Date.now();
    const diff = now - item.timestamp;
    
    switch (timeRange) {
      case '6h':
        return diff <= 6 * 60 * 60 * 1000;
      case '12h':
        return diff <= 12 * 60 * 60 * 1000;
      case '24h':
      default:
        return diff <= 24 * 60 * 60 * 1000;
    }
  });

  // Calculate price change
  const getChange = () => {
    if (filteredData.length < 2) return { value: 0, percentage: 0 };
    
    const latest = filteredData[filteredData.length - 1][selectedCurrency];
    const earliest = filteredData[0][selectedCurrency];
    const change = latest - earliest;
    const percentage = (change / earliest) * 100;
    
    return { value: change, percentage };
  };

  const change = getChange();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 skeleton-loading rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 skeleton-loading rounded mb-4"></div>
          <div className="flex gap-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 skeleton-loading rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 skeleton-loading rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 skeleton-loading rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-teal-50/50 to-cyan-50/50 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] ring-1 ring-teal-200/30 dark:ring-slate-700/50 p-6 transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-3 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 bg-blue-500 rounded-full glow-pulse"></span>
            <span>Exchange Rate Movement</span>
          </h2>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 animate-fade-in-scale whitespace-nowrap ${
            change.value >= 0 
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {change.value >= 0 ? '+' : ''}{change.value.toFixed(2)} ({change.percentage.toFixed(2)}%)
          </span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tabular-nums value-transition animate-fade-in-scale">
          {filteredData[filteredData.length - 1]?.[selectedCurrency].toFixed(2) || '—'} ETB
        </div>

        <div className="flex flex-col xs:flex-row gap-2 w-full">
          {/* Currency Selector */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5 ring-1 ring-slate-200/50 dark:ring-slate-600/50">
            {(['USD', 'EUR', 'GBP'] as const).map((currency) => (
              <button
                key={currency}
                onClick={() => setSelectedCurrency(currency)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedCurrency === currency
                    ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                }`}
              >
                {currency}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-0.5 ring-1 ring-slate-200/50 dark:ring-slate-600/50">
            {(['6h', '12h', '24h'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 py-1 rounded text-xs font-semibold transition-all duration-300 transform hover:scale-105 ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-24 sm:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => format(new Date(timestamp), 'HH:mm')}
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelFormatter={(timestamp) => format(new Date(timestamp as number), 'MMM d, HH:mm')}
              formatter={(value: number) => [`${value.toFixed(2)} ETB`, selectedCurrency]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={selectedCurrency}
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name={`${selectedCurrency}/ETB`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Current</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {filteredData[filteredData.length - 1]?.[selectedCurrency].toFixed(2) || '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">High</p>
          <p className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400">
            {Math.max(...filteredData.map(d => d[selectedCurrency])).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Low</p>
          <p className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400">
            {Math.min(...filteredData.map(d => d[selectedCurrency])).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Data Points</p>
          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {filteredData.length}
          </p>
        </div>
      </div>
    </div>
  );
}
