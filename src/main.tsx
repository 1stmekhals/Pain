// Main entry point for the React application
// Sets up the React root and renders the App component
import { StrictMode } from 'react';
// Import React's StrictMode for additional development checks
import { createRoot } from 'react-dom/client';
// Import createRoot for React 18's new root API
import App from './App.tsx';
// Import the main App component
import './index.css';
// Import global CSS styles

// Create React root and render the application
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* StrictMode enables additional checks and warnings in development */}
    <App />
    {/* Render the main App component */}
  </StrictMode>
);