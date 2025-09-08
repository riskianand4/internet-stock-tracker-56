// Build optimization utilities for production
import React from 'react';

export const removeConsoleInProduction = () => {
  if (import.meta.env.MODE === 'production') {
    // Override console methods in production
    const noop = () => {};
    console.log = noop;
    console.debug = noop;
    console.info = noop;
    // Keep warn and error for critical issues
  }
};

// Code splitting utility
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Performance optimization
export const optimizeBundle = () => {
  // Remove unnecessary polyfills
  if (typeof window !== 'undefined') {
    // Add any production optimizations here
    removeConsoleInProduction();
  }
};

// Initialize optimizations
if (typeof window !== 'undefined') {
  optimizeBundle();
}
