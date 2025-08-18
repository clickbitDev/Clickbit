import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/blog.css';

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