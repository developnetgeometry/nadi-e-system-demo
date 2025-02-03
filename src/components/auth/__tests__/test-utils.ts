import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { AuthError } from '@supabase/supabase-js';

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </BrowserRouter>
  );
};

export class TestAuthError extends AuthError {
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.status = 400;
  }
}

export const createMockUser = () => ({
  id: '123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
});

export const createMockSession = (user = createMockUser()) => ({
  access_token: 'mock-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh',
  user,
});

export const createMockProfile = (userId = '123') => ({
  id: userId,
  email: 'test@example.com',
  user_type: 'member',
});