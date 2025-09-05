// API communication
/**
 * API utilities for the Guardian Eagle Dashboard
 * Provides centralized API communication functions
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// API error class
class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

// Request timeout utility
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add authorization token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetchWithTimeout(url, config, 15000);
    
    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message, null, null);
  }
};

// Tourist API functions
export const touristApi = {
  // Get tourist profile and credentials
  getTourist: async (touristId) => {
    try {
      return await apiRequest(`/tourist/${touristId}`);
    } catch (error) {
      // Fallback to mock data for demo
      console.warn('Using mock data for tourist profile');
      return {
        id: touristId,
        name: touristId === 'tourist123' ? 'John Doe' : 
              touristId === 'tourist456' ? 'Jane Smith' : 'Mike Johnson',
        registeredId: touristId.toUpperCase().replace('TOURIST', 'TD'),
        credentialStatus: 'verified',
        joinDate: '2024-01-15',
        phone: '+1-555-0123',
        email: 'tourist@example.com'
      };
    }
  },

  // Get safety score for tourist
  getSafetyScore: async (touristId) => {
    try {
      return await apiRequest(`/safety/${touristId}`);
    } catch (error) {
      console.warn('Using mock data for safety score');
      return {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        status: 'safe',
        lastUpdated: new Date().toISOString(),
        factors: {
          location: 85,
          weather: 90,
          crowd: 75,
          time: 80
        }
      };
    }
  },

  // Get alerts for specific tourist
  getAlerts: async (touristId) => {
    try {
      return await apiRequest(`/alerts/${touristId}`);
    } catch (error) {
      console.warn('Using mock data for tourist alerts');
      return [
        {
          id: 1,
          type: 'location',
          message: 'You are approaching a high-risk area',
          severity: 'warning',
          timestamp: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          id: 2,
          type: 'weather',
          message: 'Severe weather alert in your area',
          severity: 'danger',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString()
        }
      ];
    }
  },

  // Update tourist location
  updateLocation: async (touristId, location) => {
    try {
      return await apiRequest(`/tourist/${touristId}/location`, {
        method: 'PUT',
        body: JSON.stringify({
          latitude: location[0],
          longitude: location[1],
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.warn('Failed to update location:', error.message);
      return { success: false };
    }
  }
};

// Authority API functions
export const authorityApi = {
  // Get all tourists
  getAllTourists: async () => {
    try {
      return await apiRequest('/tourists');
    } catch (error) {
      console.warn('Using mock data for all tourists');
      return Array.from({ length: 50 }, (_, i) => ({
        id: `tourist${i + 1}`,
        name: `Tourist ${i + 1}`,
        location: [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1],
        safetyScore: Math.floor(Math.random() * 100),
        status: ['safe', 'caution', 'danger'][Math.floor(Math.random() * 3)],
        lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString()
      }));
    }
  },

  // Get all system alerts
  getAllAlerts: async () => {
    try {
      return await apiRequest('/alerts');
    } catch (error) {
      console.warn('Using mock data for all alerts');
      return [
        {
          id: 1,
          type: 'emergency',
          title: 'Tourist in Distress',
          message: 'Emergency beacon activated in Central Park area',
          touristName: 'John Doe',
          severity: 'critical',
          timestamp: '2024-01-20T10:30:00Z',
          location: [40.7580, -73.9855]
        },
        {
          id: 2,
          type: 'location',
          title: 'Restricted Area Entry',
          message: 'Tourist entered construction zone',
          touristName: 'Alice Johnson',
          severity: 'high',
          timestamp: '2024-01-20T10:15:00Z',
          location: [40.7600, -73.9835]
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
    }
  },

  // Get dashboard statistics
  getStats: async () => {
    try {
      return await apiRequest('/stats');
    } catch (error) {
      console.warn('Using mock data for statistics');
      return {
        totalTourists: 1248,
        activeTourists: 892,
        activeAlerts: 7,
        averageSafetyScore: 78,
        trends: {
          tourists: 12,
          alerts: -5,
          safety: 3
        },
        dailyStats: {
          newRegistrations: 45,
          resolvedAlerts: 12,
          emergencyResponses: 3
        }
      };
    }
  },

  // Search tourists
  searchTourists: async (query) => {
    try {
      return await apiRequest(`/tourists/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.warn('Using mock search results');
      // Return mock search results
      const tourists = await authorityApi.getAllTourists();
      return tourists.filter(tourist => 
        tourist.name.toLowerCase().includes(query.toLowerCase()) ||
        tourist.id.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Generate E-FIR report
  generateReport: async (alertId) => {
    try {
      const response = await apiRequest(`/report/${alertId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      return response;
    } catch (error) {
      console.warn('Mock report generation');
      return {
        reportId: `EFIR-${alertId}-${Date.now()}`,
        status: 'generated',
        downloadUrl: '/mock-report.pdf',
        timestamp: new Date().toISOString()
      };
    }
  }
};

// Risk areas API functions
export const riskAreasApi = {
  // Get all risk areas
  getRiskAreas: async () => {
    try {
      return await apiRequest('/risk-areas');
    } catch (error) {
      console.warn('Using mock data for risk areas');
      return [
        {
          id: 1,
          name: 'Downtown Construction Zone',
          coordinates: [[40.7580, -73.9855], [40.7600, -73.9855], [40.7600, -73.9835], [40.7580, -73.9835]],
          riskLevel: 'high',
          description: 'Active construction site with heavy machinery',
          activeFrom: '2024-01-01',
          activeTo: '2024-06-30'
        },
        {
          id: 2,
          name: 'Park After Dark',
          coordinates: [[40.7489, -73.9680], [40.7520, -73.9680], [40.7520, -73.9650], [40.7489, -73.9650]],
          riskLevel: 'medium',
          description: 'Poorly lit area with limited security',
          activeFrom: '2024-01-01',
          activeTo: null
        }
      ];
    }
  },

  // Create new risk area
  createRiskArea: async (riskArea) => {
    try {
      return await apiRequest('/risk-areas', {
        method: 'POST',
        body: JSON.stringify(riskArea)
      });
    } catch (error) {
      console.warn('Mock risk area creation');
      return {
        id: Date.now(),
        ...riskArea,
        createdAt: new Date().toISOString()
      };
    }
  },

  // Update risk area
  updateRiskArea: async (id, updates) => {
    try {
      return await apiRequest(`/risk-areas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.warn('Mock risk area update');
      return {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  },

  // Delete risk area
  deleteRiskArea: async (id) => {
    try {
      return await apiRequest(`/risk-areas/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.warn('Mock risk area deletion');
      return { success: true };
    }
  }
};

// Authentication API functions
export const authApi = {
  // Login
  login: async (credentials) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      
      return response;
    } catch (error) {
      console.warn('Mock authentication');
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('auth_token', mockToken);
      
      return {
        token: mockToken,
        user: {
          id: credentials.userId || 'user123',
          type: credentials.userType || 'tourist',
          name: 'Demo User'
        }
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Mock logout');
    } finally {
      localStorage.removeItem('auth_token');
    }
  }
};

// Export default API object
const api = {
  tourist: touristApi,
  authority: authorityApi,
  riskAreas: riskAreasApi,
  auth: authApi,
  ApiError
};

export default api;
