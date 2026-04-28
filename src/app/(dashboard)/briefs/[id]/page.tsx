"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  User, 
  Zap, 
  FileText, 
  Camera, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  MoreVertical,
  Settings,
  ShieldCheck,
  Package,
  Plus
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { QuoteGenerator } from "@/components/commercial/quote-generator";
import { MOCK_JOBS } from "@/lib/mock-data";
import Link from "next/link";
import { JobStatus } from "@prisma/client";
import { generateMissionReport } from "@/app/actions/ai-analysis";

export default function MissionDetailPage({ params }: { params: { id: string } }) {
  const job = MOCK_JOBS.find(j => j.id === params.id) || MOCK_JOBS[0];
  const [activeTab, setActiveTab] = useState("overview");
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    const res = await generateMissionReport(job);
    if (res.success && res.content) {
      setAiReport(res.content);
    }
    setIsGeneratingReport(false);
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-6">
        <Link href="/briefs" className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-widest hover:text-accent transition-colors w-fit">
          <ArrowLeft size={12} />
          Back to Pipeline
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-panel border border-border flex items-center justify-center text-accent">
                <Zap size={24} />
             </div>
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <span className="font-mono text-[10px] text-accent uppercase tracking-widest">{job.reference}</span>
                   <StatusBadge status={job.status} type={job.status === 'active' ? 'accent' : 'warning'} />
                </div>
                <h2 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">{job.title}</h2>
                <p className="text-sm text-text-secondary font-mono uppercase tracking-widest">{job.client.company} — Project Discovery</p>
             </div>
          </div>
          <div className="flex gap-3">
             <CommandButton variant="ghost"><Settings size={14} /> Mission Config</CommandButton>
             <CommandButton variant="primary">Initialise Flight Planner</CommandButton>
          </div>
        </div>
      </div>

      {/* Lifecycle Progress Bar */}
      <div className="grid grid-cols-9 gap-[1px] bg-border border border-border h-12">
         {Object.values(JobStatus).map((status, i) => {
            const isCompleted = i < Object.values(JobStatus).indexOf(job.status as any);
            const isCurrent = job.status === status;
            return (
               <div key={status} className={cn(
                  "flex items-center justify-center relative transition-all",
                  isCurrent ? "bg-accent/10" : isCompleted ? "bg-panel" : "bg-panel/50 opacity-40"
               )}>
                  <span className={cn(
                     "font-mono text-[8px] uppercase tracking-widest",
                     isCurrent ? "text-accent font-bold" : isCompleted ? "text-success" : "text-text-muted"
                  )}>
                     {status}
                  </span>
                  {isCurrent && <motion.div layoutId="lifecycle-glow" className="absolute bottom-0 inset-x-0 h-[2px] bg-accent" />}
                  {isCompleted && <div className="absolute top-1 right-1"><CheckCircle2 size={8} className="text-success" /></div>}
               </div>
            );
         })}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Information */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="flex border-b border-border">
             <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
             <TabButton label="Technical Brief" active={activeTab === 'brief'} onClick={() => setActiveTab('brief')} />
             <TabButton label="Shot List" active={activeTab === 'shots'} onClick={() => setActiveTab('shots')} />
             <TabButton label="Commercial" active={activeTab === 'commercial'} onClick={() => setActiveTab('commercial')} />
             <TabButton label="Operations Log" active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <SectionPanel title="Mission Parameters">
                      <div className="space-y-4">
                         <ParamRow label="Job Type" value={job.jobType} />
                         <ParamRow label="Site Address" value={job.location} />
                         <ParamRow label="Postcode" value="M50 3AZ" />
                         <ParamRow label="Shoot Window" value="09:00 - 14:00" />
                         <ParamRow label="Priority" value="Standard" />
                         <ParamRow label="Deliverables" value={job.deliverables.join(', ')} />
                      </div>
                   </SectionPanel>
                   
                   <SectionPanel title="Assigned Personnel">
                      <div className="space-y-6">
                         <div className="flex items-center justify-between p-4 bg-background-secondary border border-border">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-navy border border-border flex items-center justify-center font-bold">MW</div>
                               <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-primary uppercase">Marcus Webb</span>
                                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest">Pilot-In-Command</span>
                               </div>
                            </div>
                            <CommandButton variant="ghost" className="py-1 px-3 h-8 text-[8px]">Change</CommandButton>
                         </div>
                         
                         <div className="flex items-center justify-between p-4 bg-background-secondary border border-border">
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-navy border border-border flex items-center justify-center font-bold">SC</div>
                               <div className="flex flex-col">
                                  <span className="text-xs font-bold text-text-primary uppercase">Sarah Chen</span>
                                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Payload Op / Observer</span>
                               </div>
                            </div>
                            <CommandButton variant="ghost" className="py-1 px-3 h-8 text-[8px]">Change</CommandButton>
                         </div>
                      </div>
                   </SectionPanel>

                   <div className="col-span-2">
                      <SectionPanel title="Site Analysis">
                         <div className="aspect-[21/9] bg-panel border border-border relative overflow-hidden flex items-center justify-center">
                            <MapPin size={48} className="text-accent opacity-20" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                               <div className="flex flex-col gap-1">
                                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Coordinates</span>
                                  <span className="text-xs font-mono text-text-primary font-bold">53.4792° N, 2.2901° W</span>
                               </div>
                               <CommandButton variant="outline" className="py-1 px-4 text-[9px]">Open High-Res Satellite</CommandButton>
                            </div>
                         </div>
                      </SectionPanel>
                   </div>
                </div>
              )}

              {activeTab === 'commercial' && (
                 <DataCard>
                    <QuoteGenerator jobId={job.id} />
                 </DataCard>
              )}

              {activeTab === 'logs' && (
                 <SectionPanel title="Operations Log & AI Analysis">
                    <div className="space-y-6">
                       {!aiReport ? (
                          <div className="flex flex-col items-center justify-center p-12 bg-background-secondary border border-border border-dashed gap-4 text-center">
                             <FileText size={32} className="text-text-muted" />
                             <div className="space-y-1">
                                <h4 className="font-syne font-bold text-sm text-text-primary uppercase tracking-widest">Generate Post-Flight Report</h4>
                                <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest max-w-sm">Compile telemetry, weather, and media metadata into a comprehensive mission narrative using Claude AI.</p>
                             </div>
                             <CommandButton 
                                variant="primary" 
                                className="mt-4" 
                                onClick={handleGenerateReport}
                                disabled={isGeneratingReport}
                             >
                                {isGeneratingReport ? "Compiling..." : "Generate AI Report"}
                             </CommandButton>
                          </div>
                       ) : (
                          <div className="p-6 bg-background-secondary border border-border">
                             <div className="flex justify-between items-center mb-6 pb-6 border-b border-border/40">
                                <div className="flex items-center gap-2">
                                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                   <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">AI Generated Narrative</span>
                                </div>
                                <CommandButton variant="ghost" className="text-[9px]">Export PDF</CommandButton>
                             </div>
                             <div className="prose prose-invert prose-sm max-w-none font-sans text-text-secondary leading-relaxed">
                                {aiReport.split('\n').map((line, i) => (
                                   <p key={i} className="mb-4 last:mb-0">{line}</p>
                                ))}
                             </div>
                          </div>
                       )}
                    </div>
                 </SectionPanel>
              )}
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right Panel: Commercial & Compliance */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <DataCard title="Commercial Intelligence" subtitle="Project Value & Quotes">
              <div className="mt-4 space-y-6">
                 <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                       <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Approved Value</span>
                       <span className="text-3xl font-syne font-black text-accent tracking-tighter">{formatCurrency(job.value)}</span>
                    </div>
                    <StatusBadge status="QUOTED" type="success" />
                 </div>
                 
                 <div className="space-y-2">
                    <label className="label">Financial Pipeline</label>
                    <div className="flex items-center justify-between p-3 bg-background-secondary border border-border hover:border-accent transition-colors cursor-pointer">
                       <div className="flex items-center gap-3">
                          <FileText size={16} className="text-text-muted" />
                          <span className="text-[10px] font-bold text-text-primary uppercase">Quote_Rev_A.pdf</span>
                       </div>
                       <ChevronRight size={14} className="text-border" />
                    </div>
                 </div>
                 
                 <CommandButton variant="outline" className="w-full">Raise Variation Order</CommandButton>
              </div>
           </DataCard>

           <DataCard title="Operational Compliance" subtitle="Mission Readiness Status">
              <div className="mt-4 space-y-4">
                 <ComplianceItem label="Airspace Approval" status="AUTHORISED" type="success" />
                 <ComplianceItem label="Risk Assessment" status="DRAFT" type="warning" />
                 <ComplianceItem label="Insurance Valid" status="CONFIRMED" type="success" />
                 <ComplianceItem label="Pilot Certifications" status="VALID" type="success" />
                 <ComplianceItem label="RAMS Signed" status="PENDING" type="danger" />
              </div>
           </DataCard>

           <DataCard title="Technical Manifest" subtitle="Fleet Assignment">
              <div className="mt-4 space-y-4">
                 <div className="flex items-center gap-4 p-3 bg-background-secondary border border-border">
                    <div className="w-10 h-10 border border-border flex items-center justify-center text-text-muted">
                       <Package size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-text-primary uppercase">DJI Matrice 350 RTK</span>
                       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">S/N: M350-X-4412</span>
                    </div>
                 </div>
                 <CommandButton variant="ghost" className="w-full py-2 text-[9px]"><Plus size={12} /> Assign Sensors & Power</CommandButton>
              </div>
           </DataCard>
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-4 text-[10px] font-mono uppercase tracking-[0.2em] transition-all border-b-2",
        active ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

function ParamRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
       <span className="text-[10px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="text-xs font-bold text-text-primary uppercase tracking-tight">{value}</span>
    </div>
  );
}

function ComplianceItem({ label, status, type }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-[10px] font-medium text-text-secondary">{label}</span>
       <span className={cn(
          "font-mono text-[9px] font-bold uppercase tracking-widest",
          type === "success" ? "text-success" : type === "warning" ? "text-warning" : "text-danger"
       )}>
          {status}
       </span>
    </div>
  );
}
