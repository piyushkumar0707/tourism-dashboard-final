// Enhanced Tourist Dashboard with modern UI
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../context/ThemeContext';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom blue marker for tourist location
const touristIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Enhanced Circular Progress Component
const CircularProgress = ({ score, size = 150 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 50) return '#F59E0B';
    return '#EF4444';
  };

  const getGradientId = (score) => {
    if (score >= 80) return 'gradient-safe';
    if (score >= 50) return 'gradient-caution';
    return 'gradient-danger';
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'}}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient-safe" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradient-caution" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${getGradientId(score)})`}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: 'drop-shadow(0 0 10px ' + getColor(score) + '50)'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1" style={{textShadow: '0 2px 10px rgba(0,0,0,0.3)'}}>{score}</div>
          <div className="text-sm text-white opacity-80 font-medium">Safety Score</div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component
const Sidebar = ({ activeSection, setActiveSection, isMobile, isOpen, setIsOpen, onLogout }) => {
  const { isDark, toggleTheme } = useTheme();
  
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'risk-areas', label: 'Risk Areas', icon: '🗺️' },
    { id: 'alerts', label: 'Alerts', icon: '🚨' }
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
          <h2 className="sidebar-title">Tourist Dashboard</h2>
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
                nav-item
                ${activeSection === item.id ? 'active' : ''}
              `}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="absolute bottom-4 left-4 right-4" style={{display: 'grid', gap: '0.5rem'}}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle hover-glow"
            style={{width: '100%'}}
          >
            <span style={{marginRight: '0.5rem'}}>{isDark ? '☀️' : '🌙'}</span>
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
            <span style={{marginRight: '0.5rem'}}>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const TouristDashboardEnhanced = ({ touristId = "tourist123", onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();
  
  // State for API data
  const [touristData, setTouristData] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [riskAreas, setRiskAreas] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom hooks
  const { currentLocation } = useGeolocation();
  const { lastMessage } = useWebSocket('ws://localhost:8000/ws/tourist/' + touristId);

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

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      switch (data.type) {
        case 'safety_update':
          setSafetyData(data.payload);
          break;
        case 'new_alert':
          setAlerts(prev => [data.payload, ...prev]);
          break;
        default:
          break;
      }
    }
  }, [lastMessage]);

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock API calls
        const tourist = {
          id: touristId,
          name: touristId === 'tourist123' ? 'John Doe' : 
                touristId === 'tourist456' ? 'Jane Smith' : 'Mike Johnson',
          registeredId: touristId.toUpperCase().replace('TOURIST', 'TD'),
          credentialStatus: "verified",
          joinDate: "2024-01-15"
        };

        const safety = {
          score: Math.floor(Math.random() * 40) + 60,
          status: "safe",
          lastUpdated: new Date().toISOString()
        };

        const risks = [
          {
            id: 1,
            name: "Downtown Construction Zone",
            coordinates: [[40.7580, -73.9855], [40.7600, -73.9855], [40.7600, -73.9835], [40.7580, -73.9835]],
            riskLevel: "high"
          },
          {
            id: 2,
            name: "Park After Dark",
            coordinates: [[40.7489, -73.9680], [40.7520, -73.9680], [40.7520, -73.9650], [40.7489, -73.9650]],
            riskLevel: "medium"
          }
        ];

        const alertsData = [
          {
            id: 1,
            type: "location",
            message: "You are approaching a high-risk area",
            severity: "warning",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString()
          },
          {
            id: 2,
            type: "weather",
            message: "Severe weather alert in your area",
            severity: "danger",
            timestamp: new Date(Date.now() - 45 * 60000).toISOString()
          }
        ];

        setTouristData(tourist);
        setSafetyData(safety);
        setRiskAreas(risks);
        setAlerts(alertsData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [touristId]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <div style={{display: 'grid', gap: '2rem'}}>
            <div className="card">
              <h3 className="card-title">Tourist Profile</h3>
              <div className="grid grid-2">
                <div className="field-group">
                  <label className="field-label">Name</label>
                  <p className="field-value">{touristData?.name}</p>
                </div>
                <div className="field-group">
                  <label className="field-label">Registered ID</label>
                  <p className="field-value">{touristData?.registeredId}</p>
                </div>
                <div className="field-group">
                  <label className="field-label">Join Date</label>
                  <p className="field-value">{new Date(touristData?.joinDate).toLocaleDateString()}</p>
                </div>
                <div className="field-group">
                  <label className="field-label">Current Location</label>
                  <p className="field-value">
                    {currentLocation ? 
                      `${currentLocation[0].toFixed(4)}, ${currentLocation[1].toFixed(4)}` : 
                      'Location unavailable'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="card-title">Identity Status</h3>
              <div className="status-verified">
                <span className="status-icon">✅</span>
                <span style={{fontSize: '1.1rem', fontWeight: 600}}>
                  Identity Verified
                </span>
              </div>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div style={{display: 'grid', gap: '2rem'}}>
            <div className="card">
              <h3 className="card-title">Safety Score</h3>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 0'}}>
                <CircularProgress score={safetyData?.score || 0} />
                <div style={{marginTop: '2rem', textAlign: 'center'}}>
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: safetyData?.score >= 80 ? '#10b981' : 
                           safetyData?.score >= 50 ? '#f59e0b' : '#ef4444',
                    marginBottom: '0.5rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    {safetyData?.score >= 80 ? 'Safe' : 
                     safetyData?.score >= 50 ? 'Caution' : 'Danger'}
                  </p>
                  <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>
                    Last updated: {new Date(safetyData?.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Safety Tips</h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                {[
                  { icon: '🛡️', text: 'Keep your digital ID accessible at all times' },
                  { icon: '📍', text: 'Avoid marked high-risk areas, especially after dark' },
                  { icon: '🚨', text: 'Report any suspicious activity immediately' },
                  { icon: '📱', text: 'Keep your phone charged and location services enabled' }
                ].map((tip, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <span style={{fontSize: '1.5rem', marginRight: '1rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'}}>{tip.icon}</span>
                    <p style={{color: 'white', fontSize: '1rem', fontWeight: 500}}>{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'risk-areas':
        return (
          <div style={{display: 'grid', gap: '2rem'}}>
            <div className="card">
              <h3 className="card-title">Risk Areas Map</h3>
              <div style={{height: '400px', borderRadius: '15px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)'}}>
                <MapContainer
                  center={currentLocation || [40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  
                  {currentLocation && (
                    <Marker position={currentLocation} icon={touristIcon}>
                      <Popup>Your current location</Popup>
                    </Marker>
                  )}
                  
                  {riskAreas.map((area) => (
                    <Polygon
                      key={area.id}
                      positions={area.coordinates}
                      color={area.riskLevel === 'high' ? '#ef4444' : '#f59e0b'}
                      fillOpacity={0.3}
                    >
                      <Popup>
                        <div>
                          <h4 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>{area.name}</h4>
                          <p>Risk Level: {area.riskLevel}</p>
                        </div>
                      </Popup>
                    </Polygon>
                  ))}
                </MapContainer>
              </div>
            </div>
            
            <div className="card">
              <h3 className="card-title">Risk Area Legend</h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{
                    width: '20px', 
                    height: '20px', 
                    background: '#ef4444', 
                    opacity: 0.7, 
                    marginRight: '1rem',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{color: 'white', fontWeight: 500}}>High Risk Areas - Avoid if possible</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{
                    width: '20px', 
                    height: '20px', 
                    background: '#f59e0b', 
                    opacity: 0.7, 
                    marginRight: '1rem',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{color: 'white', fontWeight: 500}}>Medium Risk Areas - Exercise caution</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <div style={{
                    width: '20px', 
                    height: '20px', 
                    background: '#3b82f6', 
                    marginRight: '1rem',
                    borderRadius: '4px'
                  }}></div>
                  <span style={{color: 'white', fontWeight: 500}}>Your Current Location</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div style={{display: 'grid', gap: '2rem'}}>
            <div className="card">
              <h3 className="card-title">Active Alerts</h3>
              {alerts.length > 0 ? (
                <div style={{display: 'grid', gap: '1rem'}}>
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        padding: '1.5rem',
                        borderRadius: '15px',
                        border: `2px solid ${
                          alert.severity === 'danger' ? '#ef4444' :
                          alert.severity === 'warning' ? '#f59e0b' : '#3b82f6'
                        }`,
                        background: `linear-gradient(135deg, ${
                          alert.severity === 'danger' ? 'rgba(239, 68, 68, 0.1)' :
                          alert.severity === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                        } 0%, rgba(255, 255, 255, 0.05) 100%)`,
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <div style={{display: 'flex', alignItems: 'flex-start'}}>
                        <span style={{
                          fontSize: '2rem', 
                          marginRight: '1rem',
                          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
                        }}>
                          {alert.type === 'location' ? '📍' : 
                           alert.type === 'weather' ? '🌧️' : '⚠️'}
                        </span>
                        <div style={{flex: 1}}>
                          <p style={{color: 'white', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem'}}>
                            {alert.message}
                          </p>
                          <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color: 'rgba(255,255,255,0.8)', textAlign: 'center', padding: '3rem'}}>
                  No active alerts
                </p>
              )}
            </div>

            <div className="card">
              <h3 className="card-title">Emergency Contacts</h3>
              <div style={{display: 'grid', gap: '1rem'}}>
                {[
                  { icon: '🚨', label: 'Emergency Services', number: '911', color: '#ef4444' },
                  { icon: '🚔', label: 'Tourist Police', number: '311', color: '#3b82f6' },
                  { icon: 'ℹ️', label: 'Tourist Information', number: '411', color: '#10b981' }
                ].map((contact, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: `linear-gradient(135deg, ${contact.color}20 0%, rgba(255,255,255,0.05) 100%)`,
                    borderRadius: '12px',
                    border: `1px solid ${contact.color}40`
                  }}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{fontSize: '1.5rem', marginRight: '1rem'}}>{contact.icon}</span>
                      <span style={{color: 'white', fontWeight: 500}}>{contact.label}</span>
                    </div>
                    <button style={{
                      background: contact.color,
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                      {contact.number}
                    </button>
                  </div>
                ))}
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
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  marginRight: '1rem'
                }}
              >
                ☰
              </button>
            )}
            <h1 className="page-title">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
            </h1>
            <div className="header-info">
              <div className="user-info">
                Welcome, {touristData?.name || 'Tourist'}
              </div>
              <div className={`safety-badge ${
                safetyData?.score >= 80 ? 'safety-safe' :
                safetyData?.score >= 50 ? 'safety-caution' : 'safety-danger'
              }`}>
                Safety: {safetyData?.score || 0}%
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

export default TouristDashboardEnhanced;
