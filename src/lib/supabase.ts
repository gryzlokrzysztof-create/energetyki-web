import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bhpxwadyvudhfqnkklir.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocHh3YWR5dnVkaGZxbmtrbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3OTc0MTQsImV4cCI6MjA4NzM3MzQxNH0.0XT10Md4LodUak5FreZKyy4W8CXQFyZPAewVgUF6EZg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);