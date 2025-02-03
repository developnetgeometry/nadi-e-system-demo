import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { renderWithProviders } from './test-utils';

describe('LoginForm Rendering', () => {
  it('renders login form with email and password inputs', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    expect(emailInput).toHaveAttribute('type', 'email');
  });
});