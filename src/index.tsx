import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';

import { App } from './components/App';
import { GameProvider } from './lib/context';

import './styles/index.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
    <Analytics />
  </React.StrictMode>
);

