// Authentication page
import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('tourist');
  const [touristId, setTouristId] = useState('tourist123');

  const handleLogin = () => {
    if (selectedRole === 'tourist') {
      onLogin('tourist', touristId);
    } else {
      onLogin('authority');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Guardian Eagle</h1>
          <p className="text-gray-600 mt-2">AI-Powered Tourist Safety System</p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedRole('tourist')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'tourist'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">👤</div>
              <div className="font-medium">Tourist</div>
              <div className="text-sm text-gray-500">View my safety status</div>
            </button>
            
            <button
              onClick={() => setSelectedRole('authority')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedRole === 'authority'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🚔</div>
              <div className="font-medium">Authority</div>
              <div className="text-sm text-gray-500">Monitor all tourists</div>
            </button>
          </div>
        </div>

        {/* Tourist ID Input (only for tourists) */}
        {selectedRole === 'tourist' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tourist ID
            </label>
            <input
              type="text"
              value={touristId}
              onChange={(e) => setTouristId(e.target.value)}
              placeholder="Enter your tourist ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Demo IDs: tourist123, tourist456, tourist789
            </p>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={selectedRole === 'tourist' && !touristId.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Access {selectedRole === 'tourist' ? 'Tourist' : 'Authority'} Dashboard
        </button>

        {/* Demo Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Demo Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Tourist Dashboard:</strong> View personal safety score, risk areas, and alerts</p>
            <p><strong>Authority Dashboard:</strong> Monitor all tourists, manage alerts, generate reports</p>
            <p className="text-xs text-gray-500 mt-2">
              * This is a demonstration version with mock data
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-1">🗺️</span>
              Real-time Maps
            </div>
            <div className="flex items-center">
              <span className="mr-1">🚨</span>
              Live Alerts
            </div>
            <div className="flex items-center">
              <span className="mr-1">📊</span>
              Analytics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
