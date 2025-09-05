// Location tracking
import { useState, useEffect } from 'react';

/**
 * Custom hook for geolocation functionality
 * Provides current location tracking for tourists in the Guardian Eagle system
 */
export const useGeolocation = (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 600000, // 10 minutes
    watchPosition = true,
    onLocationUpdate,
    onError
  } = options;

  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const geolocationOptions = {
    enableHighAccuracy,
    timeout,
    maximumAge
  };

  // Success handler
  const handleSuccess = (position) => {
    const location = [position.coords.latitude, position.coords.longitude];
    setCurrentLocation(location);
    setError(null);
    setIsLoading(false);
    onLocationUpdate?.(position);
  };

  // Error handler
  const handleError = (error) => {
    setError(error);
    setIsLoading(false);
    onError?.(error);
    
    // Provide fallback location (NYC) for demo purposes
    if (!currentLocation) {
      setCurrentLocation([40.7128, -74.0060]);
    }
  };

  // Get current position once
  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported by this browser');
      handleError(error);
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );
  };

  // Start watching position
  const startWatching = () => {
    if (!navigator.geolocation) {
      const error = new Error('Geolocation is not supported by this browser');
      handleError(error);
      return;
    }

    if (watchId !== null) {
      return; // Already watching
    }

    setIsLoading(true);
    setError(null);

    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      geolocationOptions
    );

    setWatchId(id);
  };

  // Stop watching position
  const stopWatching = () => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  // Check if current location is within a geofenced area
  const isWithinGeofence = (geofence) => {
    if (!currentLocation || !geofence) return false;

    const [currentLat, currentLon] = currentLocation;
    
    // Handle circular geofence
    if (geofence.type === 'circle') {
      const distance = calculateDistance(
        currentLat, 
        currentLon, 
        geofence.center[0], 
        geofence.center[1]
      );
      return distance <= geofence.radius;
    }

    // Handle polygon geofence (simple point-in-polygon)
    if (geofence.type === 'polygon' && geofence.coordinates) {
      return isPointInPolygon([currentLat, currentLon], geofence.coordinates);
    }

    return false;
  };

  // Point-in-polygon algorithm (ray casting)
  const isPointInPolygon = (point, polygon) => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  };

  // Initialize geolocation
  useEffect(() => {
    if (watchPosition) {
      startWatching();
    } else {
      getCurrentPosition();
    }

    // Cleanup on unmount
    return () => {
      stopWatching();
    };
  }, [watchPosition]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    currentLocation,
    isLoading,
    error,
    getCurrentPosition,
    startWatching,
    stopWatching,
    calculateDistance,
    isWithinGeofence,
    isWatching: watchId !== null
  };
};

export default useGeolocation;
