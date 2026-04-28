"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Map, Source, Layer, NavigationControl, ScaleControl, Marker } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Wind, 
  Battery, 
  Wifi, 
  Satellite, 
  Navigation, 
  Maximize2, 
  Camera, 
  Video, 
  AlertTriangle, 
  Play, 
  Square, 
  Plus, 
  MessageSquare,
  Clock,
  Compass,
  Map as MapIcon,
  Activity,
  History,
  CheckCircle2,
  XCircle,
  FileUp,
  Download
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";
import { TelemetryData, FlightEvent } from "@/lib/integrations/dji-cloud";
import { getLiveWeather } from "@/app/actions/weather";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoicGV0ZWFsdGl0dWRlIiwiYSI6ImNsdzR1ZzNxejBwYTMyaW93ZzN6ZzN6ZzYifQ.Placeholder";

export default function LiveCockpitPage({ params }: { params: { jobId: string } }) {
  const mapRef = useRef<MapRef>(null);
  const [isLive, setIsLive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [events, setEvents] = useState<FlightEvent[]>([]);
  const [weather, setWeather] = useState({
    temp: 14.5,
    windSpeed: 4.2,
    windDir: "NW",
    visibility: 10000,
    condition: "Clear"
  });
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    latitude: 53.4792,
    longitude: -2.2901,
    altitude: 0,
    speed: 0,
    heading: 0,
    battery: 100,
    signal: 5,
    gpsSatellites: 0,
    gimbalPitch: 0,
    flightMode: "STNDBY",
    timestamp: new Date().toISOString()
  });

  const [flownPath, setFlownPath] = useState<[number, number][]>([]);
  const job = MOCK_JOBS.find(j => j.id === params.jobId) || MOCK_JOBS[0];

  // Weather Sync Loop
  useEffect(() => {
    const updateWeather = async () => {
      const result = await getLiveWeather(telemetry.latitude, telemetry.longitude);
      if (result.success) {
        setWeather(result.data as any);
      }
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 300000); // 5 mins
    return () => clearInterval(weatherInterval);
  }, [telemetry.latitude, telemetry.longitude]);

  // Simulated Telemetry Loop
  useEffect(() => {
    let interval: any;
    if (isLive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Simulating drone movement along a small path
        setTelemetry(prev => {
           const newLat = prev.latitude + (Math.random() - 0.5) * 0.0001;
           const newLng = prev.longitude + (Math.random() - 0.5) * 0.0001;
           const newAlt = Math.min(60, prev.altitude + 1);
           const newBatt = Math.max(0, prev.battery - 0.1);
           
           const newData = {
              ...prev,
              latitude: newLat,
              longitude: newLng,
              altitude: newAlt,
              speed: 4.5 + Math.random(),
              battery: newBatt,
              gpsSatellites: 22 + Math.floor(Math.random() * 4),
              timestamp: new Date().toISOString()
           };

           setFlownPath(prevPath => [...prevPath, [newLng, newLat]]);
           return newData;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const addEvent = (type: string, note?: string) => {
    const newEvent: FlightEvent = {
      id: Math.random().toString(),
      type,
      timestamp: new Date().toISOString(),
      lat: telemetry.latitude,
      lng: telemetry.longitude,
      note,
      user: "Pilot-In-Command"
    };
    setEvents([newEvent, ...events]);
  };

  return (
    <div className="fixed inset-0 pt-20 pl-[72px] bg-void flex overflow-hidden">
      {/* Left: Telemetry Stack */}
      <div className="w-[300px] bg-panel border-r border-border flex flex-col z-50">
         <div className="p-6 border-b border-border bg-background-secondary/50">
            <div className="flex items-center justify-between mb-2">
               <span className="font-mono text-[9px] text-accent uppercase tracking-[0.2em]">Telemetry Link</span>
               <StatusBadge status={isLive ? "LIVE" : "DISCONNECTED"} type={isLive ? "success" : "danger"} />
            </div>
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest">{job.reference} // COCKPIT</h4>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
               <TelemetryBox label="Altitude (AGL)" value={`${telemetry.altitude.toFixed(1)}m`} />
               <TelemetryBox label="Ground Speed" value={`${telemetry.speed.toFixed(1)}m/s`} />
               <TelemetryBox label="Distance" value="142m" />
               <TelemetryBox label="Bearing" value={`${telemetry.heading}°`} />
            </div>

            <div className="space-y-4">
               <TelemetryStrip 
                 label="Battery Status" 
                 value={`${Math.round(telemetry.battery)}%`} 
                 progress={telemetry.battery}
                 color={telemetry.battery < 15 ? "text-danger" : telemetry.battery < 30 ? "text-warning" : "text-success"}
                 icon={Battery}
               />
               <TelemetryStrip label="Uplink Signal" value="EXCELLENT" progress={telemetry.signal * 20} icon={Wifi} color="text-accent" />
               <TelemetryStrip label="GPS Satellites" value={telemetry.gpsSatellites.toString()} progress={(telemetry.gpsSatellites / 32) * 100} icon={Satellite} color="text-text-primary" />
            </div>

            <div className="h-[1px] bg-border" />

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Flight Time</span>
                  <span className="font-mono text-xl font-black text-accent">{Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Flight Mode</span>
                  <span className="font-mono text-xs font-bold text-text-primary uppercase">{telemetry.flightMode}</span>
               </div>
            </div>

            {/* Weather Overlay */}
            <DataCard className="p-4 bg-background-secondary border-border/40">
               <div className="flex items-center gap-2 mb-3">
                  <Wind size={14} className="text-accent" />
                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Site Weather</span>
               </div>
               <div className="space-y-2">
                   <div className="flex justify-between"><span className="text-[9px] font-mono text-text-muted uppercase">Wind</span><span className="text-[9px] font-mono text-text-primary">{weather.windSpeed}m/s {weather.windDir}</span></div>
                   <div className="flex justify-between"><span className="text-[9px] font-mono text-text-muted uppercase">Visibility</span><span className="text-[9px] font-mono text-text-primary">{weather.visibility >= 10000 ? ">10km" : `${(weather.visibility / 1000).toFixed(1)}km`}</span></div>
                   <div className="flex justify-between"><span className="text-[9px] font-mono text-text-muted uppercase">Temp</span><span className="text-[9px] font-mono text-text-primary">{weather.temp.toFixed(1)}°C</span></div>
               </div>
            </DataCard>
         </div>
      </div>

      {/* Main Map View */}
      <div className="flex-1 relative">
         <Map
           ref={mapRef}
           initialViewState={{
             latitude: 53.4792,
             longitude: -2.2901,
             zoom: 17,
             pitch: 0
           }}
           mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
           mapboxAccessToken={MAPBOX_TOKEN}
         >
            {/* Flown Path Trail */}
            <Source id="flown-path" type="geojson" data={{
               type: "Feature",
               geometry: {
                  type: "LineString",
                  coordinates: flownPath
               }
            }}>
               <Layer 
                id="trail-line" 
                type="line" 
                paint={{ 'line-color': '#00FF00', 'line-width': 3, 'line-opacity': 0.6 }} 
               />
            </Source>

            {/* Drone Marker */}
            <Marker latitude={telemetry.latitude} longitude={telemetry.longitude} anchor="center">
               <motion.div 
                 animate={{ rotate: telemetry.heading }}
                 className="relative"
               >
                  <div className="w-8 h-8 bg-accent shadow-[0_0_20px_var(--accent)] flex items-center justify-center rounded-sm">
                     <Navigation size={18} className="text-background" />
                  </div>
                  {/* Heading Indicator */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[1px] h-8 bg-accent" />
               </motion.div>
            </Marker>

            {/* Home Point */}
            <Marker latitude={53.4792} longitude={-2.2901} anchor="bottom">
               <div className="flex flex-col items-center">
                  <div className="px-2 py-1 bg-panel border border-border text-[8px] font-mono text-text-primary uppercase mb-1">HOME</div>
                  <div className="w-3 h-3 bg-white rounded-full border-2 border-accent" />
               </div>
            </Marker>

            <NavigationControl position="bottom-right" className="!mr-6 !mb-24" />
         </Map>

         {/* Bottom Session Controls */}
         <div className="absolute bottom-0 inset-x-0 h-20 bg-panel/90 backdrop-blur-2xl border-t border-border flex items-center justify-between px-10 z-50">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-2 rounded-full", isLive ? "bg-success animate-pulse" : "bg-text-muted")} />
                  <span className="font-mono text-[10px] text-text-primary uppercase tracking-[0.2em]">{isLive ? "TRANSMITTING" : "STANDBY"}</span>
               </div>
               <div className="h-8 w-[1px] bg-border" />
               <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Pilot Certification</span>
                  <span className="font-mono text-[10px] text-text-primary font-bold uppercase">GVC-2024-4412 // Marcus Webb</span>
               </div>
            </div>

            <div className="flex gap-4">
               {!isLive ? (
                  <CommandButton 
                    variant="primary" 
                    className="py-3 px-10 bg-success border-success text-white hover:bg-success/80 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                    onClick={() => setIsLive(true)}
                  >
                     <Play size={16} /> START FLIGHT SESSION
                  </CommandButton>
               ) : (
                  <CommandButton 
                    variant="primary" 
                    className="py-3 px-10 bg-danger border-danger text-white hover:bg-danger/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    onClick={() => setIsLive(false)}
                  >
                     <Square size={16} /> END FLIGHT SESSION
                  </CommandButton>
               )}
            </div>
         </div>
      </div>

      {/* Right: Event Log */}
      <div className="w-[320px] bg-panel border-l border-border flex flex-col z-50">
         <div className="p-6 border-b border-border bg-background-secondary/50">
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest">Flight Event Log</h4>
         </div>
         
         {/* One-tap Event Buttons */}
         <div className="p-4 grid grid-cols-2 gap-2 border-b border-border">
            <EventButton icon={Camera} label="Photo" onClick={() => addEvent("PHOTO")} />
            <EventButton icon={Video} label="Video" onClick={() => addEvent("VIDEO")} />
            <EventButton icon={Zap} label="Batt Swap" onClick={() => addEvent("BATTERY_CHANGE")} />
            <EventButton icon={Activity} label="Pos Hold" onClick={() => addEvent("HOLD")} />
            <EventButton icon={AlertTriangle} label="Incident" color="text-danger" onClick={() => addEvent("INCIDENT")} />
            <EventButton icon={MessageSquare} label="Note" onClick={() => addEvent("NOTE")} />
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {events.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-30 text-center p-8">
                  <History size={32} className="mb-4" />
                  <p className="font-mono text-[9px] uppercase tracking-widest">No events recorded <br /> for this session</p>
               </div>
            ) : (
               <div className="divide-y divide-border/40">
                  {events.map((event) => (
                     <div key={event.id} className="p-4 space-y-2 hover:bg-white/5 transition-colors group">
                        <div className="flex justify-between items-start">
                           <span className={cn(
                              "font-mono text-[10px] font-bold uppercase",
                              event.type === 'INCIDENT' ? "text-danger" : "text-accent"
                           )}>{event.type}</span>
                           <span className="font-mono text-[8px] text-text-muted">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="font-mono text-[8px] text-text-muted uppercase">COORDS: {event.lat.toFixed(4)}, {event.lng.toFixed(4)}</span>
                           <span className="font-mono text-[9px] text-text-primary uppercase tracking-tight">{event.user}</span>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         <div className="p-4 bg-background-secondary/30 border-t border-border">
            <CommandButton variant="ghost" className="w-full justify-center text-[10px]"><Download size={12} /> Export Session Log</CommandButton>
         </div>
      </div>
    </div>
  );
}

function TelemetryBox({ label, value }: any) {
  return (
    <div className="p-4 bg-background-secondary border border-border">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest block mb-1">{label}</span>
       <span className="font-mono text-lg font-black text-text-primary tracking-tighter">{value}</span>
    </div>
  );
}

function TelemetryStrip({ label, value, progress, color, icon: Icon }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
             <Icon size={12} className="text-text-muted" />
             <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{label}</span>
          </div>
          <span className={cn("font-mono text-[10px] font-bold", color)}>{value}</span>
       </div>
       <div className="h-1 bg-void w-full relative">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }} 
            className={cn("h-full", color.replace('text-', 'bg-'))} 
          />
       </div>
    </div>
  );
}

function EventButton({ icon: Icon, label, color = "text-text-primary", onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-panel border border-border hover:border-accent hover:bg-white/5 transition-all text-left group"
    >
       <Icon size={14} className={cn("group-hover:scale-110 transition-transform", color)} />
       <span className="font-mono text-[9px] text-text-muted group-hover:text-text-primary uppercase tracking-widest">{label}</span>
    </button>
  );
}
