import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { optimizeBundle } from './utils/build-optimizer';
import ProductionErrorBoundary from './components/ui/production-error-boundary';
import { logger } from './utils/logger';

// Initialize production optimizations
optimizeBundle();

// Initialize error reporting
logger.info('Application starting', {
  mode: import.meta.env.MODE,
  timestamp: new Date().toISOString(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProductionErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('React Error Boundary caught error', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <App />
    </ProductionErrorBoundary>
  </React.StrictMode>,
);