import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { AuthError } from '@supabase/supabase-js';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export const renderWithProviders = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { route = '/', ...rest } = options;

  window.history.pushState({}, 'Test page', route);

  return render(
    <BrowserRouter>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </BrowserRouter>,
    rest
  );
};

export class TestAuthError extends AuthError {
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.status = 400;
    Object.setPrototypeOf(this, TestAuthError.prototype);
  }
}

export interface MockUser {
  id: string;
  email: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  role: string;
  updated_at: string;
}

export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: '123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  ...overrides
});

export interface MockSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: MockUser;
}

export const createMockSession = (user = createMockUser()): MockSession => ({
  access_token: 'mock-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'mock-refresh',
  user
});

export interface MockProfile {
  id: string;
  email: string;
  user_type: string;
}

export const createMockProfile = (userId = '123'): MockProfile => ({
  id: userId,
  email: 'test@example.com',
  user_type: 'member'
});