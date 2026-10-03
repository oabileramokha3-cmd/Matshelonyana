import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Job } from '../types';
import { Play, Pause, Navigation, Gauge, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface MapViewProps {
  job: Job;
  onUpdateDriverLocation?: (coords: [number, number], speedKmH: number, progressPercent: number) => void;
  isDriverView?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  job,
  onUpdateDriverLocation,
  isDriverView = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const animIntervalRef = useRef<number | null>(null);

  const [isSimulating, setIsSimulating] = useState<boolean>(job.currentStatus === 'in_transit');
  const [currentProgress, setCurrentProgress] = useState<number>(job.routeProgressPercent || 50);
  const [currentSpeed, setCurrentSpeed] = useState<number>(job.currentSpeedKmH || 48);

  const pickupCoords = job.pickup.coords;
  const dropoffCoords = job.dropoff.coords;

  // Generate intermediate route path points between pickup and dropoff
  const generateRouteWaypoints = (): [number, number][] => {
    const p1 = pickupCoords;
    const p2 = dropoffCoords;
    const waypoints: [number, number][] = [];
    const steps = 30;
    
    // Add realistic road curve deviation
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Slight bezier arch to mimic A1 / city roads
      const arch = Math.sin(t * Math.PI) * 0.015;
      const lat = p1[0] + (p2[0] - p1[0]) * t + arch * 0.6;
      const lng = p1[1] + (p2[1] - p1[1]) * t + arch * 1.2;
      waypoints.push([lat, lng]);
    }
    return waypoints;
  };

  const waypoints = generateRouteWaypoints();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([
      (pickupCoords[0] + dropoffCoords[0]) / 2,
      (pickupCoords[1] + dropoffCoords[1]) / 2,
    ], 13);

    // CartoDB Voyager tiles (clean, high contrast, crisp modern cartography)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // Add minimal custom zoom buttons
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Custom HTML DivIcon for Pickup (Botswana Sky Blue Theme)
    const pickupIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-sky-500 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-[10px] font-semibold text-white px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
            Pickup
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Custom HTML DivIcon for Dropoff (Botswana Midnight Black Theme)
    const dropoffIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="w-8 h-8 rounded-full bg-slate-950 border-2 border-white shadow-lg flex items-center justify-center text-white">
            <svg class="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div class="absolute -bottom-5 bg-slate-900/90 text-[10px] font-semibold text-sky-300 px-1.5 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
            Destination
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Custom Moving Truck Icon
    const truckIcon = L.divIcon({
      className: 'custom-truck-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-12 h-12 rounded-full bg-sky-500/25 animate-ping"></span>
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 border-2 border-white shadow-2xl flex items-center justify-center text-white transform hover:scale-110 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
          </div>
          <div class="absolute -top-7 bg-sky-950/95 text-[11px] font-bold text-sky-200 px-2 py-0.5 rounded-full border border-sky-500/40 shadow-lg whitespace-nowrap flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ${job.assignedDriver?.truckPlate || 'B 492 BAZ'}
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Add pickup and dropoff markers
    L.marker(pickupCoords, { icon: pickupIcon }).addTo(map);
    L.marker(dropoffCoords, { icon: dropoffIcon }).addTo(map);

    // Add Route Polyline with dual styling (casing + core)
    L.polyline(waypoints, {
      color: '#0f172a',
      weight: 8,
      opacity: 0.5,
      lineCap: 'round',
    }).addTo(map);

    const activeRoute = L.polyline(waypoints, {
      color: '#0284c7', // Sky blue
      weight: 5,
      opacity: 0.95,
      dashArray: '1, 10',
      lineCap: 'round',
    }).addTo(map);
    routeLineRef.current = activeRoute;

    // Calculate initial truck position based on progress
    const initIdx = Math.min(
      Math.floor((currentProgress / 100) * (waypoints.length - 1)),
      waypoints.length - 1
    );
    const initialTruckCoords = waypoints[initIdx];

    const truckMarker = L.marker(initialTruckCoords, {
      icon: truckIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    truckMarkerRef.current = truckMarker;
    mapInstanceRef.current = map;

    // Fit bounds smoothly with padding
    const group = L.featureGroup([
      L.marker(pickupCoords),
      L.marker(dropoffCoords),
      truckMarker,
    ]);
    map.fitBounds(group.getBounds(), { padding: [50, 50] });

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [job.id]);

  // Live GPS simulation loop
  useEffect(() => {
    if (!isSimulating) {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      return;
    }

    animIntervalRef.current = window.setInterval(() => {
      setCurrentProgress((prev) => {
        const next = prev >= 100 ? 5 : prev + 1.2;
        const index = Math.min(
          Math.floor((next / 100) * (waypoints.length - 1)),
          waypoints.length - 1
        );
        const nextCoords = waypoints[index];

        if (truckMarkerRef.current) {
          truckMarkerRef.current.setLatLng(nextCoords);
        }

        // Random realistic speed fluctuation between 45 and 65 km/h
        const jitterSpeed = Math.floor(48 + Math.sin(Date.now() / 1500) * 12);
        setCurrentSpeed(jitterSpeed);

        if (onUpdateDriverLocation) {
          onUpdateDriverLocation(nextCoords, jitterSpeed, Math.round(next));
        }

        return next;
      });
    }, 1200);

    return () => {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [isSimulating, waypoints]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const centerOnTruck = () => {
    if (mapInstanceRef.current && truckMarkerRef.current) {
      mapInstanceRef.current.panTo(truckMarkerRef.current.getLatLng(), {
        animate: true,
        duration: 0.8,
      });
    }
  };

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
      {/* The Leaflet container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating GPS HUD Telemetry Overlay (Botswana Flag Sky Blue & Black styling) */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-[400] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pointer-events-none">
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-between sm:justify-start gap-4 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-sky-400">Live GPS Radar</p>
              <p className="text-xs font-semibold text-slate-200 truncate max-w-[150px] sm:max-w-[200px]">
                {job.assignedDriver?.truckPlate || 'Toyota Hilux Bakkie'}
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>{currentSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>ETA {Math.max(1, Math.round((100 - currentProgress) * 0.22))}m</span>
            </div>
          </div>
        </div>

        {/* Quick Location & Security Verified Marker */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl shadow-lg pointer-events-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Botswana A1 Route Protected</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-3 left-3 z-[400] flex items-center gap-2">
        <button
          onClick={toggleSimulation}
          className="flex items-center gap-2 px-3 py-2 bg-slate-950/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold rounded-xl border border-slate-700 shadow-xl transition-all active:scale-95"
          title="Toggle live telemetry simulation"
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span>Pause Sim</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Play Sim</span>
            </>
          )}
        </button>

        <button
          onClick={centerOnTruck}
          className="flex items-center gap-1.5 px-3 py-2 bg-sky-600/90 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-xl transition-all active:scale-95"
          title="Center on Truck"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Recenter Truck</span>
        </button>

        <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300 font-mono tabular-nums hidden sm:flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Progress</span>
          <span className="font-bold text-sky-400">{Math.round(currentProgress)}%</span>
        </div>
      </div>

      {/* Progress Line Bar at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 z-[400]">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-sky-300 transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
};
