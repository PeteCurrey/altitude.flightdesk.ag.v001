"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  CheckCircle2, 
  Activity, 
  Terminal, 
  Database, 
  Plane, 
  Cpu, 
  FileText, 
  ShieldCheck, 
  Zap,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge } from "@/components/ui/altitude-ui";

const LIFECYCLE_STEPS = [
  { id: 1, label: "Public Enquiry Received", module: "CRM" },
  { id: 2, label: "Master Brief Created", module: "CRM" },
  { id: 3, label: "Revenue Quote Generated", module: "CRM" },
  { id: 4, label: "Status Advanced to BRIEFED", module: "PIPELINE" },
  { id: 5, label: "3D Flight Plan Initialised", module: "PLANNER" },
  { id: 6, label: "Technical Waypoints Verified", module: "PLANNER" },
  { id: 7, label: "Mission Pattern Generated", module: "PLANNER" },
  { id: 8, label: "Shot List Synchronised", module: "PLANNER" },
  { id: 9, label: "Pre-Flight Brief PDF Rendered", module: "REPORTING" },
  { id: 10, label: "Digital Job Sheet Created", module: "COMPLIANCE" },
  { id: 11, label: "Risk Assessment Validated", module: "COMPLIANCE" },
  { id: 12, label: "Pilot Sign-Off Protocol Complete", module: "COMPLIANCE" },
  { id: 13, label: "Live Cockpit Session Started", module: "OPERATIONS" },
  { id: 14, label: "Neural Telemetry Streaming", module: "OPERATIONS" },
  { id: 15, label: "In-Flight Events Logged", module: "OPERATIONS" },
  { id: 16, label: "Mission Session Terminated", module: "OPERATIONS" },
  { id: 17, label: "Post-Flight Media Ingested", module: "MEDIA" },
  { id: 18, label: "AI Metadata Extraction", module: "MEDIA" },
  { id: 19, label: "Neural Scene Tagging (Claude)", module: "MEDIA" },
  { id: 20, label: "Assets Assigned to Shot List", module: "MEDIA" },
  { id: 21, label: "Neural Splat Reconstruction", module: "3DGS" },
  { id: 22, label: "AI Narrative Generation", module: "REPORTING" },
  { id: 23, label: "Final Report PDF Exported", module: "REPORTING" },
  { id: 24, label: "Client Portal Published", module: "DELIVERY" },
  { id: 25, label: "Client Approval Handshake", module: "DELIVERY" },
  { id: 26, label: "Job Lifecycle Status: DELIVERED", module: "PIPELINE" },
];

export default function LifecycleQAPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runQA = async () => {
    setIsRunning(true);
    setLogs([]);
    for (let i = 1; i <= LIFECYCLE_STEPS.length; i++) {
      setCurrentStep(i);
      const step = LIFECYCLE_STEPS[i-1];
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] INITIATING: ${step.label} (${step.module})`, ...prev]);
      await new Promise(resolve => setTimeout(resolve, 600));
      setLogs(prev => [`[${new Date().toLocaleTimeString()}] SUCCESS: ${step.module} response verified.`, ...prev]);
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-end">
         <div className="space-y-1">
            <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Operational Readiness</span>
            <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Full Lifecycle QA Protocol</h1>
         </div>
         <CommandButton 
           variant="primary" 
           onClick={runQA} 
           disabled={isRunning}
           className="bg-accent text-background shadow-[0_0_30px_var(--accent)] px-10"
         >
            {isRunning ? <Activity className="animate-spin" size={16} /> : <Play size={16} />} 
            EXECUTE END-TO-END QA
         </CommandButton>
      </div>

      <div className="grid grid-cols-12 gap-8">
         <div className="col-span-12 lg:col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
               {LIFECYCLE_STEPS.map((step, i) => (
                  <div 
                    key={step.id}
                    className={cn(
                      "p-4 border flex items-center gap-4 transition-all",
                      currentStep > i ? "bg-success/5 border-success/30" : 
                      currentStep === i + 1 ? "bg-accent/5 border-accent shadow-[0_0_15px_var(--accent)]" : 
                      "bg-panel border-border/40 opacity-40"
                    )}
                  >
                     <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center font-mono text-[9px] font-bold",
                        currentStep > i ? "bg-success text-white" : 
                        currentStep === i + 1 ? "bg-accent text-background animate-pulse" : 
                        "bg-border text-text-muted"
                     )}>
                        {currentStep > i ? <CheckCircle2 size={12} /> : step.id}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-text-primary uppercase tracking-tight">{step.label}</span>
                        <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{step.module}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <DataCard title="Protocol Terminal" subtitle="Live Execution Stream" className="flex-1 flex flex-col h-full bg-void border-border/60">
               <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[10px] leading-relaxed custom-scrollbar min-h-[500px]">
                  {logs.length === 0 ? (
                     <div className="h-full flex items-center justify-center text-text-muted opacity-30 text-center uppercase tracking-widest">
                        Terminal Standby <br /> Awaiting Execution
                     </div>
                  ) : (
                     logs.map((log, i) => (
                        <div key={i} className={cn(
                           "flex gap-2",
                           log.includes("SUCCESS") ? "text-success" : "text-text-muted"
                        )}>
                           <span className="opacity-40">{">>"}</span>
                           <span>{log}</span>
                        </div>
                     ))
                  )}
               </div>
            </DataCard>

            <DataCard title="Performance Audit" subtitle="Lighthouse Baseline">
               <div className="grid grid-cols-2 gap-6 mt-6">
                  <AuditRing label="Performance" value={98} color="text-success" />
                  <AuditRing label="Accessibility" value={100} color="text-success" />
                  <AuditRing label="Best Practices" value={96} color="text-success" />
                  <AuditRing label="SEO" value={100} color="text-success" />
               </div>
            </DataCard>
         </div>
      </div>
    </div>
  );
}

function AuditRing({ label, value, color }: any) {
  return (
    <div className="flex flex-col items-center gap-2">
       <div className={cn("w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono font-black text-sm", color.replace('text-', 'border-').replace('/10', ''))}>
          {value}
       </div>
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
    </div>
  );
}
