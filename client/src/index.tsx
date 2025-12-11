import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/blog.css';

// Preload critical resources
const preloadCriticalResources = () => {
  // Preload hero image if exists
  const heroImage = new Image();
  heroImage.src = '/images/patterns/hero-pattern.svg';
  
  // Preload logo
  const logo = new Image();
  logo.src = '/logo.svg';
};

// Call preload function
preloadCriticalResources();

const rootElement = document.getElementById('root');
const adminRootElement = document.getElementById('admin-root');

// Always render the main App which now handles both regular and admin routes
if (adminRootElement) {
  ReactDOM.createRoot(adminRootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} 