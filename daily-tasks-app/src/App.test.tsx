import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task management header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Daily Task Manager/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders tab navigation', () => {
  render(<App />);
  const activeTab = screen.getByText(/Active/i);
  const futureTab = screen.getByText(/Future/i);
  const doneTab = screen.getByText(/Done/i);
  
  expect(activeTab).toBeInTheDocument();
  expect(futureTab).toBeInTheDocument();
  expect(doneTab).toBeInTheDocument();
});
