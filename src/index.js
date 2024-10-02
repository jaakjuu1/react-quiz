import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Add this line if you create an index.css file
import App from './App';
import './nis2-quiz';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);