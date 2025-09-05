# 🛡️ Guardian Eagle Tourism Dashboard

A modern, AI-powered safety monitoring system for tourists with stunning UI/UX and real-time capabilities.

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/Styling-CSS3-green.svg)](https://www.w3.org/Style/CSS/)
[![Tailwind CSS](https://img.shields.io/badge/Enhanced-Glassmorphism-purple.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### ✨ **Enhanced User Experience**
- **🌙 Dark/Light Mode** - Seamless theme switching with persistent preferences
- **🎨 Glassmorphism Design** - Modern translucent UI with blur effects
- **⚡ Smooth Animations** - Hover effects, transitions, and micro-interactions
- **📱 Responsive Design** - Perfect experience on all devices
- **🎯 Accessibility** - WCAG compliant with screen reader support

### 🚨 **Tourist Dashboard**
- **🛡️ Real-time Safety Score** - Animated circular progress with gradient effects
- **📍 Interactive Risk Map** - Leaflet-powered maps with custom markers
- **🚨 Live Alerts System** - Instant notifications with severity indicators
- **👤 Identity Verification** - Secure tourist credential management
- **📱 Emergency Contacts** - Quick access to emergency services

### 🎛️ **Authority Dashboard**
- **📊 Enhanced Statistics** - Beautiful cards with trends and animations
- **🗺️ Live Tourist Tracking** - Real-time location monitoring
- **🚨 Alert Management** - Professional incident handling interface
- **👥 Tourist Search** - Advanced search and filtering capabilities
- **📄 E-FIR Generator** - Automated incident report generation
- **📈 Analytics Dashboard** - System performance and activity metrics

### 🎪 **Amazing Interactions**
- **hover-lift** - Cards that elegantly lift and scale
- **hover-glow** - Beautiful glowing effects on interactive elements
- **hover-scale** - Smooth scaling animations
- **hover-rotate** - Rotating icons and elements
- **hover-slide** - Sliding shine effects
- **hover-bounce** - Gentle bouncing animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/piyushkumar0707/tourism-dashboard-final.git
   cd tourism-dashboard-final
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage

### 🔐 **Login**
- **Tourist Role**: Use ID `tourist123`, `tourist456`, or `tourist789`
- **Authority Role**: Direct access to monitoring dashboard
- **Theme Toggle**: Click 🌙/☀️ to switch between dark/light modes

### 👤 **Tourist Experience**
1. **Profile**: View personal information and identity status
2. **Safety**: Monitor real-time safety score with animated progress
3. **Risk Areas**: Interactive map showing danger zones
4. **Alerts**: Receive and manage safety notifications

### 🎛️ **Authority Experience**
1. **Overview**: Dashboard with animated statistics and trends
2. **Live Map**: Real-time tourist location tracking
3. **Alerts**: Professional alert management system
4. **Tourist Search**: Find and monitor specific tourists
5. **Reports**: Generate E-FIR and incident reports
6. **Analytics**: System performance and activity metrics

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern component-based architecture
- **React Router 6** - Client-side routing
- **Leaflet Maps** - Interactive mapping solution
- **Custom CSS** - Enhanced styling with CSS variables

### **Styling & Design**
- **Glassmorphism** - Modern translucent design
- **CSS Grid & Flexbox** - Advanced layouts
- **CSS Animations** - Smooth transitions and effects
- **Responsive Design** - Mobile-first approach

### **Architecture**
- **Context API** - Theme management
- **Custom Hooks** - WebSocket and Geolocation
- **Component Composition** - Reusable UI components
- **Mock Data** - Realistic demo data

## 📁 Project Structure

```
guardian-eagle-dashboard/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── AuthorityDashboardEnhanced.jsx
│   │   ├── TouristDashboardEnhanced.jsx
│   │   ├── LoginPageSimple.jsx
│   │   └── SharedComponents.jsx
│   ├── context/
│   │   └── ThemeContext.js
│   ├── hooks/
│   │   ├── useWebSocket.js
│   │   └── useGeolocation.js
│   ├── styles.css
│   ├── App.js
│   └── index.js
├── package.json
├── tailwind.config.js
├── craco.config.js
└── README.md
```

## 🎨 Design System

### **Color Palette**
- **Primary**: `#667eea` to `#764ba2` (Purple-Blue Gradient)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Background**: Dynamic based on theme

### **Typography**
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Scale**: Responsive type scale

### **Spacing**
- **Base Unit**: 0.25rem (4px)
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### **Animations**
- **Duration**: 200ms, 300ms, 500ms
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Effects**: fade, slide, scale, rotate

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```

### **Theme Configuration**
The theme system uses CSS variables for dynamic styling:
```css
:root {
  --bg-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --text-primary: white;
  --border-color: rgba(255, 255, 255, 0.2);
}
```

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ IE11 (limited support)

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deploy to Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### **Deploy to Vercel**
```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Leaflet** - For the mapping solution
- **Google Fonts** - For the Inter font family
- **Open Source Community** - For inspiration and tools

## 📞 Support

- 📧 Email: support@guardianeagle.com
- 💬 Discord: [Join our community](https://discord.gg/guardianeagle)
- 📚 Documentation: [Full docs](https://docs.guardianeagle.com)

## 🔮 Roadmap

- [ ] **Real Backend Integration** - Connect to actual APIs
- [ ] **Push Notifications** - Real-time browser notifications
- [ ] **Offline Support** - PWA capabilities
- [ ] **Multi-language** - i18n support
- [ ] **Advanced Analytics** - Data visualization charts
- [ ] **Mobile App** - React Native companion

---

<div align="center">

**Made with ❤️ by the Guardian Eagle Team**

[🌟 Star this repo](https://github.com/piyushkumar0707/tourism-dashboard-final) • [🐛 Report Bug](https://github.com/piyushkumar0707/tourism-dashboard-final/issues) • [✨ Request Feature](https://github.com/piyushkumar0707/tourism-dashboard-final/issues)

</div>
