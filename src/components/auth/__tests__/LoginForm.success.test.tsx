import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../LoginForm';
import { supabase } from '@/lib/supabase';
import { renderWithProviders, createMockUser, createMockSession, createMockProfile } from './test-utils';

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

describe('LoginForm Success Scenarios', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('handles successful login', async () => {
    const mockUser = createMockUser();
    const mockSession = createMockSession(mockUser);
    const mockProfile = createMockProfile(mockUser.id);

    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValueOnce({ data: mockProfile, error: null }),
    } as any));

    renderWithProviders(<LoginForm />);

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
});