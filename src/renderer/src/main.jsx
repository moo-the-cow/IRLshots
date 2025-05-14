import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProvider from './contexts/AppContext';
import LanguageProvider from './contexts/LanguageContext';
import './index.css'; // Import Tailwind CSS
// Base CSS already imported via index.css

// Add custom global styles
const customStyles = document.createElement('style');
customStyles.textContent = `
  /* Custom scrollbar styling */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
  
  /* Smooth transitions */
  * {
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
  }
  
  /* Better focus styles */
  :focus-visible {
    outline: 2px solid rgba(124, 58, 237, 0.5);
    outline-offset: 2px;
  }

  /* Fix white dropdown options */
  option {
    background-color: #2d2b42;
    color: white;
  }

  /* Fix any other white elements */
  input, select, textarea {
    background-color: #2d2b42 !important;
    color: white !important;
    border-color: #4b5563 !important;
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: #60a5fa !important;
    box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.2) !important;
  }
  
  /* Make sure panels have proper background */
  .dark\:bg-gray-800, .dark\:bg-gray-700 {
    background-color: rgba(17, 24, 39, 0.4) !important;
  }

  /* Ensure all text is white/light */
  .dark\:text-gray-300, .dark\:text-gray-400, .text-gray-800 {
    color: #e5e7eb !important;
  }
`;

document.head.appendChild(customStyles);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LanguageProvider>
  </React.StrictMode>
);