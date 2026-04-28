"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  Battery as BatteryIcon, 
  Settings, 
  AlertTriangle, 
  History, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Activity, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Tool
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";
import { MOCK_EQUIPMENT } from "@/lib/mock-data";

export default function EquipmentPage() {
  const [activeTab, setActiveTab] = useState("fleet");

  return (
    <div className="space-y-8 pb-32">
      {/* Fleet Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Asset Infrastructure</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Fleet & Equipment</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
             Centralised airframe registry, technical maintenance logs and predictive battery health analytics.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><History size={14} /> Service History</CommandButton>
           <CommandButton variant="primary"><Plus size={14} /> Register New Asset</CommandButton>
        </div>
      </div>

      {/* Fleet Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Total Airframes</span>
               <span className="text-2xl font-syne font-black text-text-primary">8 Active</span>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">142.5 Cumulative Flight Hours</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Battery Inventory</span>
               <span className="text-2xl font-syne font-black text-text-primary">42 Cells</span>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">92% Mean Health Index</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Next Service</span>
               <span className="text-2xl font-syne font-black text-warning">12 Days</span>
               <p className="text-[9px] font-mono text-warning uppercase mt-2">Valkyrie-01 (M350 RTK)</p>
            </div>
         </DataCard>

         <DataCard className="bg-accent/5 border-accent/20">
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Fleet Readiness</span>
               <span className="text-2xl font-syne font-black text-accent uppercase">Operational</span>
               <p className="text-[9px] font-mono text-accent/60 mt-2 uppercase">GVC Compliance Valid</p>
            </div>
         </DataCard>
      </div>

      {/* Fleet Table Area */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex border border-border bg-panel">
               <FleetTab label="Airframes" active={activeTab === 'fleet'} count={8} onClick={() => setActiveTab('fleet')} />
               <FleetTab label="Batteries" active={activeTab === 'batteries'} count={42} onClick={() => setActiveTab('batteries')} />
               <FleetTab label="Sensors / Payload" active={activeTab === 'sensors'} count={12} onClick={() => setActiveTab('sensors')} />
            </div>

            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input 
                     type="text" 
                     placeholder="Search serial numbers..." 
                     className="bg-panel border border-border px-10 py-2 text-[10px] font-mono w-48 focus:border-accent outline-none"
                  />
               </div>
            </div>
         </div>

         <DataCard className="p-0">
            <PremiumTable 
               headers={["Asset ID", "Model", "Manufacturer", "Flight Hours", "Last Service", "Status", "Actions"]}
               data={MOCK_EQUIPMENT}
               renderRow={(asset: any) => (
                  <>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-muted uppercase">{asset.serialNumber}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col">
                           <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{asset.name}</span>
                           <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{asset.model}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6 font-mono text-[9px] text-text-muted uppercase">{asset.manufacturer}</td>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-primary">{asset.totalFlightHours}h</td>
                     <td className="py-4 px-6 font-mono text-[9px] text-text-muted uppercase">14/03/24</td>
                     <td className="py-4 px-6">
                        <StatusBadge status={asset.status} type={asset.status === 'OPERATIONAL' ? 'success' : 'warning'} />
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Activity size={14} />
                           </button>
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Settings size={14} />
                           </button>
                        </div>
                     </td>
                  </>
               )}
            />
         </DataCard>
      </div>

      {/* Battery Health Matrix (Placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            <DataCard title="Battery Pulse Matrix" subtitle="Neural Life-Cycle Tracking">
               <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 mt-6">
                  {Array.from({ length: 48 }).map((_, i) => {
                     const health = 85 + Math.random() * 15;
                     return (
                        <div key={i} className="group relative">
                           <div className={cn(
                              "aspect-square border border-border transition-all cursor-pointer",
                              health < 90 ? "bg-warning/20 border-warning/40" : "bg-success/20 border-success/40"
                           )} />
                           <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-panel border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                              <span className="font-mono text-[8px] text-text-primary uppercase">Cell {i+1} — Health: {health.toFixed(1)}%</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
               <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-success/40 border border-success" />
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Healthy (&gt;90%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-warning/40 border border-warning" />
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Degraded (80-90%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-danger/40 border border-danger" />
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Unsafe (&lt;80%)</span>
                  </div>
               </div>
            </DataCard>
         </div>

         <div className="lg:col-span-4">
            <DataCard title="Maintenance Protocol" subtitle="Service Scheduling">
               <div className="mt-6 space-y-4">
                  <div className="p-4 bg-background-secondary border border-border flex items-center gap-4">
                     <div className="w-10 h-10 bg-warning/10 border border-warning/40 flex items-center justify-center text-warning">
                        <AlertTriangle size={18} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-primary uppercase">50-Hour Inspection</span>
                        <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Required: Shadow-04</span>
                     </div>
                  </div>
                  <CommandButton variant="primary" className="w-full justify-center">
                     Initiate Service Record
                  </CommandButton>
               </div>
            </DataCard>
         </div>
      </div>
    </div>
  );
}

function FleetTab({ label, active, count, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 text-[9px] font-mono uppercase tracking-widest transition-all flex items-center gap-3",
        active ? "bg-accent text-background" : "text-text-muted hover:text-text-primary"
      )}
    >
      {label}
      <span className={cn("text-[8px] font-bold", active ? "text-background/60" : "text-accent")}>{count}</span>
    </button>
  );
}
