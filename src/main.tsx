import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM instead of createRoot
import App from './App.tsx';
import './index.css';

// Render the App component using ReactDOM
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // The root element where the app is rendered
);