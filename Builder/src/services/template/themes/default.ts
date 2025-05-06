import { Theme } from '../types';

export const defaultTheme: Theme = {
  name: 'Default',
  colors: {
    primary: '#2563eb',
    secondary: '#4b5563',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
  },
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  spacing: {
    small: '0.5rem',
    medium: '1rem',
    large: '2rem',
  },
};
