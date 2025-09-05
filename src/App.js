// Main application with routing
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TouristDashboard from './components/TouristDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import LoginPage from './components/LoginPage';
import './App.css';

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
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          
          {/* Tourist Dashboard Route */}
          <Route 
            path="/tourist" 
            element={
              user?.type === 'tourist' ? (
                <TouristDashboard 
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
                <AuthorityDashboard onLogout={handleLogout} />
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
  );
}

export default App;
