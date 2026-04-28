"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, 
  Layers, 
  MousePointer2, 
  Map as MapIcon, 
  ShieldAlert, 
  Wind, 
  Cloud, 
  Zap, 
  ChevronRight, 
  Save, 
  Plus, 
  Trash2, 
  Camera,
  Activity,
  Maximize2,
  Settings,
  ChevronLeft,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge } from "@/components/ui/altitude-ui";
import { MOCK_FLIGHT_PLAN, MOCK_SHOT_LIST } from "@/lib/mock-data";

export default function FlightPlannerPage() {
  const [activeTab, setActiveTab] = useState("waypoints");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      {/* Flight Control Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-panel border border-border">
        <div className="flex items-center gap-8">
           <div className="flex flex-col">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-[0.2em]">Mission Target</span>
              <span className="font-syne font-bold text-xs text-text-primary uppercase tracking-widest mt-1">ALT-25-004 — Peak District Mapping</span>
           </div>
           <div className="h-8 w-[1px] bg-border" />
           <div className="flex items-center gap-6">
              <TelemetryStat label="Total Dist" value="2.4 km" />
              <TelemetryStat label="Estimated Time" value="18:42" />
              <TelemetryStat label="Batteries Req" value="2 x TB65" />
              <TelemetryStat label="Capture Count" value="142 JPG" />
           </div>
        </div>
        
        <div className="flex gap-3">
           <CommandButton variant="ghost">Simulate Mission</CommandButton>
           <CommandButton variant="primary"><Save size={14} /> Commit to Aircraft</CommandButton>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Mapbox Engine Container */}
        <div className="flex-1 relative card-elevated p-0 overflow-hidden bg-background">
           {/* Mock Map Background */}
           <div className="absolute inset-0 bg-[#080A0F]">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                 backgroundImage: `radial-gradient(circle at 1px 1px, #1E2640 1px, transparent 0)`,
                 backgroundSize: '40px 40px'
              }} />
              <div className="absolute inset-0 flex items-center justify-center text-accent/10">
                 <MapIcon size={120} strokeWidth={0.5} />
              </div>
           </div>

           {/* Map HUD Overlays */}
           <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-2 pointer-events-auto">
                    <MapToolButton icon={Navigation} active />
                    <MapToolButton icon={Layers} />
                    <MapToolButton icon={MousePointer2} />
                    <MapToolButton icon={Maximize2} />
                 </div>
                 
                 <div className="pointer-events-auto">
                    <DataCard className="py-3 px-4 bg-background/80 backdrop-blur-xl border-accent/20 min-w-[200px]">
                       <h5 className="font-mono text-[9px] text-accent uppercase tracking-widest mb-3">Environmental Intelligence</h5>
                       <div className="space-y-3">
                          <EnvStat label="Wind Speed" value="4.2 m/s NW" icon={Wind} />
                          <EnvStat label="Cloud Base" value="2,400 ft" icon={Cloud} />
                          <EnvStat label="Visibilty" value="> 10 km" />
                          <div className="h-[1px] bg-border my-2" />
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                             <span className="font-mono text-[9px] text-text-primary uppercase tracking-widest">Airmap Clearance: OK</span>
                          </div>
                       </div>
                    </DataCard>
                 </div>
              </div>

              <div className="flex justify-between items-end">
                 <div className="pointer-events-auto">
                    <DataCard className="py-3 px-4 bg-background/80 backdrop-blur-xl border-danger/20 flex items-center gap-4">
                       <ShieldAlert size={16} className="text-danger" />
                       <div className="flex flex-col">
                          <span className="font-mono text-[9px] text-danger uppercase tracking-widest font-bold">FRZ Active Conflict</span>
                          <span className="font-mono text-[8px] text-text-muted uppercase">EG D207 — Proximity 140m SE</span>
                       </div>
                    </DataCard>
                 </div>
                 
                 <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-xl border border-border">
                    <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Cursor Pos</span>
                    <span className="font-mono text-[10px] text-text-primary tabular-nums">53.479201, -2.290142</span>
                 </div>
              </div>
           </div>

           {/* Waypoint Markers (Mock) */}
           <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-40">
                 <path d="M 400 300 L 600 200 L 800 400" stroke="var(--accent)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                 <circle cx="400" cy="300" r="4" fill="var(--accent)" />
                 <circle cx="600" cy="200" r="4" fill="var(--accent)" />
                 <circle cx="800" cy="400" r="4" fill="var(--accent)" />
              </svg>
           </div>
        </div>

        {/* Tactical Mission Panel */}
        <motion.div 
          animate={{ width: sidebarCollapsed ? 0 : 380, opacity: sidebarCollapsed ? 0 : 1 }}
          className="flex flex-col gap-6 overflow-hidden"
        >
          <div className="flex-1 card-elevated p-0 flex flex-col overflow-hidden">
             <div className="flex border-b border-border bg-background-secondary/50">
                <button 
                  onClick={() => setActiveTab("waypoints")}
                  className={cn(
                    "flex-1 py-4 text-[10px] font-mono uppercase tracking-widest transition-all border-b-2",
                    activeTab === "waypoints" ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
                  )}
                >
                  Waypoints
                </button>
                <button 
                  onClick={() => setActiveTab("shots")}
                  className={cn(
                    "flex-1 py-4 text-[10px] font-mono uppercase tracking-widest transition-all border-b-2",
                    activeTab === "shots" ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
                  )}
                >
                  Shot List
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence mode="wait">
                   {activeTab === "waypoints" ? (
                     <motion.div 
                      key="wp"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-2"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Sequence Order</span>
                           <button className="text-accent text-[9px] font-mono uppercase tracking-widest hover:underline flex items-center gap-1">
                              <Plus size={10} /> Add Waypoint
                           </button>
                        </div>
                        {MOCK_FLIGHT_PLAN.waypoints.map((wp, i) => (
                           <WaypointCard key={i} wp={wp} index={i} />
                        ))}
                     </motion.div>
                   ) : (
                     <motion.div 
                      key="shots"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-4"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Active Capture Protocols</span>
                        </div>
                        {MOCK_SHOT_LIST.map((shot, i) => (
                           <ShotCard key={i} shot={shot} index={i} />
                        ))}
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
             
             <div className="p-4 border-t border-border bg-panel">
                <div className="p-3 bg-accent/5 border border-accent/20 mb-4">
                   <p className="text-[9px] text-accent/80 font-mono leading-relaxed uppercase">
                      Aircraft Link: **Ready** <br />
                      Flight Path: **Validated** <br />
                      Signal Link: **Encryption Active**
                   </p>
                </div>
                <CommandButton variant="primary" className="w-full justify-center">
                   Execute Pre-Flight Protocol
                </CommandButton>
             </div>
          </div>
        </motion.div>

        {/* Sidebar Toggle Handle */}
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-4 h-full flex flex-col items-center justify-center border border-border bg-panel hover:bg-accent/5 hover:border-accent transition-all group"
        >
          {sidebarCollapsed ? <ChevronLeft size={12} className="text-accent" /> : <ChevronRight size={12} className="text-border group-hover:text-accent" />}
        </button>
      </div>
    </div>
  );
}

