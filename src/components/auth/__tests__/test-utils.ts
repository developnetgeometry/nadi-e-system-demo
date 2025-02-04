import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface WrapperProps {
  children: React.ReactNode;
}

export const createMockUser = () => ({
  id: "test-user-id",
  email: "test@example.com",
  aud: "authenticated",
  role: "authenticated",
});

export const createMockSession = (user: any) => ({
  access_token: "test-access-token",
  refresh_token: "test-refresh-token",
  expires_in: 3600,
  user,
});

export const createMockProfile = (userId: string) => ({
  id: userId,
  email: "test@example.com",
  full_name: "Test User",
  user_type: "member",
});

export class TestAuthError extends Error {
  name: string;
  status: number;
  
  constructor(message: string, name: string) {
    super(message);
    this.name = name;
    this.status = 400;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const renderWithProviders = (ui: React.ReactElement) => {
  const Wrapper = ({ children }: WrapperProps) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <BrowserRouter>
            {children}
            <Toaster />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper });
};

export * from "@testing-library/react";