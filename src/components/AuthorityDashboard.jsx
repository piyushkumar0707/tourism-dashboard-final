// Authority interface
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useWebSocket } from '../hooks/useWebSocket';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different tourist statuses
const safeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -27],
  shadowSize: [32, 32]
});

const cautionIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -27],
  shadowSize: [32, 32]
});

const dangerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -27],
  shadowSize: [32, 32]
});

// Statistics Card Component
const StatsCard = ({ title, value, icon, color = "blue", trend = null }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <span className="mr-1">{trend > 0 ? '↗' : '↘'}</span>
              {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`text-4xl text-${color}-500`}>{icon}</div>
      </div>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ alert, onGenerateReport, darkMode = false }) => {
  const getSeverityColor = (severity) => {
    const configs = {
      critical: darkMode 
        ? 'border-red-400 bg-red-900 bg-opacity-20 text-red-300'
        : 'border-red-500 bg-red-50 text-red-800',
      high: darkMode
        ? 'border-orange-400 bg-orange-900 bg-opacity-20 text-orange-300'
        : 'border-orange-500 bg-orange-50 text-orange-800',
      medium: darkMode
        ? 'border-yellow-400 bg-yellow-900 bg-opacity-20 text-yellow-300'
        : 'border-yellow-500 bg-yellow-50 text-yellow-800',
      low: darkMode
        ? 'border-blue-400 bg-blue-900 bg-opacity-20 text-blue-300'
        : 'border-blue-500 bg-blue-50 text-blue-800'
    };
    return configs[severity] || configs.low;
  };

  return (
    <div className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">
              {alert.type === 'emergency' ? '🚨' : 
               alert.type === 'location' ? '📍' : 
               alert.type === 'weather' ? '🌧️' : '⚠️'}
            </span>
            <h4 className="font-semibold">{alert.title}</h4>
          </div>
          <p className="text-sm mb-2">{alert.message}</p>
          <div className="flex items-center text-xs opacity-75">
            <span className="mr-3">Tourist: {alert.touristName}</span>
            <span>{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => onGenerateReport(alert.id)}
          className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

// Sidebar Navigation
const Sidebar = ({ activeSection, setActiveSection, darkMode, setDarkMode, isMobile, isOpen, setIsOpen, onLogout }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Live Map', icon: '🗺️' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'tourists', label: 'Tourist Search', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📄' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg h-full transition-all duration-300 ease-in-out z-50
      `}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Authority Dashboard
          </h2>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setIsOpen(false);
              }}
              className={`
                w-full flex items-center px-6 py-3 text-left transition-colors
                ${activeSection === item.id 
                  ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'} border-r-4 border-blue-600` 
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              w-full flex items-center justify-center py-2 px-4 rounded-lg transition-colors
              ${darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <span className="mr-2">{darkMode ? '☀️' : '🌙'}</span>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const AuthorityDashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for dashboard data
  const [stats, setStats] = useState({});
  const [tourists, setTourists] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [riskAreas, setRiskAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // WebSocket for real-time updates
  const { lastMessage } = useWebSocket('ws://localhost:8000/ws/authority');

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      switch (data.type) {
        case 'new_alert':
          setAlerts(prev => [data.payload, ...prev.slice(0, 9)]);
          break;
        case 'tourist_update':
          setTourists(prev => prev.map(t => 
            t.id === data.payload.id ? { ...t, ...data.payload } : t
          ));
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock API calls - replace with actual endpoints
        const mockStats = {
          totalTourists: 1248,
          activeTourists: 892,
          activeAlerts: 7,
          averageSafetyScore: 78,
          trends: {
            tourists: 12,
            alerts: -5,
            safety: 3
          }
        };

        const mockTourists = Array.from({ length: 50 }, (_, i) => ({
          id: `tourist${i + 1}`,
          name: `Tourist ${i + 1}`,
          location: [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1],
          safetyScore: Math.floor(Math.random() * 100),
          status: ['safe', 'caution', 'danger'][Math.floor(Math.random() * 3)],
          lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString()
        }));

        const mockAlerts = [
          {
            id: 1,
            type: 'emergency',
            title: 'Tourist in Distress',
            message: 'Emergency beacon activated in Central Park area',
            touristName: 'John Doe',
            severity: 'critical',
            timestamp: '2024-01-20T10:30:00Z'
          },
          {
            id: 2,
            type: 'location',
            title: 'Restricted Area Entry',
            message: 'Tourist entered construction zone',
            touristName: 'Alice Johnson',
            severity: 'high',
            timestamp: '2024-01-20T10:15:00Z'
          },
          {
            id: 3,
            type: 'weather',
            title: 'Severe Weather Warning',
            message: 'Storm approaching tourist area',
            touristName: 'Multiple tourists',
            severity: 'medium',
            timestamp: '2024-01-20T09:45:00Z'
          }
        ];

        const mockRiskAreas = [
          {
            id: 1,
            name: 'Construction Zone',
            coordinates: [[40.7580, -73.9855], [40.7600, -73.9855], [40.7600, -73.9835], [40.7580, -73.9835]],
            riskLevel: 'high'
          },
          {
            id: 2,
            name: 'High Crime Area',
            coordinates: [[40.7489, -73.9680], [40.7520, -73.9680], [40.7520, -73.9650], [40.7489, -73.9650]],
            riskLevel: 'medium'
          }
        ];

        setStats(mockStats);
        setTourists(mockTourists);
        setAlerts(mockAlerts);
        setRiskAreas(mockRiskAreas);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Search tourists
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = tourists.filter(tourist => 
        tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tourist.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results.length > 0 ? results[0] : null);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Generate E-FIR report
  const handleGenerateReport = async (alertId) => {
    try {
      // Mock report generation
      alert('E-FIR Report generated successfully! Download would start in a real implementation.');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const getMarkerIcon = (status) => {
    switch (status) {
      case 'safe': return safeIcon;
      case 'caution': return cautionIcon;
      case 'danger': return dangerIcon;
      default: return safeIcon;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Tourists"
                value={stats.totalTourists?.toLocaleString()}
                icon="👥"
                color="blue"
                trend={stats.trends?.tourists}
              />
              <StatsCard
                title="Active Tourists"
                value={stats.activeTourists?.toLocaleString()}
                icon="🟢"
                color="green"
              />
              <StatsCard
                title="Active Alerts"
                value={stats.activeAlerts}
                icon="🚨"
                color="red"
                trend={stats.trends?.alerts}
              />
              <StatsCard
                title="Avg Safety Score"
                value={`${stats.averageSafetyScore}%`}
                icon="🛡️"
                color="yellow"
                trend={stats.trends?.safety}
              />
            </div>

            {/* Quick Actions */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveSection('map')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Live Map
                </button>
                <button
                  onClick={() => setActiveSection('alerts')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Check Alerts
                </button>
                <button
                  onClick={() => setActiveSection('reports')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate Reports
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {alert.type === 'emergency' ? '🚨' : 
                           alert.type === 'location' ? '📍' : '⚠️'}
                        </span>
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {alert.title}
                        </span>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Real-time Tourist Locations
              </h3>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[40.7128, -74.0060]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  
                  {/* Tourist markers */}
                  {tourists.map((tourist) => (
                    <Marker
                      key={tourist.id}
                      position={tourist.location}
                      icon={getMarkerIcon(tourist.status)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-bold">{tourist.name}</h4>
                          <p>ID: {tourist.id}</p>
                          <p>Status: <span className={`font-medium ${
                            tourist.status === 'safe' ? 'text-green-600' :
                            tourist.status === 'caution' ? 'text-yellow-600' : 'text-red-600'
                          }`}>{tourist.status}</span></p>
                          <p>Safety Score: {tourist.safetyScore}%</p>
                          <p className="text-xs text-gray-600">
                            Last seen: {new Date(tourist.lastSeen).toLocaleString()}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Risk areas */}
                  {riskAreas.map((area) => (
                    <Polygon
                      key={area.id}
                      positions={area.coordinates}
                      color={area.riskLevel === 'high' ? 'red' : 'orange'}
                      fillOpacity={0.2}
                    >
                      <Popup>
                        <div>
                          <h4 className="font-bold">{area.name}</h4>
                          <p>Risk Level: {area.riskLevel}</p>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Active Alerts ({alerts.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onGenerateReport={handleGenerateReport}
                      darkMode={darkMode}
                    />
                  ))
                ) : (
                  <p className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No active alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'tourists':
        return (
          <div className="space-y-6">
            {/* Search Section */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                Search Tourist
              </h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter tourist name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`
                    flex-1 px-4 py-2 rounded-lg border transition-colors
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Search
                </button>
              </div>

              {searchResults && (
                <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <h4 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {searchResults.name}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">ID:</span> {searchResults.id}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Safety Score:</span> {searchResults.safetyScore}%
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-1 font-medium ${
                          searchResults.status === 'safe' ? 'text-green-600' :
                          searchResults.status === 'caution' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {searchResults.status}
                        </span>
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <span className="font-medium">Last Seen:</span> {new Date(searchResults.lastSeen).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All Tourists List */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                All Tourists ({tourists.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Name</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>ID</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Safety Score</th>
                      <th className={`text-left py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourists.slice(0, 10).map((tourist) => (
                      <tr key={tourist.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <td className={`py-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tourist.name}</td>
                        <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tourist.id}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tourist.status === 'safe' ? 'bg-green-100 text-green-800' :
                            tourist.status === 'caution' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {tourist.status}
                          </span>
                        </td>
                        <td className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tourist.safetyScore}%</td>
                        <td className={`py-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(tourist.lastSeen).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>
                E-FIR Report Generator
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Generate reports for incidents by clicking "Generate Report" on any alert in the Alerts section.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Recent Reports
                  </h4>
                  <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Emergency Report #001
                        </span>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tourist emergency in Central Park
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          Incident Report #002
                        </span>
                        <span className="text-xs text-gray-500">5 hours ago</span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Unauthorized area access
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Report Statistics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Reports Today:</span>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Emergency Reports:</span>
                      <span className="font-bold text-red-600">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Incident Reports:</span>
                      <span className="font-bold text-yellow-600">9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Navbar */}
          <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm p-4 border-b transition-colors`}>
            <div className="flex items-center justify-between">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-md transition-colors ${
                    darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors`}>
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
              <div className="flex items-center space-x-4">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Guardian Eagle Authority Panel
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
