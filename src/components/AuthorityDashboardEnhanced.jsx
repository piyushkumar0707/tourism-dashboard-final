// Enhanced Authority Dashboard with theme support and amazing hover effects
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTheme } from '../context/ThemeContext';

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

// Enhanced Statistics Card Component
const StatsCard = ({ title, value, icon, color = "blue", trend = null, description }) => {
  const getTrendColor = (trend) => {
    if (trend > 0) return '#10b981';
    if (trend < 0) return '#ef4444';
    return '#6b7280';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '➖';
  };

  return (
    <div className="stat-card hover-lift">
      <div className="stat-icon hover-rotate">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {description && (
        <div style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginTop: '0.5rem',
          opacity: 0.8
        }}>
          {description}
        </div>
      )}
      {trend !== null && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: getTrendColor(trend),
          fontWeight: 600
        }}>
          <span style={{marginRight: '0.25rem'}}>{getTrendIcon(trend)}</span>
          {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  );
};

// Enhanced Alert Card Component
const AlertCard = ({ alert, onGenerateReport }) => {
  const getSeverityClass = (severity) => {
    const classes = {
      critical: 'alert-critical',
      high: 'alert-high', 
      medium: 'alert-medium',
      low: 'alert-low'
    };
    return `alert-card ${classes[severity] || classes.low} hover-lift`;
  };

  const getSeverityIcon = (type) => {
    const icons = {
      emergency: '🚨',
      location: '📍',
      weather: '🌧️',
      security: '🔐',
      medical: '🏥'
    };
    return icons[type] || '⚠️';
  };

  return (
    <div className={getSeverityClass(alert.severity)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <span className="hover-bounce" style={{
              fontSize: '1.5rem',
              marginRight: '0.75rem',
              filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
            }}>
              {getSeverityIcon(alert.type)}
            </span>
            <h4 style={{
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontSize: '1.1rem'
            }}>
              {alert.title}
            </h4>
          </div>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '1rem',
            lineHeight: 1.5
          }}>
            {alert.message}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            gap: '1rem'
          }}>
            <span>👤 {alert.touristName}</span>
            <span>📅 {new Date(alert.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => onGenerateReport(alert.id)}
          className="btn btn-primary hover-scale"
          style={{
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            marginLeft: '1rem'
          }}
        >
          📄 Generate Report
        </button>
      </div>
    </div>
  );
};

