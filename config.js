// BuggsAquatics — Supabase config
const SUPABASE_URL = 'https://hgxggigjqbyqarfsutqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneGdnaWdqcWJ5cWFyZnN1dHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTEzNjgsImV4cCI6MjA5ODYyNzM2OH0.lYOdwbpzHbLFYVYvpvpn43thk07uKAkcT1mQzTOpXvY';

window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
