"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  Battery, 
  Wifi, 
  MapPin, 
  Clock, 
  Wind, 
  ShieldAlert, 
  Activity, 
  AlertTriangle, 
  MessageSquare, 
  Power,
  ChevronRight,
  Monitor,
  Camera,
  Navigation,
  Crosshair,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_TELEMETRY, MOCK_JOBS } from "@/lib/mock-data";
import { StatusBadge, CommandButton, DataCard } from "@/components/ui/altitude-ui";

export default function LiveFlightPage() {
  const [telemetry, setTelemetry] = useState(MOCK_TELEMETRY);
  const [isLive, setIsLive] = useState(true);
  const [comms, setComms] = useState([
    { id: 1, time: "14:21:25", msg: "Pre-flight checks complete. Motors armed.", type: "success" },
    { id: 2, time: "14:21:30", msg: "Mission started. Flight duration timer active.", type: "info" },
    { id: 3, time: "14:21:42", msg: "NOTAM Update: No new conflicts detected.", type: "info" },
    { id: 4, time: "14:21:50", msg: "Altitude change: +20m (AGL 120m)", type: "system" },
    { id: 5, time: "14:22:05", msg: "Gimbal pitch adjusted to -45.0°", type: "system" },
  ]);

  // Simulated live telemetry updates
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        altitude: prev.altitude + (Math.random() - 0.5) * 0.4,
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 0.1),
        battery: Math.max(0, prev.battery - 0.02),
        satellites: Math.floor(prev.satellites + (Math.random() - 0.5) * 0.8),
        timestamp: new Date().toISOString()
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6 overflow-hidden">
      {/* Tactical Status Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-panel border border-border">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
               <div className={cn(
                  "w-3 h-3 rounded-full shadow-[0_0_12px] transition-all",
                  isLive ? "bg-accent shadow-accent animate-pulse" : "bg-text-muted opacity-20"
               )} />
               <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold">Link: {isLive ? 'ESTABLISHED' : 'OFFLINE'}</span>
                  <span className="font-syne font-bold text-xs text-text-primary uppercase tracking-widest mt-1">ALT-25-004 — MISSION ACTIVE</span>
               </div>
            </div>
            
            <div className="h-8 w-[1px] bg-border" />
            
            <div className="flex items-center gap-6">
               <TelemetryHeaderStat icon={Battery} label="Aircraft" value={`${telemetry.battery.toFixed(1)}%`} status={telemetry.battery < 20 ? 'danger' : 'success'} />
               <TelemetryHeaderStat icon={Wifi} label="Signal" value={`${telemetry.signalStrength}%`} />
               <TelemetryHeaderStat icon={Clock} label="Mission Time" value="00:14:22" />
               <TelemetryHeaderStat icon={Navigation} label="Distance" value="248m" />
            </div>
         </div>
         
         <CommandButton 
            onClick={() => setIsLive(!isLive)}
            variant={isLive ? 'outline' : 'primary'}
            className={cn(isLive && "border-danger text-danger hover:bg-danger/10")}
         >
            <Power size={14} />
            {isLive ? 'Terminate Uplink' : 'Restore Uplink'}
         </CommandButton>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Primary Visual Downlink (PVD) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
           <div className="flex-1 card-elevated p-0 overflow-hidden relative bg-void border-accent/20 group">
              {/* Cinematic Scanlines */}
              <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-scan-line" />
              
              {/* HUD Elements */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none z-40">
                 <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-6">
                       <HudReadout label="Pitch" value={`${(Math.random() * 2).toFixed(1)}°`} />
                       <HudReadout label="Roll" value={`${(Math.random() * 1).toFixed(1)}°`} />
                       <HudReadout label="Yaw" value="142°" />
                    </div>
                    <div className="flex flex-col gap-6 text-right">
                       <HudReadout label="Wind" value="4.2m/s" align="right" />
                       <HudReadout label="Temp" value="14°C" align="right" />
                       <HudReadout label="Sat" value={telemetry.satellites} align="right" />
                    </div>
                 </div>

                 {/* Center Crosshair */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-48 h-48 border border-accent/10 rounded-full flex items-center justify-center">
                       <div className="w-12 h-[1px] bg-accent/40 absolute left-0" />
                       <div className="w-12 h-[1px] bg-accent/40 absolute right-0" />
                       <div className="h-12 w-[1px] bg-accent/40 absolute top-0" />
                       <div className="h-12 w-[1px] bg-accent/40 absolute bottom-0" />
                       <div className="w-1.5 h-1.5 bg-accent/60 rounded-full" />
                    </div>
                 </div>

                 <div className="flex justify-between items-end">
                    <div className="bg-void/60 backdrop-blur-md border border-accent/20 p-4 min-w-[200px]">
                       <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold">Telemetry Vector</span>
                       <div className="flex gap-6 mt-2">
                          <HudValue label="LAT" value={telemetry.gpsLat.toFixed(5)} />
                          <HudValue label="LNG" value={telemetry.gpsLng.toFixed(5)} />
                       </div>
                    </div>
                    
                    <div className="bg-void/60 backdrop-blur-md border border-accent/20 p-4 text-right">
                       <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold">Altitude AGL</span>
                       <div className="text-3xl font-syne font-black text-accent tabular-nums tracking-tighter mt-1">
                          {telemetry.altitude.toFixed(1)}m
                       </div>
                    </div>
                 </div>
              </div>

              {/* Mock Downlink Background */}
              <div className="absolute inset-0 flex items-center justify-center text-accent/5">
                 <Monitor size={120} strokeWidth={0.5} />
              </div>
              
              {/* HUD Frame Decorative */}
              <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-accent/5 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-accent/5 to-transparent" />
           </div>

           {/* Telemetry Strip */}
           <div className="grid grid-cols-4 gap-4">
              <TelemetryBox label="Ground Speed" value={`${telemetry.speed.toFixed(1)} m/s`} icon={Activity} />
              <TelemetryBox label="Vertical Speed" value="+0.4 m/s" icon={Activity} />
              <TelemetryBox label="Home Distance" value="248m" icon={MapPin} />
              <TelemetryBox label="Gimbal Mode" value="FOLLOW" icon={Camera} />
           </div>
        </div>

        {/* Tactical Ops Panel */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
           {/* Restricted Zone Warning */}
           <DataCard className="bg-danger/5 border-danger/30 overflow-hidden relative">
              <div className="absolute -right-4 -top-4 opacity-5">
                 <ShieldAlert size={120} className="text-danger" />
              </div>
              <div className="flex items-center gap-3 mb-4">
                 <AlertTriangle size={18} className="text-danger" />
                 <h4 className="font-syne font-bold text-xs text-danger uppercase tracking-widest">Airspace Conflict</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-text-secondary uppercase">Restricted Zone</span>
                    <span className="text-danger font-bold">FRZ-4410 (MANCHESTER)</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-text-secondary uppercase">Vector Proximity</span>
                    <span className="text-danger font-bold">184m SE</span>
                 </div>
                 <div className="h-[1px] bg-danger/20" />
                 <p className="text-[10px] font-mono text-danger leading-relaxed uppercase">
                    WARNING: Approaching mandatory exclusion zone. Autonomous return-to-home initiated in 24 seconds.
                 </p>
              </div>
           </DataCard>

           {/* Operations Communication Log */}
           <div className="flex-1 card-elevated p-0 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border bg-background-secondary/50 flex items-center justify-between">
                 <h4 className="font-syne font-bold text-xs uppercase tracking-widest">Operations Log</h4>
                 <MessageSquare size={14} className="text-text-muted" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {comms.map(item => (
                   <div key={item.id} className="flex gap-4">
                      <span className="font-mono text-[9px] text-text-muted shrink-0 mt-0.5">{item.time}</span>
                      <p className={cn(
                        "text-[10px] font-mono leading-relaxed uppercase tracking-tighter",
                        item.type === 'success' ? 'text-success' : item.type === 'danger' ? 'text-danger' : item.type === 'info' ? 'text-accent' : 'text-text-secondary'
                      )}>
                        {item.msg}
                      </p>
                   </div>
                 ))}
              </div>
              <div className="p-3 border-t border-border">
                 <div className="relative">
                    <input 
                       type="text" 
                       placeholder="BROADCAST COMMAND..." 
                       className="w-full bg-void border border-border px-4 py-2 text-[10px] font-mono focus:border-accent outline-none"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent">
                       <ChevronRight size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryHeaderStat({ icon: Icon, label, value, status }: any) {
  return (
    <div className="flex items-center gap-3">
       <Icon size={14} className={cn(status === 'danger' ? 'text-danger' : 'text-text-muted')} />
       <div className="flex flex-col">
          <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest leading-none">{label}</span>
          <span className={cn(
             "font-mono text-[10px] font-bold mt-1",
             status === 'danger' ? 'text-danger' : 'text-text-primary'
          )}>{value}</span>
       </div>
    </div>
  );
}

function HudReadout({ label, value, align = 'left' }: any) {
  return (
    <div className={cn("flex flex-col", align === 'right' ? 'items-end' : 'items-start')}>
       <span className="font-mono text-[9px] text-accent/40 uppercase tracking-widest">{label}</span>
       <span className="font-mono text-base font-bold text-accent/80 tabular-nums">{value}</span>
    </div>
  );
}

function HudValue({ label, value }: any) {
  return (
    <div className="flex flex-col">
       <span className="font-mono text-[8px] text-accent/40 uppercase tracking-widest">{label}</span>
       <span className="font-mono text-[10px] text-accent font-bold tabular-nums leading-none mt-0.5">{value}</span>
    </div>
  );
}

function TelemetryBox({ label, value, icon: Icon }: any) {
  return (
    <div className="card py-3 px-4 flex items-center justify-between bg-panel/40 border-border/40">
       <div className="flex flex-col">
          <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
          <span className="font-mono text-sm font-bold text-text-primary tabular-nums mt-0.5">{value}</span>
       </div>
       <Icon size={16} className="text-text-muted opacity-30" />
    </div>
  );
}
