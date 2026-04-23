import { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";
import { io } from "socket.io-client";
const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const POLL_INTERVAL_MS = 60_000;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const loadGoogleMapsScript = () =>
  new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

export default function TrackingMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [studentCount, setStudentCount] = useState(0);

  const updateMarkers = (locations) => {
    const map = mapInstanceRef.current;
    if (!map) return;
  
    locations.forEach(({ studentId, firstName, lastName, className, latitude, longitude, timestamp }) => {
      const label = `${firstName} ${lastName}`;
      const title = `${label} | כיתה ${className}\n${new Date(timestamp).toLocaleTimeString("he-IL")}`;
  
      if (markersRef.current[studentId]) {
        markersRef.current[studentId].setPosition({ lat: latitude, lng: longitude });
        markersRef.current[studentId].setTitle(title);
      } else {
        markersRef.current[studentId] = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title,
          label: {
            text: firstName.charAt(0),
            color: "#fff",
            fontWeight: "bold",
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#1a73e8",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
            scale: 12,
          },
        });
  
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="font-family:sans-serif;direction:rtl"><strong>${label}</strong><br/>כיתה ${className}<br/><small>${new Date(timestamp).toLocaleTimeString("he-IL")}</small></div>`,
        });
        markersRef.current[studentId].addListener("click", () => {
          infoWindow.open(map, markersRef.current[studentId]);
        });
      }
    });
  
    setStudentCount(Object.keys(markersRef.current).length);
    setLastUpdated(new Date());
  };
  
  const replaceAllMarkers = (locations) => {
    // Delete all existing markers
    Object.keys(markersRef.current).forEach((id) => {
      markersRef.current[id].setMap(null);
      delete markersRef.current[id];
    });
  
    updateMarkers(locations);
  
    // fit bounds only on first load
    if (locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach(({ latitude, longitude }) => bounds.extend({ lat: latitude, lng: longitude }));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await api.get("/location/latest");
      if (data.success) {
        replaceAllMarkers(data.data);
        setError(null);
      }
    } catch (err) {
      setError("שגיאה בטעינת מיקומים");
    }
  };

  useEffect(() => {
    let socket;
  
    loadGoogleMapsScript()
      .then(() => {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: { lat: 31.7683, lng: 35.2137 }, // Jerusalem
          zoom: 13,
          mapTypeId: "roadmap",
          disableDefaultUI: false,
        });
        fetchLocations();
  
        socket = io(SOCKET_URL);
        socket.on("connect", () => {
          fetchLocations();
        });
        socket.on("location:update", (locationData) => {
          updateMarkers([locationData]);
        });
      })
      .catch(() => setError("שגיאה בטעינת Google Maps"));
  
    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          background: "#1a73e8",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          direction: "rtl",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: 18 }}>
          🗺️ מפת מיקום תלמידות
        </span>
        <span style={{ fontSize: 13 }}>
          {studentCount} תלמידות פעילות
          {lastUpdated && ` · עדכון אחרון: ${lastUpdated.toLocaleTimeString("he-IL")}`}
        </span>
      </div>

      {error && (
        <div
          style={{
            background: "#fce8e6",
            color: "#c5221f",
            padding: "10px 20px",
            textAlign: "center",
            direction: "rtl",
          }}
        >
          {error}
        </div>
      )}

      <div ref={mapRef} style={{ flex: 1 }} />
    </div>
  );
}