function TelemetryStat({ label, value }: any) {
  return (
    <div className="flex flex-col">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="font-mono text-xs font-bold text-accent tabular-nums mt-0.5">{value}</span>
    </div>
  );
}

function MapToolButton({ icon: Icon, active }: any) {
  return (
    <button className={cn(
      "w-10 h-10 flex items-center justify-center border transition-all",
      active ? "bg-accent border-accent text-background shadow-[0_0_15px_rgba(0,212,255,0.4)]" : "bg-panel border-border text-text-muted hover:text-text-primary hover:border-accent"
    )}>
       <Icon size={16} />
    </button>
  );
}

function EnvStat({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
          {Icon && <Icon size={12} className="text-text-muted" />}
          <span className="font-mono text-[9px] text-text-muted uppercase">{label}</span>
       </div>
       <span className="font-mono text-[9px] text-text-primary font-bold uppercase">{value}</span>
    </div>
  );
}

function WaypointCard({ wp, index }: any) {
  return (
    <div className="p-3 bg-panel/50 border border-border hover:border-accent/40 transition-all group cursor-pointer flex items-center justify-between">
       <div className="flex items-center gap-4">
          <div className="w-6 h-6 border border-border flex items-center justify-center text-[10px] font-mono font-bold group-hover:text-accent group-hover:border-accent">
             {index + 1}
          </div>
          <div className="flex flex-col">
             <span className="font-mono text-[9px] font-bold text-text-primary uppercase tracking-widest">{wp.action}</span>
             <div className="flex items-center gap-3 font-mono text-[8px] text-text-muted uppercase">
                <span>Alt: {wp.altitude}m</span>
                <span>Spd: {wp.speed}m/s</span>
             </div>
          </div>
       </div>
       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:text-accent"><Settings size={12} /></button>
          <button className="p-1 hover:text-danger"><Trash2 size={12} /></button>
       </div>
    </div>
  );
}

function ShotCard({ shot, index }: any) {
  return (
    <div className="p-3 bg-panel/50 border border-border hover:border-accent/40 transition-all group cursor-pointer space-y-2">
       <div className="flex items-center justify-between">
          <div className="flex flex-col">
             <span className="font-mono text-[8px] text-accent uppercase tracking-[0.2em] font-bold">Shot Protocol {index + 1}</span>
             <span className="font-syne text-[11px] font-bold text-text-primary uppercase tracking-tight">{shot.shotType}</span>
          </div>
          <StatusBadge status={shot.status} type="default" />
       </div>
       <div className="pt-2 border-t border-border/20 flex items-center justify-between font-mono text-[8px] text-text-muted uppercase">
          <span>{shot.settings.resolution} • {shot.camera}</span>
          <span className="text-accent/60">Linked to WP {shot.index}</span>
       </div>
    </div>
  );
}
