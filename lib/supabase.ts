import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// Create a single Supabase client instance to avoid multiple instances warning
// Note: Multiple instances are not an error but may cause undefined behavior with storage keys
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Export the same instance for consistency (previously supabaseTyped)
export const supabaseTyped = supabase;
