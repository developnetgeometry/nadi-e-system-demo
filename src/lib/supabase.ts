import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yojhmepgirmbryqxaqpr.supabase.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvamhtZXBnaXJtYnJ5cXhhcXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTU1MDYsImV4cCI6MjA1MjkzMTUwNn0.UC1ZT6aJk5PI8L98A1_WdCiZWYUgLVGfOVYtS0186dE';

// Initialize the Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Test the connection and log the status
(async () => {
  try {
    const { data, error } = await supabase.from('assets').select('count');
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (err) {
    console.error('Failed to test Supabase connection:', err);
  }
})();