// Authentication page with regular CSS classes
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const LoginPageSimple = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('tourist');
  const [touristId, setTouristId] = useState('tourist123');
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = () => {
    if (selectedRole === 'tourist') {
      onLogin('tourist', touristId);
    } else {
      onLogin('authority');
    }
  };

  return (
    <div className={`login-container ${isDark ? '' : 'light'}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="theme-toggle hover-glow"
        style={{
          position: 'absolute',
          top: '2rem',
          right: '2rem',
          zIndex: 999
        }}
      >
        <span style={{marginRight: '0.5rem'}}>{isDark ? '☀️' : '🌙'}</span>
        {isDark ? 'Light' : 'Dark'}
      </button>
      
      <div className="login-card hover-lift">
        {/* Logo and Title */}
        <div className="logo-container">
          <div className="logo-icon">
            <span style={{color: 'white'}}>🛡️</span>
          </div>
          <h1 className="logo-title">Guardian Eagle</h1>
          <p className="logo-subtitle">AI-Powered Tourist Safety System</p>
        </div>

        {/* Role Selection */}
        <div className="form-group">
          <label className="form-label">
            Select Your Role
          </label>
          <div className="role-grid">
            <button
              onClick={() => setSelectedRole('tourist')}
              className={`role-button ${selectedRole === 'tourist' ? 'active' : ''}`}
            >
              <span className="role-icon">👤</span>
              <div className="role-label">Tourist</div>
              <div className="role-desc">View my safety status</div>
            </button>
            
            <button
              onClick={() => setSelectedRole('authority')}
              className={`role-button ${selectedRole === 'authority' ? 'active' : ''}`}
            >
              <span className="role-icon">🚔</span>
              <div className="role-label">Authority</div>
              <div className="role-desc">Monitor all tourists</div>
            </button>
          </div>
        </div>

        {/* Tourist ID Input (only for tourists) */}
        {selectedRole === 'tourist' && (
          <div className="form-group">
            <label className="form-label">
              Tourist ID
            </label>
            <input
              type="text"
              value={touristId}
              onChange={(e) => setTouristId(e.target.value)}
              placeholder="Enter your tourist ID"
              className="form-input"
            />
            <p className="form-hint">
              Demo IDs: tourist123, tourist456, tourist789
            </p>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={selectedRole === 'tourist' && !touristId.trim()}
          className="btn btn-primary btn-full"
        >
          Access {selectedRole === 'tourist' ? 'Tourist' : 'Authority'} Dashboard
        </button>

        {/* Demo Information */}
        <div className="info-card">
          <h3 className="info-title">Demo Information</h3>
          <div className="info-list">
            <p><strong>Tourist Dashboard:</strong> View personal safety score, risk areas, and alerts</p>
            <p><strong>Authority Dashboard:</strong> Monitor all tourists, manage alerts, generate reports</p>
            <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem'}}>
              * This is a demonstration version with mock data
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="features-list">
          <div className="features-row">
            <div className="feature-item">
              <span>🗺️</span>
              Real-time Maps
            </div>
            <div className="feature-item">
              <span>🚨</span>
              Live Alerts
            </div>
            <div className="feature-item">
              <span>📊</span>
              Analytics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSimple;
