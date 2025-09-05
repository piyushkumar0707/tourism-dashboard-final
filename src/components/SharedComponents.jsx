// Reusable UI components
import React from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import L from 'leaflet';

// ==============================================
// SHARED UI COMPONENTS FOR GUARDIAN EAGLE
// ==============================================

// Loading Spinner Component
export const LoadingSpinner = ({ size = "large", message = "Loading..." }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-16 w-16", 
    large: "h-32 w-32"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
};

// Circular Progress Bar Component
export const CircularProgress = ({ 
  score, 
  size = 120, 
  strokeWidth = 8,
  showLabel = true,
  label = "Safety Score"
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const getTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${getTextColor(score)}`}>{score}</div>
          {showLabel && (
            <div className="text-sm text-gray-600">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, size = "medium" }) => {
  const getStatusConfig = (status) => {
    const configs = {
      safe: { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅', label: 'Safe' },
      caution: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⚠️', label: 'Caution' },
      danger: { color: 'bg-red-100 text-red-800 border-red-200', icon: '🚨', label: 'Danger' },
      verified: { color: 'bg-green-100 text-green-800 border-green-200', icon: '✅', label: 'Verified' },
      unverified: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌', label: 'Unverified' },
      active: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🟢', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: '⚫', label: 'Inactive' }
    };
    return configs[status] || configs.safe;
  };

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses[size]}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Alert Card Component
export const AlertCard = ({ 
  alert, 
  onActionClick = null,
  actionLabel = "Take Action",
  showTimestamp = true,
  darkMode = false 
}) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      critical: { 
        color: 'border-red-500 bg-red-50 text-red-800', 
        darkColor: 'border-red-400 bg-red-900 bg-opacity-20 text-red-300',
        icon: '🚨' 
      },
      high: { 
        color: 'border-orange-500 bg-orange-50 text-orange-800', 
        darkColor: 'border-orange-400 bg-orange-900 bg-opacity-20 text-orange-300',
        icon: '⚠️' 
      },
      medium: { 
        color: 'border-yellow-500 bg-yellow-50 text-yellow-800', 
        darkColor: 'border-yellow-400 bg-yellow-900 bg-opacity-20 text-yellow-300',
        icon: '⚠️' 
      },
      low: { 
        color: 'border-blue-500 bg-blue-50 text-blue-800', 
        darkColor: 'border-blue-400 bg-blue-900 bg-opacity-20 text-blue-300',
        icon: 'ℹ️' 
      }
    };
    return configs[severity] || configs.low;
  };

  const getTypeIcon = (type) => {
    const icons = {
      emergency: '🚨',
      location: '📍',
      weather: '🌧️',
      security: '🔒',
      health: '🏥',
      default: '⚠️'
    };
    return icons[type] || icons.default;
  };

  const config = getSeverityConfig(alert.severity);
  const colorClass = darkMode ? config.darkColor : config.color;

  return (
    <div className={`border-l-4 p-4 rounded-lg ${colorClass} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{getTypeIcon(alert.type)}</span>
            <h4 className="font-semibold">{alert.title || 'Alert'}</h4>
            <span className="ml-2 text-xs px-2 py-1 rounded-full bg-black bg-opacity-10">
              {alert.severity?.toUpperCase()}
            </span>
          </div>
          <p className="text-sm mb-2 opacity-90">{alert.message}</p>
          {showTimestamp && (
            <div className="flex items-center text-xs opacity-75 space-x-3">
              {alert.touristName && <span>Tourist: {alert.touristName}</span>}
              {alert.timestamp && <span>{new Date(alert.timestamp).toLocaleString()}</span>}
              {alert.location && <span>📍 Location: {alert.location.join(', ')}</span>}
            </div>
          )}
        </div>
        {onActionClick && (
          <button
            onClick={() => onActionClick(alert)}
            className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

// Statistics Card Component  
export const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = "blue", 
  trend = null,
  subtitle = null,
  darkMode = false,
  loading = false 
}) => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600', 
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const subtitleClass = darkMode ? 'text-gray-300' : 'text-gray-600';

  if (loading) {
    return (
      <div className={`${bgClass} rounded-lg shadow-lg p-6 animate-pulse`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 bg-gray-300 rounded mb-1"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${subtitleClass} mb-1`}>{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
          {subtitle && (
            <p className={`text-sm ${subtitleClass} mt-1`}>{subtitle}</p>
          )}
          {trend !== null && (
            <p className={`text-sm flex items-center mt-1 ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              <span className="mr-1">
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}
              </span>
              {trend !== 0 ? `${Math.abs(trend)}% from last week` : 'No change'}
            </p>
          )}
        </div>
        <div className={`text-4xl ${colorClasses[color]} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};

// Map Component with custom markers
export const MapComponent = ({ 
  center = [40.7128, -74.0060], 
  zoom = 13,
  height = "400px",
  markers = [],
  polygons = [],
  showHeatmap = false,
  heatmapData = [],
  className = ""
}) => {
  // Custom marker icons
  const markerIcons = {
    safe: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [20, 32], iconAnchor: [10, 32], popupAnchor: [1, -27], shadowSize: [32, 32]
    }),
    caution: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [20, 32], iconAnchor: [10, 32], popupAnchor: [1, -27], shadowSize: [32, 32]
    }),
    danger: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [20, 32], iconAnchor: [10, 32], popupAnchor: [1, -27], shadowSize: [32, 32]
    }),
    tourist: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [20, 32], iconAnchor: [10, 32], popupAnchor: [1, -27], shadowSize: [32, 32]
    })
  };

  return (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id || index}
            position={marker.position}
            icon={markerIcons[marker.type] || markerIcons.safe}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-bold">{marker.title}</h4>
                {marker.description && <p className="text-sm">{marker.description}</p>}
                {marker.status && (
                  <p>Status: <StatusBadge status={marker.status} size="small" /></p>
                )}
                {marker.details && (
                  <div className="mt-2 text-xs text-gray-600">
                    {Object.entries(marker.details).map(([key, value]) => (
                      <p key={key}>{key}: {value}</p>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Polygons for risk areas */}
        {polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.coordinates}
            color={polygon.color || (polygon.riskLevel === 'high' ? 'red' : 'orange')}
            fillOpacity={polygon.fillOpacity || 0.3}
          >
            <Popup>
              <div>
                <h4 className="font-bold">{polygon.name}</h4>
                <p>Risk Level: {polygon.riskLevel}</p>
                {polygon.description && <p className="text-sm">{polygon.description}</p>}
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
};

// Search Bar Component
export const SearchBar = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "Search...",
  loading = false,
  darkMode = false,
  className = ""
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const inputClass = darkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
    : 'bg-white border-gray-300 text-gray-900';

  return (
    <div className={`flex gap-4 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        className={`flex-1 px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
      />
      {onSubmit && (
        <button
          onClick={() => onSubmit(value)}
          disabled={loading || !value.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Search'
          )}
        </button>
      )}
    </div>
  );
};

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "medium",
  darkMode = false 
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg', 
    large: 'max-w-4xl',
    full: 'max-w-screen-lg'
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className={`relative ${bgClass} rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 transform transition-all`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${textClass}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Data Table Component
export const DataTable = ({ 
  data = [], 
  columns = [], 
  loading = false,
  onRowClick = null,
  darkMode = false,
  className = ""
}) => {
  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (loading) {
    return (
      <div className={`${bgClass} rounded-lg shadow overflow-hidden ${className}`}>
        <div className="animate-pulse">
          <div className={`h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-16 border-t ${borderClass} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center h-full px-6 space-x-4">
                {columns.map((_, j) => (
                  <div key={j} className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded flex-1`}></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${borderClass}`}>
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`${onRowClick ? 'cursor-pointer' : ''} ${hoverClass} transition-colors`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={`px-6 py-4 whitespace-nowrap text-sm ${textClass}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
};

// Export all components as default
export default {
  LoadingSpinner,
  CircularProgress,
  StatusBadge,
  AlertCard,
  StatsCard,
  MapComponent,
  SearchBar,
  Modal,
  DataTable
};
