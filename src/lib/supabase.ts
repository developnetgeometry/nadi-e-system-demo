import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yojhmepgirmbryqxaqpr.supabase.com';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvamhtZXBnaXJtYnJ5cXhhcXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNTU1MDYsImV4cCI6MjA1MjkzMTUwNn0.UC1ZT6aJk5PI8L98A1_WdCiZWYUgLVGfOVYtS0186dE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);