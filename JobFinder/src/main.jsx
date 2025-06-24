import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap Icons CSS - ensure this loads
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom CSS last to override Bootstrap styles
import './styles/custom.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);