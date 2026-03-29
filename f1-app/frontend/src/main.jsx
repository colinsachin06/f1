import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, registerables } from 'chart.js';
import App from './App';
import './index.css';

Chart.register(...registerables);

Chart.defaults.color = 'rgba(255,255,255,0.4)';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = 'Barlow Condensed';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
