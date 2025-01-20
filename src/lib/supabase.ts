import { createClient } from '@supabase/supabase-js';

// In Lovable, we don't use environment variables
// Instead, we use the Supabase connection that's already established
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);