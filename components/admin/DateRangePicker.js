// File: components/admin/DateRangePicker.jsx
import { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

// Translations for date range picker
const translations = {
  en: {
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
    last7Days: "Last 7 Days",
    last30Days: "Last 30 Days",
    last90Days: "Last 90 Days",
    custom: "Custom Range",
    apply: "Apply",
    cancel: "Cancel",
    startDate: "Start Date",
    endDate: "End Date"
  },
  sw: {
    today: "Leo",
    yesterday: "Jana",
    thisWeek: "Wiki Hii",
    lastWeek: "Wiki Iliyopita",
    thisMonth: "Mwezi Huu",
    lastMonth: "Mwezi Uliopita",
    last7Days: "Siku 7 Zilizopita",
    last30Days: "Siku 30 Zilizopita",
    last90Days: "Siku 90 Zilizopita",
    custom: "Kipindi Maalum",
    apply: "Tumia",
    cancel: "Ghairi",
    startDate: "Tarehe ya Kuanza",
    endDate: "Tarehe ya Mwisho"
  }
};

export default function DateRangePicker({ startDate, endDate, onChange, language }) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [selectedPreset, setSelectedPreset] = useState('last30Days');
  const dropdownRef = useRef(null);
  
  const t = translations[language] || translations.en;

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString(language === 'sw' ? 'sw-TZ' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get range display text
  const getRangeText = () => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Date range presets
  const presets = [
    { id: 'today', label: t.today, getRange: () => {
      const today = new Date();
      return { startDate: today, endDate: today };
    }},
    { id: 'yesterday', label: t.yesterday, getRange: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: yesterday, endDate: yesterday };
    }},
    { id: 'thisWeek', label: t.thisWeek, getRange: () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return { startDate: startOfWeek, endDate: now };
    }},
    { id: 'lastWeek', label: t.lastWeek, getRange: () => {
      const now = new Date();
      const endOfLastWeek = new Date(now);
      endOfLastWeek.setDate(now.getDate() - now.getDay() - 1);
      const startOfLastWeek = new Date(endOfLastWeek);
      startOfLastWeek.setDate(endOfLastWeek.getDate() - 6);
      return { startDate: startOfLastWeek, endDate: endOfLastWeek };
    }},
    { id: 'thisMonth', label: t.thisMonth, getRange: () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: startOfMonth, endDate: now };
    }},
    { id: 'lastMonth', label: t.lastMonth, getRange: () => {
      const now = new Date();
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { startDate: startOfLastMonth, endDate: endOfLastMonth };
    }},
    { id: 'last7Days', label: t.last7Days, getRange: () => {
      const now = new Date();
      const last7Days = new Date(now);
      last7Days.setDate(now.getDate() - 6);
      return { startDate: last7Days, endDate: now };
    }},
    { id: 'last30Days', label: t.last30Days, getRange: () => {
      const now = new Date();
      const last30Days = new Date(now);
      last30Days.setDate(now.getDate() - 29);
      return { startDate: last30Days, endDate: now };
    }},
    { id: 'last90Days', label: t.last90Days, getRange: () => {
      const now = new Date();
      const last90Days = new Date(now);
      last90Days.setDate(now.getDate() - 89);
      return { startDate: last90Days, endDate: now };
    }},
    { id: 'custom', label: t.custom, getRange: () => {
      return { startDate: localStartDate, endDate: localEndDate };
    }}
  ];

  // Apply preset
  const applyPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      const range = preset.getRange();
      setLocalStartDate(range.startDate);
      setLocalEndDate(range.endDate);
      
      if (presetId !== 'custom') {
        onChange(range);
        setIsOpen(false);
      }
      
      setSelectedPreset(presetId);
    }
  };

  // Apply custom range
  const applyCustomRange = () => {
    onChange({ startDate: localStartDate, endDate: localEndDate });
    setIsOpen(false);
  };

  // Handle date input change
  const handleDateChange = (e, isStart) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      if (isStart) {
        setLocalStartDate(date);
      } else {
        setLocalEndDate(date);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-white border border-neutral-200 rounded-md px-3 py-2 text-sm"
      >
        <Calendar size={16} className="mr-2 text-neutral-500" />
        <span>{getRangeText()}</span>
        <ChevronDown size={16} className="ml-2 text-neutral-500" />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 w-72 right-0">
          <div className="p-3 border-b border-neutral-200">
            <div className="grid grid-cols-2 gap-2">
              {presets.slice(0, 8).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`text-sm px-3 py-2 rounded-md transition-colors ${
                    selectedPreset === preset.id
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-3">
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.startDate}</label>
              <input
                type="date"
                value={localStartDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, true)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-1">{t.endDate}</label>
              <input
                type="date"
                value={localEndDate.toISOString().split('T')[0]}
                onChange={(e) => handleDateChange(e, false)}
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                min={localStartDate.toISOString().split('T')[0]}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-md"
              >
                {t.cancel}
              </button>
              <button
                onClick={applyCustomRange}
                className="px-3 py-2 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}