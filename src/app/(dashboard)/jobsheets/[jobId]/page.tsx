"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  ShieldCheck, 
  ClipboardCheck, 
  PenTool, 
  AlertTriangle, 
  Save, 
  Plus, 
  Download, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  Clock,
  History,
  Lock,
  User,
  Plane,
  Battery,
  MapPin
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

interface RiskItem {
  id: string;
  hazard: string;
  likelihood: number;
  severity: number;
  mitigation: string;
}

const DEFAULT_RISKS: Record<string, RiskItem[]> = {
  Urban: [
    { id: "1", hazard: "Third-party overflight", likelihood: 3, severity: 4, mitigation: "Maintained 30m distance. Use of observer for crowd monitoring." },
    { id: "2", hazard: "Congested area", likelihood: 2, severity: 5, mitigation: "Planned flight during low-traffic window. Defined emergency landing zone." },
    { id: "3", hazard: "Privacy concerns", likelihood: 4, severity: 2, mitigation: "Informed site management. Data captured focused only on industrial asset." },
  ],
  Industrial: [
    { id: "4", hazard: "Moving vehicles / Plant", likelihood: 4, severity: 4, mitigation: "Site radio contact established. Pilot positioned in safe zone." },
    { id: "5", hazard: "RF Interference", likelihood: 2, severity: 3, mitigation: "Pre-flight spectrum scan. Signal monitoring during entire ops." },
  ]
};

