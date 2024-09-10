// src/app/api/save-location/route.js
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabaseUrl = 'https://dmidagxixicbnagktjxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaWRhZ3hpeGljYm5hZ2t0anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NDk0MzcsImV4cCI6MjA0MTUyNTQzN30.W5_oH1H_d1G6rltP-r_y-b-ZGwqhTUulNUzr2rjlq1Q';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request) {
  try {
    const { latitude, longitude, accuracy, device_info } = await request.json();

    // Mendapatkan alamat IP dari request
    // Catatan: Dalam lingkungan produksi, kamu perlu memastikan bahwa alamat IP yang diterima adalah dari pengguna yang sebenarnya
    const ip_address = request.headers.get('x-forwarded-for') || 'unknown';

    // Simpan data ke Supabase
    const { data, error } = await supabase
      .from('device_data')
      .insert([{ ip_address, latitude, longitude, device_info }]);

    if (error) {
      return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: 'success', message: 'Location saved' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
  }
}