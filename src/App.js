// Main application with routing
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TouristDashboardEnhanced from './components/TouristDashboardEnhanced';
import AuthorityDashboardEnhanced from './components/AuthorityDashboardEnhanced';
import LoginPageSimple from './components/LoginPageSimple';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';
import './styles.css';

function App() {
  // Simple authentication state - in production, use proper auth
  const [user, setUser] = useState(null);

  const handleLogin = (userType, userId = null) => {
    setUser({ type: userType, id: userId });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
          {/* Login Route */}
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={user.type === 'tourist' ? '/tourist' : '/authority'} />
              ) : (
                <LoginPageSimple onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Tourist Dashboard Route */}
          <Route 
            path="/tourist" 
            element={
              user?.type === 'tourist' ? (
                <TouristDashboardEnhanced 
                  touristId={user.id} 
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Authority Dashboard Route */}
          <Route 
            path="/authority" 
            element={
              user?.type === 'authority' ? (
                <AuthorityDashboardEnhanced onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Default Route */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={user.type === 'tourist' ? '/tourist' : '/authority'} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