// Enhanced Sidebar Navigation
const Sidebar = ({ activeSection, setActiveSection, isMobile, isOpen, setIsOpen, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'map', label: 'Live Map', icon: '🗺️' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' },
    { id: 'tourists', label: 'Tourist Search', icon: '👥' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
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
        sidebar
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Authority Dashboard</h2>
          <div style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginTop: '0.5rem',
            textAlign: 'center'
          }}>
            Guardian Eagle Control
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                if (isMobile) setIsOpen(false);
              }}
              className={`
                nav-item hover-slide
                ${activeSection === item.id ? 'active' : ''}
              `}
            >
              <span className="nav-icon hover-scale">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle w-full hover-glow"
          >
            <span className="mr-2">{isDark ? '☀️' : '🌙'}</span>
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn btn-primary btn-full hover-scale"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%)',
              fontSize: '0.9rem',
              padding: '0.75rem 1rem'
            }}
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const AuthorityDashboardEnhanced = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  
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
        
        // Mock data with enhanced stats
        const mockStats = {
          totalTourists: 1248,
          activeTourists: 892,
          activeAlerts: 7,
          averageSafetyScore: 78,
          resolvedIncidents: 145,
          responseTime: '3.2 min',
          trends: {
            tourists: 12,
            alerts: -5,
            safety: 3,
            incidents: -8
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
            title: 'Tourist Emergency Alert',
            message: 'Emergency beacon activated in Central Park area - immediate response required',
            touristName: 'John Doe',
            severity: 'critical',
            timestamp: '2024-01-20T10:30:00Z'
          },
          {
            id: 2,
            type: 'location',
            title: 'Unauthorized Area Access',
            message: 'Tourist entered restricted construction zone without proper clearance',
            touristName: 'Alice Johnson',
            severity: 'high',
            timestamp: '2024-01-20T10:15:00Z'
          },
          {
            id: 3,
            type: 'weather',
            title: 'Severe Weather Alert',
            message: 'Storm system approaching popular tourist areas - evacuation recommended',
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
      alert('E-FIR Report generated successfully! 📄✅\nDownload would start in a real implementation.');
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
        <div className="loading">
          <div className="spinner"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Enhanced Statistics Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem' 
            }}>
              <StatsCard
                title="Total Tourists"
                value={stats.totalTourists?.toLocaleString()}
                icon="👥"
                trend={stats.trends?.tourists}
                description="Registered in system"
              />
              <StatsCard
                title="Active Tourists"
                value={stats.activeTourists?.toLocaleString()}
                icon="🟢"
                description="Currently online"
              />
              <StatsCard
                title="Active Alerts"
                value={stats.activeAlerts}
                icon="🚨"
                trend={stats.trends?.alerts}
                description="Requires attention"
              />
              <StatsCard
                title="Avg Safety Score"
                value={`${stats.averageSafetyScore}%`}
                icon="🛡️"
                trend={stats.trends?.safety}
                description="Overall safety rating"
              />
              <StatsCard
                title="Resolved Today"
                value={stats.resolvedIncidents}
                icon="✅"
                trend={stats.trends?.incidents}
                description="Incidents handled"
              />
              <StatsCard
                title="Response Time"
                value={stats.responseTime}
                icon="⚡"
                description="Average response"
              />
            </div>

            {/* Quick Actions */}
            <div className="card hover-lift">
              <h3 className="card-title">Quick Actions</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <button
                  onClick={() => setActiveSection('map')}
                  className="btn btn-primary hover-scale hover-slide"
                >
                  🗺️ View Live Map
                </button>
                <button
                  onClick={() => setActiveSection('alerts')}
                  className="btn btn-primary hover-scale hover-slide"
                >
                  🚨 Check Alerts
                </button>
                <button
                  onClick={() => setActiveSection('reports')}
                  className="btn btn-primary hover-scale hover-slide"
                >
                  📄 Generate Reports
                </button>
                <button
                  onClick={() => setActiveSection('analytics')}
                  className="btn btn-primary hover-scale hover-slide"
                >
                  📈 View Analytics
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card hover-lift">
              <h3 className="card-title">Recent Activity</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {alerts.slice(0, 5).map((alert, index) => (
                  <div key={alert.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.2s ease'
                  }}
                  className="hover-lift"
                  >
                    <span className="hover-bounce" style={{
                      fontSize: '1.5rem',
                      marginRight: '1rem'
                    }}>
                      {alert.type === 'emergency' ? '🚨' : 
                       alert.type === 'location' ? '📍' : 
                       alert.type === 'weather' ? '🌧️' : '⚠️'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem'
                      }}>
                        {alert.title}
                      </div>
                      <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      backgroundColor: alert.severity === 'critical' ? '#fee2e2' :
                                     alert.severity === 'high' ? '#fef3c7' :
                                     alert.severity === 'medium' ? '#fef3c7' : '#dbeafe',
                      color: alert.severity === 'critical' ? '#dc2626' :
                             alert.severity === 'high' ? '#d97706' :
                             alert.severity === 'medium' ? '#d97706' : '#2563eb'
                    }}>
                      {alert.severity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'map':
        return (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="card hover-lift">
              <h3 className="card-title">Real-time Tourist Locations</h3>
              <div style={{
                height: '500px',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '2px solid var(--border-color)'
              }}>
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
                  {tourists.slice(0, 20).map((tourist) => (
                    <Marker
                      key={tourist.id}
                      position={tourist.location}
                      icon={getMarkerIcon(tourist.status)}
                    >
                      <Popup>
                        <div style={{ padding: '0.5rem' }}>
                          <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{tourist.name}</h4>
                          <p><strong>ID:</strong> {tourist.id}</p>
                          <p><strong>Status:</strong> <span style={{
                            color: tourist.status === 'safe' ? '#10b981' :
                                   tourist.status === 'caution' ? '#f59e0b' : '#ef4444',
                            fontWeight: 600
                          }}>{tourist.status}</span></p>
                          <p><strong>Safety Score:</strong> {tourist.safetyScore}%</p>
                          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
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
                      color={area.riskLevel === 'high' ? '#ef4444' : '#f59e0b'}
                      fillOpacity={0.3}
                    >
                      <Popup>
                        <div>
                          <h4 style={{ fontWeight: 'bold' }}>{area.name}</h4>
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
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="card hover-lift">
              <h3 className="card-title">Active Alerts ({alerts.length})</h3>
              <div style={{ display: 'grid', gap: '1.5rem', maxHeight: '600px', overflowY: 'auto' }}>
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onGenerateReport={handleGenerateReport}
                    />
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <p>No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'tourists':
        return (
          <div style={{ display: 'grid', gap: '2rem' }}>
            {/* Search Section */}
            <div className="card hover-lift">
              <h3 className="card-title">Search Tourist</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Enter tourist name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleSearch}
                  className="btn btn-primary hover-scale hover-slide"
                >
                  🔍 Search
                </button>
              </div>

              {searchResults && (
                <div style={{
                  padding: '1.5rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '15px',
                  border: '1px solid var(--border-color)'
                }} className="hover-lift">
                  <h4 style={{
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    {searchResults.name}
                  </h4>
                  <div className="grid grid-2">
                    <div>
                      <div className="field-group">
                        <span className="field-label">ID:</span> 
                        <span className="field-value">{searchResults.id}</span>
                      </div>
                      <div className="field-group">
                        <span className="field-label">Safety Score:</span> 
                        <span className="field-value">{searchResults.safetyScore}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="field-group">
                        <span className="field-label">Status:</span> 
                        <span style={{
                          color: searchResults.status === 'safe' ? '#10b981' :
                                 searchResults.status === 'caution' ? '#f59e0b' : '#ef4444',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {searchResults.status}
                        </span>
                      </div>
                      <div className="field-group">
                        <span className="field-label">Last Seen:</span> 
                        <span className="field-value">
                          {new Date(searchResults.lastSeen).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* All Tourists List */}
            <div className="card hover-lift">
              <h3 className="card-title">All Tourists ({tourists.length})</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Safety Score</th>
                      <th style={{ textAlign: 'left', padding: '1rem', color: 'var(--text-secondary)' }}>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourists.slice(0, 15).map((tourist) => (
                      <tr key={tourist.id} 
                          style={{ 
                            borderBottom: '1px solid var(--border-color)',
                            transition: 'all 0.2s ease'
                          }}
                          className="hover-lift"
                      >
                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{tourist.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{tourist.id}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            backgroundColor: tourist.status === 'safe' ? '#dcfce7' :
                                           tourist.status === 'caution' ? '#fef3c7' : '#fecaca',
                            color: tourist.status === 'safe' ? '#166534' :
                                   tourist.status === 'caution' ? '#92400e' : '#991b1b'
                          }}>
                            {tourist.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{tourist.safetyScore}%</td>
                        <td style={{ 
                          padding: '1rem', 
                          fontSize: '0.8rem', 
                          color: 'var(--text-secondary)' 
                        }}>
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
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="card hover-lift">
              <h3 className="card-title">E-FIR Report Generator</h3>
              <p style={{
                marginBottom: '2rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6
              }}>
                Generate comprehensive reports for incidents by clicking "Generate Report" on any alert in the Alerts section.
              </p>
              
              <div className="grid grid-2">
                <div>
                  <h4 style={{
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Recent Reports
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                      { id: '001', title: 'Emergency Report #001', desc: 'Tourist emergency in Central Park', time: '2 hours ago' },
                      { id: '002', title: 'Incident Report #002', desc: 'Unauthorized area access', time: '5 hours ago' },
                      { id: '003', title: 'Weather Report #003', desc: 'Storm impact assessment', time: '1 day ago' }
                    ].map((report, index) => (
                      <div key={report.id} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }} className="hover-lift">
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                          }}>
                            {report.title}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                          }}>
                            {report.time}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.9rem',
                          color: 'var(--text-secondary)'
                        }}>
                          {report.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 style={{
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Report Statistics
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                      { label: 'Total Reports Today', value: '12', color: '#3b82f6' },
                      { label: 'Emergency Reports', value: '3', color: '#ef4444' },
                      { label: 'Incident Reports', value: '9', color: '#f59e0b' },
                      { label: 'Resolution Rate', value: '96%', color: '#10b981' }
                    ].map((stat, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }} className="hover-lift">
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {stat.label}:
                        </span>
                        <span style={{
                          fontWeight: 700,
                          color: stat.color,
                          fontSize: '1.1rem'
                        }}>
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div className="card hover-lift">
              <h3 className="card-title">System Analytics</h3>
              <div className="grid grid-2">
                <div>
                  <h4 style={{
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Performance Metrics
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                      { metric: 'System Uptime', value: '99.9%', trend: '+0.1%' },
                      { metric: 'Response Time', value: '3.2s', trend: '-0.5s' },
                      { metric: 'Alert Accuracy', value: '94.7%', trend: '+2.3%' },
                      { metric: 'User Satisfaction', value: '4.8/5', trend: '+0.2' }
                    ].map((item, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }} className="hover-lift">
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {item.value}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem', 
                              color: 'var(--text-secondary)' 
                            }}>
                              {item.metric}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: item.trend.startsWith('+') ? '#10b981' : '#ef4444',
                            fontWeight: 600
                          }}>
                            {item.trend}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{
                    fontWeight: 600,
                    marginBottom: '1rem',
                    color: 'var(--text-primary)'
                  }}>
                    Activity Summary
                  </h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                      { label: 'Tourists Monitored', value: '1,248', icon: '👥' },
                      { label: 'Alerts Processed', value: '89', icon: '🚨' },
                      { label: 'Reports Generated', value: '34', icon: '📄' },
                      { label: 'Incidents Resolved', value: '145', icon: '✅' }
                    ].map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                      }} className="hover-lift">
                        <span className="hover-rotate" style={{
                          fontSize: '2rem',
                          marginRight: '1rem'
                        }}>
                          {item.icon}
                        </span>
                        <div>
                          <div style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: 'var(--text-primary)'
                          }}>
                            {item.value}
                          </div>
                          <div style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)'
                          }}>
                            {item.label}
                          </div>
                        </div>
                      </div>
                    ))}
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
    <div className={`dashboard ${isDark ? '' : 'light'}`}>
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={onLogout}
      />

      <div className="main-content">
        <header className="header">
          <div className="header-content">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="interactive"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                ☰
              </button>
            )}
            <h1 className="page-title">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <div className="header-info">
              <div className="user-info">
                Guardian Eagle Authority Panel
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'var(--bg-secondary)',
                borderRadius: '20px',
                border: '1px solid var(--border-color)'
              }} className="hover-glow">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  System Online
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AuthorityDashboardEnhanced;
