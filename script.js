import React from 'react';
import { createRoot } from 'react-dom/client';
import Presentation from './src/Presentation.jsx';
import './style.css';
import './src/presentation.css';

createRoot(document.getElementById('root')).render(
  React.createElement(React.StrictMode, null, React.createElement(Presentation)),
);