export default function JobSheetPage({ params }: { params: { jobId: string } }) {
  const [activeTab, setActiveTab] = useState("assessment");
  const [isSigned, setIsSigned] = useState(false);
  const [risks, setRisks] = useState<RiskItem[]>(DEFAULT_RISKS.Urban);
  const job = MOCK_JOBS.find(j => j.id === params.jobId) || MOCK_JOBS[0];

  const updateRisk = (id: string, field: keyof RiskItem, value: any) => {
    setRisks(risks.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Compliance Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Compliance & Safety Protocol</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Digital Job Sheet // RAMS</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
            Audit-ready pre-flight documentation for mission {job.reference}. Auto-populated from operational planning and site intelligence.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><History size={14} /> Version History</CommandButton>
           <CommandButton variant="primary" disabled={!isSigned}><Download size={14} /> Export CAA PDF</CommandButton>
        </div>
      </div>

      {/* Protocol Tabs */}
      <div className="flex border-b border-border bg-panel">
         <ProtocolTab label="1. Job Intelligence" active={activeTab === 'intel'} onClick={() => setActiveTab('intel')} />
         <ProtocolTab label="2. Risk Assessment" active={activeTab === 'assessment'} onClick={() => setActiveTab('assessment')} />
         <ProtocolTab label="3. Pre-Flight Checklist" active={activeTab === 'checklist'} onClick={() => setActiveTab('checklist')} />
         <ProtocolTab label="4. Digital Sign-Off" active={activeTab === 'signoff'} onClick={() => setActiveTab('signoff')} />
      </div>

      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-8">
            <AnimatePresence mode="wait">
               {activeTab === 'intel' && (
                  <motion.div key="intel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <SectionPanel title="Crew Manifest">
                        <div className="grid grid-cols-2 gap-6">
                           <ManifestItem icon={User} label="Remote Pilot" value="Marcus Webb (GVC-2024-4412)" />
                           <ManifestItem icon={User} label="Observer" value="Sarah Chen" />
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Equipment Registry">
                        <div className="grid grid-cols-2 gap-6">
                           <ManifestItem icon={Plane} label="Aircraft" value="DJI Matrice 350 RTK (S/N: 4AX712)" />
                           <ManifestItem icon={Battery} label="Batteries" value="6x TB65 (Charged @ 98%)" />
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Permissions & Compliance">
                        <div className="space-y-4">
                           <div className="p-4 bg-background-secondary border border-border flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <ShieldCheck size={20} className="text-success" />
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-text-primary uppercase">Standard Operational Scenario (PDRA-01)</span>
                                    <span className="text-[8px] font-mono text-text-muted uppercase">CAA OPERATOR ID: GBR-OP-77412X</span>
                                 </div>
                              </div>
                              <StatusBadge status="VERIFIED" type="success" />
                           </div>
                        </div>
                     </SectionPanel>
                  </motion.div>
               )}

               {activeTab === 'assessment' && (
                  <motion.div key="assessment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-background-secondary border border-border font-mono text-[9px] text-text-muted uppercase tracking-widest">
                           <div className="col-span-4">Identified Hazard</div>
                           <div className="col-span-1 text-center">L</div>
                           <div className="col-span-1 text-center">S</div>
                           <div className="col-span-1 text-center">Risk</div>
                           <div className="col-span-5">Mitigation Strategy</div>
                        </div>

                        {risks.map((risk) => {
                           const rating = risk.likelihood * risk.severity;
                           const ratingColor = rating > 15 ? "text-danger" : rating > 8 ? "text-warning" : "text-success";

                           return (
                              <div key={risk.id} className="grid grid-cols-12 gap-4 items-start px-6 py-4 bg-panel border border-border">
                                 <div className="col-span-4">
                                    <input 
                                       type="text" 
                                       value={risk.hazard} 
                                       onChange={(e) => updateRisk(risk.id, "hazard", e.target.value)}
                                       className="w-full bg-transparent border-none text-[11px] font-bold text-text-primary uppercase focus:ring-0 p-0"
                                    />
                                 </div>
                                 <div className="col-span-1 text-center">
                                    <input 
                                       type="number" value={risk.likelihood} min={1} max={5}
                                       onChange={(e) => updateRisk(risk.id, "likelihood", parseInt(e.target.value))}
                                       className="w-full bg-transparent border-none text-[11px] text-center text-text-muted focus:ring-0 p-0"
                                    />
                                 </div>
                                 <div className="col-span-1 text-center">
                                    <input 
                                       type="number" value={risk.severity} min={1} max={5}
                                       onChange={(e) => updateRisk(risk.id, "severity", parseInt(e.target.value))}
                                       className="w-full bg-transparent border-none text-[11px] text-center text-text-muted focus:ring-0 p-0"
                                    />
                                 </div>
                                 <div className={cn("col-span-1 text-center font-mono font-black text-xs", ratingColor)}>
                                    {rating}
                                 </div>
                                 <div className="col-span-5">
                                    <textarea 
                                       value={risk.mitigation}
                                       onChange={(e) => updateRisk(risk.id, "mitigation", e.target.value)}
                                       className="w-full bg-transparent border-none text-[10px] text-text-secondary font-sans focus:ring-0 p-0 resize-none h-12"
                                    />
                                 </div>
                              </div>
                           );
                        })}

                        <button className="w-full py-4 border border-dashed border-border text-[9px] font-mono text-text-muted uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
                           <Plus size={14} /> Append Neural Hazard Pattern
                        </button>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'checklist' && (
                  <motion.div key="checklist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <SectionPanel title="Pre-Flight Checks">
                        <div className="space-y-4">
                           <CheckItem label="Aircraft structural integrity verified (Arms, Props, Body)" />
                           <CheckItem label="Battery terminal inspection and secure locking" />
                           <CheckItem label="Control link and RC battery level check (>60%)" />
                           <CheckItem label="IMU and Compass calibration status: NORMAL" safetyCritical />
                           <CheckItem label="SD Card formatted and detected" />
                           <CheckItem label="Airspace / NOTAM final check: NO CONFLICTS" safetyCritical />
                           <CheckItem label="Take-off and Landing zone secured" />
                           <CheckItem label="Public/Third-party briefing complete" />
                        </div>
                     </SectionPanel>
                  </motion.div>
               )}

               {activeTab === 'signoff' && (
                  <motion.div key="signoff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                     <div className="max-w-2xl mx-auto space-y-12 py-12 text-center">
                        <div className="space-y-4">
                           <PenTool size={48} className="mx-auto text-accent opacity-30" />
                           <h3 className="font-syne font-bold text-2xl uppercase tracking-widest">Pilot Declaration</h3>
                           <p className="text-sm text-text-secondary leading-relaxed">
                              I confirm that I have conducted a thorough site assessment, equipment check and risk review. 
                              The mission will be conducted in accordance with the Altitude Operations Manual and CAA regulations.
                           </p>
                        </div>

                        <div className="aspect-[21/9] bg-panel border-2 border-border relative flex items-center justify-center overflow-hidden">
                           {!isSigned ? (
                              <div className="flex flex-col items-center gap-4 text-text-muted">
                                 <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Signature Required</span>
                                 <CommandButton variant="primary" onClick={() => setIsSigned(true)}>Digital Sign-Off Protocol</CommandButton>
                              </div>
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-accent/5">
                                 <motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} className="font-syne text-3xl italic text-accent opacity-60 pointer-events-none">
                                    Marcus Webb
                                 </motion.div>
                                 <div className="absolute bottom-4 inset-x-0 flex justify-center items-center gap-6 text-[9px] font-mono text-accent uppercase tracking-widest">
                                    <span>TIMESTAMP: {new Date().toLocaleString()}</span>
                                    <span>SIGNED BY: PIC-4412</span>
                                 </div>
                                 <div className="absolute top-4 right-4 text-success flex items-center gap-2">
                                    <Lock size={12} />
                                    <span className="text-[9px] font-mono font-bold uppercase">RECORD LOCKED</span>
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Right: Site Intelligence Snapshot */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <DataCard title="Site Conditions" subtitle="Live Environmental Feed">
               <div className="space-y-6 mt-6">
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <Wind size={16} className="text-accent" />
                        <span className="font-mono text-[9px] text-text-muted uppercase">Wind (Ground)</span>
                     </div>
                     <span className="font-mono text-xs font-bold text-text-primary">4.2m/s NW</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <AlertTriangle size={16} className="text-warning" />
                        <span className="font-mono text-[9px] text-text-muted uppercase">NOTAMs</span>
                     </div>
                     <span className="font-mono text-xs font-bold text-warning">1 ACTIVE</span>
                  </div>
                  <div className="h-[1px] bg-border" />
                  <div className="p-4 bg-background-secondary border border-border">
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">What3Words</span>
                     <p className="text-[11px] font-bold text-accent mt-1 uppercase tracking-wider">/// drone.planning.desk</p>
                  </div>
               </div>
            </DataCard>

            <DataCard title="Auto-Population" subtitle="Data Sources">
               <div className="space-y-4 mt-4">
                  <SourceBadge label="Brief Module" active />
                  <SourceBadge label="Flight Planner" active />
                  <SourceBadge label="Airspace Service" active />
                  <SourceBadge label="Equipment Register" active />
               </div>
            </DataCard>
         </div>
      </div>
    </div>
  );
}

function ProtocolTab({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-4 text-[9px] font-mono uppercase tracking-widest transition-all border-b-2",
        active ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

function ManifestItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex items-center gap-2">
          <Icon size={12} className="text-text-muted" />
          <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-[11px] font-bold text-text-primary uppercase">{value}</span>
    </div>
  );
}

function CheckItem({ label, safetyCritical }: any) {
  return (
    <div className="flex items-center gap-4 group p-1">
       <div className="w-5 h-5 border border-border group-hover:border-accent transition-all flex items-center justify-center cursor-pointer">
          <div className="w-2 h-2 bg-accent scale-0 group-hover:scale-100 transition-transform" />
       </div>
       <span className={cn(
          "text-[10px] uppercase tracking-tight",
          safetyCritical ? "text-danger font-bold" : "text-text-secondary"
       )}>
          {label} {safetyCritical && <span className="ml-2 px-1 py-0.5 border border-danger text-[7px]">[SAFETY CRITICAL]</span>}
       </span>
    </div>
  );
}

function SourceBadge({ label, active }: any) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border border-border bg-background-secondary/50">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <CheckCircle2 size={12} className={active ? "text-success" : "text-border"} />
    </div>
  );
}
