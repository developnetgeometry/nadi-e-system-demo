import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserForm } from '../UserForm';

describe('UserForm', () => {
  it('renders create user form correctly', () => {
    render(<UserForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create user/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const onSuccess = vi.fn();
    render(<UserForm onSuccess={onSuccess} />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /create user/i }));
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    expect(onSuccess).toHaveBeenCalled();
  });
});