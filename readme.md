# Guardian Eagle Dashboard - React Implementation

A complete React application for the Guardian Eagle AI-powered safety monitoring system with dual interfaces for tourists and authorities.

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or later
- npm 7.x or later
- Modern web browser with JavaScript enabled

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Set Up Environment Variables**
Copy the `.env` file and adjust settings as needed:
```bash
# The .env file is already configured with defaults
# Modify API URLs if you have a backend server running
```

3. **Start Development Server**
```bash
npm start
```

4. **Open Your Browser**
Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
guardian-eagle-dashboard/
├── public/
│   ├── index.html              # HTML template with loading screen
│   └── manifest.json           # PWA configuration
├── src/
│   ├── components/
│   │   ├── TouristDashboard.jsx    # Tourist interface
│   │   ├── AuthorityDashboard.jsx  # Authority interface
│   │   ├── LoginPage.jsx           # Authentication page
│   │   └── SharedComponents.jsx    # Reusable UI components
│   ├── hooks/
│   │   ├── useWebSocket.js         # WebSocket management
│   │   └── useGeolocation.js       # Location tracking
│   ├── utils/
│   │   └── api.js                  # API communication
│   ├── App.js                      # Main application with routing
│   ├── App.css                     # Global styles
│   └── index.js                    # React entry point
├── package.json                    # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS configuration
└── .env                           # Environment variables
```

## 🎯 Features Implemented

### 🧑‍🤝‍🧑 Tourist Dashboard
- **Profile Management**: View personal info and credential status
- **Safety Score**: Real-time circular progress indicator (0-100)
- **Interactive Map**: Current location + risk area visualization  
- **Alert System**: Real-time safety notifications
- **Emergency Contacts**: Quick access to emergency services
- **Mobile Responsive**: Works on all device sizes

### 👮‍♂️ Authority Dashboard  
- **Overview Statistics**: Total tourists, active alerts, safety scores
- **Live Map**: Real-time tourist tracking with status indicators
- **Alert Management**: All system alerts with severity levels
- **Tourist Search**: Find and view individual tourist details
- **E-FIR Generation**: Generate incident reports (mock implementation)
- **Dark Mode**: Complete theme switching
- **Real-time Updates**: WebSocket-based live data

### 🔧 Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Communication**: WebSocket integration for live updates
- **Interactive Maps**: Leaflet.js with custom markers and polygons
- **Geolocation**: Browser-based location tracking with fallbacks
- **Progressive Web App**: Installable with offline capabilities
- **Mock Data**: Comprehensive fallback data for demo purposes
- **Error Handling**: Graceful degradation when APIs unavailable

## 🖥️ Usage Guide

### Login Options
- **Tourist**: Use ID `tourist123`, `tourist456`, or `tourist789`
- **Authority**: Click Authority role (no ID required)

### Tourist Dashboard Navigation
1. **Profile**: View personal information and verification status
2. **Safety**: Check current safety score and recommendations  
3. **Risk Areas**: View map with current location and danger zones
4. **Alerts**: See active safety notifications and emergency contacts

### Authority Dashboard Navigation  
1. **Overview**: System statistics and quick actions
2. **Live Map**: Real-time tourist locations with status colors
3. **Alerts**: Manage all system alerts and generate reports
4. **Tourist Search**: Find specific tourists and view details
5. **Reports**: E-FIR generation and reporting statistics

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code  
npm run format

# Build and serve production
npm run build && npx serve -s build
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_WS_URL=ws://localhost:8000/ws

# Feature Flags
REACT_APP_ENABLE_GEOLOCATION=true
REACT_APP_ENABLE_WEBSOCKETS=true
REACT_APP_ENABLE_MOCK_DATA=true

# Map Settings
REACT_APP_DEFAULT_MAP_CENTER_LAT=40.7128
REACT_APP_DEFAULT_MAP_CENTER_LNG=-74.0060
```

### Tailwind CSS Customization
The `tailwind.config.js` includes:
- Custom Guardian Eagle color palette
- Safety status colors (safe/caution/danger)
- Alert severity styling
- Responsive breakpoints
- Custom animations and components

## 📱 Mobile Support

The application is fully responsive with:
- **Mobile-first Design**: Optimized for touch interfaces
- **Collapsible Navigation**: Hamburger menu on mobile
- **Touch-friendly Buttons**: Minimum 44px touch targets
- **Optimized Maps**: Mobile-friendly map interactions
- **Progressive Web App**: Installable on mobile devices

## 🔒 Security Features

- **XSS Protection**: Input sanitization and validation
- **Secure Token Handling**: JWT tokens stored securely
- **Request Timeouts**: Prevents hanging requests
- **Error Boundaries**: Graceful error handling
- **Content Security Policy**: Configured in HTML head

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The `build` folder can be deployed to:
- **Netlify**: Drag and drop deployment
- **Vercel**: Connect GitHub repository
- **AWS S3 + CloudFront**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

### Environment-Specific Builds
```bash
# Development
REACT_APP_ENVIRONMENT=development npm run build

# Staging
REACT_APP_ENVIRONMENT=staging npm run build

# Production  
REACT_APP_ENVIRONMENT=production npm run build
```

## 🧪 Testing

### Component Testing
```bash
npm test
```

### Manual Testing Checklist
- [ ] Login with tourist and authority roles
- [ ] Navigate between all dashboard sections
- [ ] Test responsive design on mobile/tablet
- [ ] Verify map interactions and markers
- [ ] Check real-time WebSocket updates (if backend available)
- [ ] Test geolocation permission handling
- [ ] Verify dark mode toggle (Authority dashboard)
- [ ] Test search functionality
- [ ] Verify alert generation and display

## 🔌 API Integration

The application includes mock data fallbacks, but can integrate with real APIs:

### Expected API Endpoints
```
GET  /api/tourist/{id}           # Tourist profile
GET  /api/safety/{id}            # Safety score
GET  /api/risk-areas             # Geo-fenced areas
GET  /api/alerts/{id}            # Tourist alerts
GET  /api/tourists               # All tourists (authority)
GET  /api/alerts                 # All alerts (authority)
POST /api/report/{alertId}       # Generate E-FIR
```

### WebSocket Events
```javascript
// Expected WebSocket message format
{
  type: 'safety_update' | 'new_alert' | 'tourist_update',
  payload: { /* relevant data */ },
  timestamp: '2024-01-20T10:30:00Z'
}
```

## 🐛 Troubleshooting

### Common Issues

**Maps not loading:**
- Check internet connection
- Verify Leaflet CSS is loaded
- Check browser console for errors

**Geolocation not working:**
- Ensure HTTPS in production (required for geolocation)
- Check browser permissions
- Verify location services are enabled

**WebSocket connection failed:**
- Backend server not running
- Incorrect WebSocket URL in environment variables
- Network firewall blocking WebSocket connections

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility
- Verify all peer dependencies are installed

### Development Tips

1. **Hot Reload**: Use `npm start` for automatic reloading during development
2. **Mock Data**: Set `REACT_APP_ENABLE_MOCK_DATA=true` for offline development
3. **Debug Mode**: Enable console logging with debug environment variables
4. **Network Tab**: Monitor API calls in browser DevTools
5. **React DevTools**: Install browser extension for component debugging

## 📚 Additional Resources

- **React Documentation**: https://reactjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Leaflet**: https://react-leaflet.js.org/
- **WebSocket API**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is part of the Guardian Eagle Analysis and is intended for educational and demonstration purposes.

---

**Built with ❤️ using React, Tailwind CSS, and Leaflet.js**
