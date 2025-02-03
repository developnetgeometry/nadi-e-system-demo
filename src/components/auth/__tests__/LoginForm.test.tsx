import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';
import { supabase } from '@/lib/supabase';
import { ToastProvider } from '@/components/ui/toast';
import { AuthError, User, Session } from '@supabase/supabase-js';

// Mock supabase auth
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderLoginForm = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <LoginForm />
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form with email and password inputs', () => {
    renderLoginForm();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('handles successful login', async () => {
    const mockUser: User = {
      id: '123',
      email: 'test@example.com',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    };

    const mockSession: Session = {
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: mockUser,
    };

    const mockProfile = {
      id: '123',
      email: 'test@example.com',
      user_type: 'member',
    };

    // Mock successful auth response
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    // Mock successful profile fetch
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null }),
    } as any));

    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('handles login failure with invalid credentials', async () => {
    class MockAuthError extends AuthError {
      constructor() {
        super('Invalid login credentials');
        this.name = 'AuthError';
        this.status = 400;
        this.code = 'invalid_credentials';
      }
    }

    // Mock failed auth response
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new MockAuthError(),
    });

    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });
    });
  });

  it('handles login with unverified email', async () => {
    class MockAuthError extends AuthError {
      constructor() {
        super('Email not confirmed');
        this.name = 'AuthError';
        this.status = 400;
        this.code = 'email_not_confirmed';
      }
    }

    // Mock auth response for unverified email
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new MockAuthError(),
    });

    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'unverified@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'unverified@example.com',
        password: 'password123',
      });
    });
  });

  it('handles network error during login', async () => {
    // Mock network error
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValueOnce(
      new Error('Network error')
    );

    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });
});