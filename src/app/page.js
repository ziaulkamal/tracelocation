// src/app/page.js
"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [location, setLocation] = useState(null);
  const [gpsEnabled, setGpsEnabled] = useState(true);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });

        // Ambil informasi perangkat
        const userAgent = navigator.userAgent;

        // Kirim data ke API
        fetch('/api/save-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude,
            longitude,
            accuracy,
            device_info: userAgent
          }),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error('Error:', error));
      }, (error) => {
        console.error('Error Code = ' + error.code + ' - ' + error.message);
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    } else {
      setGpsEnabled(false); // Set GPS status to false if geolocation is not supported
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!gpsEnabled) {
      // Alihkan ke Google.com jika GPS tidak diaktifkan
      window.location.href = 'https://www.google.com';
    }
  }, [gpsEnabled]);

  if (!gpsEnabled) {
    // Jangan tampilkan konten jika GPS tidak diaktifkan
    return null;
  }

  return (
    <div>
      <h1>Get Your Location</h1>
      {location ? (
        <div>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy} meters</p>
          {/* Google Maps Link */}
          <a 
            href={`https://www.google.com/maps/@${location.latitude},${location.longitude},21z`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Location on Google Maps
          </a>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}
