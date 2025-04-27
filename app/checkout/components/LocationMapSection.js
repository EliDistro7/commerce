// src/components/checkout/LocationMapSection.jsx
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertCircle } from 'lucide-react';

// Translations object
const translations = {
  en: {
    deliveryLocation: "Delivery Location",
    mapInstructions: "Click on the map or use the search box to set your delivery location",
    useMyLocation: "Use My Location",
    locating: "Locating...",
    searchPlaceholder: "Search for a location...",
    markerTitle: "Drag to set your delivery location",
    selectedCoordinates: "Selected coordinates",
    geolocationNotSupported: "Geolocation is not supported by your browser",
    errorGettingLocation: "Error getting your location"
  },
  sw: {
    deliveryLocation: "Eneo la Utoaji",
    mapInstructions: "Bofya kwenye ramani au tumia kisanduku cha kutafuta kuweka eneo lako la utoaji",
    useMyLocation: "Tumia Eneo Langu",
    locating: "Inatafuta...",
    searchPlaceholder: "Tafuta eneo...",
    markerTitle: "Buruta kuweka eneo lako la utoaji",
    selectedCoordinates: "Koordineti zilizochaguliwa",
    geolocationNotSupported: "Geolocation haiungwi na kivinjari chako",
    errorGettingLocation: "Hitilafu katika kupata eneo lako"
  }
};

export const LocationMapSection = ({ onLocationSelected, initialCoordinates = { lat: -6.7924, lng: 39.2083 } }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialCoordinates);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  
  // Get language from context
  const { language } = useLanguage();
  
  // Get translations based on current language
  const t = translations[language] || translations.en;

  // Load Leaflet scripts and styles
  useEffect(() => {
    // Only load if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      // Load CSS
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCss.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      leafletCss.crossOrigin = '';
      document.head.appendChild(leafletCss);
      
      // Load JS
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      leafletScript.crossOrigin = '';
      leafletScript.onload = () => {
        // Also load the search plugin
        const leafletSearchScript = document.createElement('script');
        leafletSearchScript.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
        leafletSearchScript.onload = () => setMapLoaded(true);
        document.body.appendChild(leafletSearchScript);
        
        // Load search CSS
        const leafletSearchCss = document.createElement('link');
        leafletSearchCss.rel = 'stylesheet';
        leafletSearchCss.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
        document.head.appendChild(leafletSearchCss);
      };
      document.body.appendChild(leafletScript);
    } else {
      setMapLoaded(true);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Function to get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t.geolocationNotSupported);
      return;
    }
    
    setIsLocating(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        // Update the map view and marker position
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 15);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        
        // Update state and notify parent
        setSelectedLocation(newLocation);
        onLocationSelected(newLocation);
        setIsLocating(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationError(`${t.errorGettingLocation}: ${error.message}`);
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Initialize map once script is loaded
  useEffect(() => {
    // If Leaflet is loaded and we have a map container, but no map instance yet
    if (mapLoaded && window.L && mapRef.current && !mapInstanceRef.current) {
      // Initialize the map
      mapInstanceRef.current = L.map(mapRef.current).setView([initialCoordinates.lat, initialCoordinates.lng], 13);
      
      // Add the OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add a marker that can be dragged
      markerRef.current = L.marker([initialCoordinates.lat, initialCoordinates.lng], {
        draggable: true,
        title: t.markerTitle
      }).addTo(mapInstanceRef.current);
      
      // Update coordinates when marker is dragged
      markerRef.current.on('dragend', function(event) {
        const position = markerRef.current.getLatLng();
        const newLocation = {
          lat: position.lat,
          lng: position.lng
        };
        setSelectedLocation(newLocation);
        onLocationSelected(newLocation);
      });
      
      // Add search control
      if (L.Control.Geocoder) {
        const geocoder = L.Control.Geocoder.nominatim();
        
        L.Control.geocoder({
          geocoder: geocoder,
          defaultMarkGeocode: false,
          placeholder: t.searchPlaceholder,
        }).on('markgeocode', function(e) {
          const { center, name } = e.geocode;
          
          // Update marker position
          markerRef.current.setLatLng(center);
          
          // Update location
          const newLocation = {
            lat: center.lat,
            lng: center.lng,
            address: name
          };
          setSelectedLocation(newLocation);
          onLocationSelected(newLocation);
          
          // Center map on the location
          mapInstanceRef.current.fitBounds(e.geocode.bbox);
        }).addTo(mapInstanceRef.current);
      }
      
      // Add location control
      const locationControl = L.control({ position: 'topright' });
      locationControl.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `<a href="#" title="${t.useMyLocation}" role="button" aria-label="${t.useMyLocation}" style="display: flex; justify-content: center; align-items: center; width: 30px; height: 30px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
        </a>`;
        
        div.onclick = function(e) {
          e.preventDefault();
          getCurrentLocation();
          return false;
        };
        
        return div;
      };
      locationControl.addTo(mapInstanceRef.current);
      
      // Handle clicks on the map
      mapInstanceRef.current.on('click', function(e) {
        markerRef.current.setLatLng(e.latlng);
        const newLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng
        };
        setSelectedLocation(newLocation);
        onLocationSelected(newLocation);
      });
    }

    // Update map view if coordinates change and map exists
    if (mapInstanceRef.current && initialCoordinates && markerRef.current) {
      mapInstanceRef.current.setView([initialCoordinates.lat, initialCoordinates.lng], 13);
      markerRef.current.setLatLng([initialCoordinates.lat, initialCoordinates.lng]);
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, initialCoordinates, onLocationSelected, t]);

  return (
    <div className="rounded-md border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{t.deliveryLocation}</h3>
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-500">{t.mapInstructions}</p>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="flex-shrink-0">
            <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>
          {isLocating ? t.locating : t.useMyLocation}
        </button>
      </div>
      
      {locationError && (
        <div className="mb-3 p-2 text-sm text-red-700 bg-red-50 rounded-md">
          {locationError}
        </div>
      )}
      
      <div 
        ref={mapRef}
        className="w-full h-64 md:h-80 rounded-md overflow-hidden"
        style={{ border: '1px solid #e2e8f0' }}
      ></div>
      
      {selectedLocation && (
        <div className="mt-2 text-sm text-gray-700">
          <p>{t.selectedCoordinates}: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};