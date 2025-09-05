// Tourist interface
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGeolocation } from '../hooks/useGeolocation';

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

// Circular Progress Component
const CircularProgress = ({ score, size = 120 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{score}</div>
          <div className="text-sm text-gray-600">Safety Score</div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activeSection, setActiveSection, isMobile, isOpen, setIsOpen, onLogout }) => {
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
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 bg-white shadow-lg h-full transition-transform duration-300 ease-in-out z-50
      `}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Tourist Dashboard</h2>
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
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
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

const TouristDashboard = ({ touristId = "tourist123", onLogout }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
        
        // Mock API calls - replace with actual API endpoints
        const [touristResponse, safetyResponse, riskAreasResponse, alertsResponse] = await Promise.all([
          // Simulated API responses
          Promise.resolve({
            json: () => ({
              id: touristId,
              name: touristId === 'tourist123' ? 'John Doe' : 
                    touristId === 'tourist456' ? 'Jane Smith' : 'Mike Johnson',
              registeredId: touristId.toUpperCase().replace('TOURIST', 'TD'),
              credentialStatus: "verified",
              joinDate: "2024-01-15"
            })
          }),
          Promise.resolve({
            json: () => ({
              score: Math.floor(Math.random() * 40) + 60, // Score between 60-100
              status: "safe",
              lastUpdated: new Date().toISOString()
            })
          }),
          Promise.resolve({
            json: () => ([
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
            ])
          }),
          Promise.resolve({
            json: () => ([
              {
                id: 1,
                type: "location",
                message: "You are approaching a high-risk area",
                severity: "warning",
                timestamp: new Date(Date.now() - 15 * 60000).toISOString() // 15 minutes ago
              },
              {
                id: 2,
                type: "weather",
                message: "Severe weather alert in your area",
                severity: "danger",
                timestamp: new Date(Date.now() - 45 * 60000).toISOString() // 45 minutes ago
              }
            ])
          })
        ]);

        const tourist = await touristResponse.json();
        const safety = await safetyResponse.json();
        const risks = await riskAreasResponse.json();
        const alertsData = await alertsResponse.json();

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
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tourist Profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-lg text-gray-900">{touristData?.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered ID</label>
                  <p className="text-lg text-gray-900">{touristData?.registeredId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <p className="text-lg text-gray-900">{new Date(touristData?.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                  <p className="text-lg text-gray-900">
                    {currentLocation ? 
                      `${currentLocation[0].toFixed(4)}, ${currentLocation[1].toFixed(4)}` : 
                      'Location unavailable'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Identity Status</h3>
              <div className={`
                flex items-center p-4 rounded-lg
                ${touristData?.credentialStatus === 'verified' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
                }
              `}>
                <span className="text-2xl mr-3">
                  {touristData?.credentialStatus === 'verified' ? '✅' : '❌'}
                </span>
                <span className="font-medium">
                  Identity {touristData?.credentialStatus === 'verified' ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
        );

      case 'safety':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Safety Score</h3>
              <div className="flex flex-col items-center">
                <CircularProgress score={safetyData?.score || 0} />
                <div className="mt-4 text-center">
                  <p className={`
                    text-lg font-semibold
                    ${safetyData?.score >= 80 ? 'text-green-600' : 
                      safetyData?.score >= 50 ? 'text-yellow-600' : 'text-red-600'}
                  `}>
                    {safetyData?.score >= 80 ? 'Safe' : 
                     safetyData?.score >= 50 ? 'Caution' : 'Danger'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Last updated: {new Date(safetyData?.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Safety Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">🛡️</span>
                  <p className="text-gray-700">Keep your digital ID accessible at all times</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">📍</span>
                  <p className="text-gray-700">Avoid marked high-risk areas, especially after dark</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">🚨</span>
                  <p className="text-gray-700">Report any suspicious activity immediately</p>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-2">📱</span>
                  <p className="text-gray-700">Keep your phone charged and location services enabled</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'risk-areas':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Areas Map</h3>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={currentLocation || [40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                  />
                  
                  {/* Tourist's current location */}
                  {currentLocation && (
                    <Marker position={currentLocation} icon={touristIcon}>
                      <Popup>Your current location</Popup>
                    </Marker>
                  )}
                  
                  {/* Risk areas */}
                  {riskAreas.map((area) => (
                    <Polygon
                      key={area.id}
                      positions={area.coordinates}
                      color={area.riskLevel === 'high' ? 'red' : 'orange'}
                      fillOpacity={0.3}
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
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Area Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 opacity-30 mr-3"></div>
                  <span>High Risk Areas - Avoid if possible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-500 opacity-30 mr-3"></div>
                  <span>Medium Risk Areas - Exercise caution</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 mr-3"></div>
                  <span>Your Current Location</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Active Alerts</h3>
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`
                        p-4 rounded-lg border-l-4
                        ${alert.severity === 'danger' 
                          ? 'bg-red-50 border-red-400 text-red-800'
                          : alert.severity === 'warning'
                          ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                          : 'bg-blue-50 border-blue-400 text-blue-800'
                        }
                      `}
                    >
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">
                          {alert.type === 'location' ? '📍' : 
                           alert.type === 'weather' ? '🌧️' : '⚠️'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm opacity-75 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No active alerts</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-3">🚨</span>
                    <span className="font-medium">Emergency Services</span>
                  </div>
                  <button className="text-red-600 font-bold">911</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-500 mr-3">🚔</span>
                    <span className="font-medium">Tourist Police</span>
                  </div>
                  <button className="text-blue-600 font-bold">311</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">ℹ️</span>
                    <span className="font-medium">Tourist Information</span>
                  </div>
                  <button className="text-green-600 font-bold">411</button>
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
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={onLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Header */}
          <header className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-800">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, {touristData?.name || 'Tourist'}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  safetyData?.score >= 80 ? 'bg-green-100 text-green-800' :
                  safetyData?.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  Safety: {safetyData?.score || 0}%
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

export default TouristDashboard;
