import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://plggovkpjwzqfeezuiah.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZ2dvdmtwand6cWZlZXp1aWFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzUxMzAsImV4cCI6MjA4NzYxMTEzMH0.Ljs1WFpW8sOgW0y8Q706jIwhbZqH_SA3GX6FkRTRhyI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    console.log('Data:', data);
    console.log('Error:', error);
}

check();
