"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  Signature, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Plus, 
  Zap, 
  ClipboardList,
  AlertTriangle,
  CheckSquare,
  History,
  FileText
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

export default function JobSheetsPage() {
  const [activeView, setActiveView] = useState("active");

  return (
    <div className="space-y-8 pb-32">
      {/* Compliance Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Regulatory Oversight</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Compliance & Job Sheets</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
             Audit-ready pre-flight documentation, site-specific risk assessments (RAMS) and digital mission sign-offs.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><History size={14} /> Audit Trail</CommandButton>
           <CommandButton variant="primary"><Plus size={14} /> New Compliance Log</CommandButton>
        </div>
      </div>

      {/* Compliance Health Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Awaiting Sign-off</span>
               <div className="flex items-end gap-3 mt-1">
                  <span className="text-3xl font-syne font-black text-warning">4</span>
                  <span className="font-mono text-[9px] text-warning uppercase mb-1.5">Critical</span>
               </div>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">Action required by Chief Pilot</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Compliance Rate</span>
               <div className="flex items-end gap-3 mt-1">
                  <span className="text-3xl font-syne font-black text-success">100%</span>
               </div>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">Q1 Operational Period</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">RA Revisions</span>
               <div className="flex items-end gap-3 mt-1">
                  <span className="text-3xl font-syne font-black text-text-primary">28</span>
               </div>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">Latest: v4.2 (Airspace Update)</p>
            </div>
         </DataCard>

         <DataCard className="bg-success/5 border-success/20">
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-success uppercase tracking-widest">CAA Audit Status</span>
               <div className="flex items-end gap-3 mt-1">
                  <span className="text-2xl font-syne font-black text-success uppercase">Ready</span>
               </div>
               <p className="text-[9px] font-mono text-success/60 mt-2 uppercase">Logs exportable to CSV/PDF</p>
            </div>
         </DataCard>
      </div>

      {/* Logs Table Area */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex border border-border bg-panel">
               <ViewTab label="Pending Review" active={activeView === 'active'} count={4} onClick={() => setActiveView('active')} />
               <ViewTab label="Signed & Locked" active={activeView === 'signed'} count={142} onClick={() => setActiveView('signed')} />
               <ViewTab label="Archive" active={activeView === 'archive'} count={512} onClick={() => setActiveView('archive')} />
            </div>

            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input 
                     type="text" 
                     placeholder="Search logs by ref or pilot..." 
                     className="bg-panel border border-border px-10 py-2 text-[10px] font-mono w-64 focus:border-accent outline-none"
                  />
               </div>
            </div>
         </div>

         <DataCard className="p-0">
            <PremiumTable 
               headers={["Ref", "Mission", "Pilot-In-Command", "Checklist", "Risk Assess", "Signed At", "Actions"]}
               data={MOCK_JOBS.slice(0, 8)}
               renderRow={(log: any) => (
                  <>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-muted uppercase">{log.reference}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col">
                           <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{log.title}</span>
                           <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{log.client.company}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 bg-navy border border-border flex items-center justify-center text-[8px] font-bold">MW</div>
                           <span className="text-[10px] font-mono text-text-secondary">M. Webb</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 bg-success/20 border border-success/40 flex items-center justify-center">
                              <CheckSquare size={8} className="text-success" />
                           </div>
                           <span className="text-[10px] font-mono text-success uppercase">Pass</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <StatusBadge status="REVIEWED" type="success" />
                     </td>
                     <td className="py-4 px-6 font-mono text-[9px] text-text-muted uppercase">
                        {log.status === 'completed' ? formatDate(log.scheduledDate) : 'Awaiting'}
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Download size={14} />
                           </button>
                           <button className="p-2 border border-border bg-accent text-background hover:shadow-[0_0_10px_var(--accent)] transition-all">
                              <FileCheck size={14} />
                           </button>
                        </div>
                     </td>
                  </>
               )}
            />
         </DataCard>
      </div>

      {/* Digital Signature Modal (Placeholder UI) */}
      <SectionPanel title="Protocol Requirement: Site Risk Assessment">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <DataCard className="bg-background-secondary/50 border-dashed border-border">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                     <AlertTriangle size={20} className="text-warning" />
                     <h5 className="font-syne font-bold text-xs uppercase tracking-widest">Active Site Hazards</h5>
                  </div>
                  <div className="space-y-2">
                     <HazardItem label="High Voltage Cables" risk="Medium" mit="Maintain 50m separation" />
                     <HazardItem label="Public Pedestrians" risk="High" mit="Deploy ground observers" />
                     <HazardItem label="Urban Airspace" risk="Low" mit="Notify NATS via AirMap" />
                  </div>
               </div>
            </DataCard>

            <DataCard className="flex flex-col items-center justify-center gap-6 py-12 bg-panel">
               <div className="flex flex-col items-center text-center gap-2">
                  <Signature size={32} className="text-accent opacity-40" />
                  <h5 className="font-syne font-bold text-sm uppercase tracking-widest">Digital Mission Sign-Off</h5>
                  <p className="text-[10px] font-mono text-text-muted uppercase max-w-xs">
                     I confirm that all site hazards have been identified and mitigated as per the GVC Operational Manual.
                  </p>
               </div>
               <div className="w-full max-w-sm h-32 border border-border bg-void relative flex items-center justify-center group cursor-crosshair">
                  <span className="font-mono text-[8px] text-text-muted/20 uppercase tracking-widest group-hover:opacity-100 opacity-0 transition-opacity">Draw Pilot Signature</span>
                  <div className="absolute bottom-2 right-4 flex items-center gap-2">
                     <span className="font-mono text-[8px] text-text-muted">OPERATOR ID: 8841</span>
                  </div>
               </div>
               <div className="flex gap-4 w-full max-w-sm">
                  <CommandButton variant="ghost" className="flex-1">Clear</CommandButton>
                  <CommandButton variant="primary" className="flex-[2]">Lock & Sync Mission</CommandButton>
               </div>
            </DataCard>
         </div>
      </SectionPanel>
    </div>
  );
}

function ViewTab({ label, active, count, onClick }: any) {
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

function HazardItem({ label, risk, mit }: any) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-panel border border-border">
       <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{label}</span>
          <span className={cn(
             "text-[8px] font-bold font-mono px-2 py-0.5 border",
             risk === 'High' ? 'border-danger text-danger bg-danger/5' : risk === 'Medium' ? 'border-warning text-warning bg-warning/5' : 'border-success text-success bg-success/5'
          )}>{risk} Risk</span>
       </div>
       <p className="text-[9px] font-mono text-text-muted uppercase leading-none">{mit}</p>
    </div>
  );
}
