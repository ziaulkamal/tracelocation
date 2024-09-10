// src/app/api/save-location/route.js
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabaseUrl = 'https://dmidagxixicbnagktjxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaWRhZ3hpeGljYm5hZ2t0anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NDk0MzcsImV4cCI6MjA0MTUyNTQzN30.W5_oH1H_d1G6rltP-r_y-b-ZGwqhTUulNUzr2rjlq1Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { latitude, longitude, device_info } = await request.json();

    // Mendapatkan alamat IP dari request
    const ip_address = request.headers.get('x-forwarded-for') || 'unknown';

    // Membuat URL Google Maps
    const google_maps_url = `https://www.google.com/maps/@${latitude},${longitude},21z`;

    // Simpan data ke Supabase
    const { data, error } = await supabase
      .from('clients_visit')
      .insert([{ ip_address, latitude, longitude, google_maps_url, device_info }]);

    if (error) {
      return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: 'success', message: 'Location and device info saved' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
  }
}