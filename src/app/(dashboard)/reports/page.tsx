"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  Zap, 
  Cpu, 
  Globe, 
  ExternalLink,
  PieChart,
  Activity,
  History,
  TrendingUp,
  Mail,
  MoreVertical,
  Plus
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

export default function ReportsHubPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8 pb-32">
      {/* Reports Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Commercial Intelligence</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Reports Hub</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
             Automated mission compilers, neural inspection summaries and cross-platform commercial analytics.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><History size={14} /> View History</CommandButton>
           <CommandButton variant="primary"><Plus size={14} /> Compile New Report</CommandButton>
        </div>
      </div>

      {/* Intelligence Dashboard Grid */}
      <div className="grid grid-cols-12 gap-8">
         {/* Left: AI Generation Panel */}
         <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <DataCard className="bg-accent/5 border-accent/20">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 border border-accent/40 flex items-center justify-center text-accent">
                     <Cpu size={20} />
                  </div>
                  <div>
                     <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-accent">Neural Compiler</h4>
                     <p className="font-mono text-[8px] text-accent/60 uppercase">Powered by Anthropic Claude 3.5</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <p className="text-[10px] font-mono text-text-muted leading-relaxed uppercase">
                     Select an active flight session to initiate AI-powered mission summarization and technical insight extraction.
                  </p>
                  
                  <div className="space-y-3">
                     <label className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Select Source Flight</label>
                     <div className="p-3 bg-void border border-border flex items-center justify-between group hover:border-accent cursor-pointer transition-all">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-bold text-text-primary uppercase">ALT-25-005 — Solar Array</span>
                           <span className="font-mono text-[8px] text-text-muted">FLOWN: 24/04/2024</span>
                        </div>
                        <ChevronRight size={14} className="text-border" />
                     </div>
                  </div>

                  <CommandButton variant="primary" className="w-full justify-center">
                     Compile Technical Mission Report
                  </CommandButton>
               </div>
            </DataCard>

            <DataCard title="Global Efficiency" subtitle="Platform-wide Analytics">
               <div className="space-y-6 mt-6">
                  <EfficiencyRow label="Flight Hour Yield" value="+14.2%" trend="up" />
                  <EfficiencyRow label="Asset Utilisation" value="92.8%" trend="up" />
                  <EfficiencyRow label="Compliance Accuracy" value="100%" trend="stable" />
                  <EfficiencyRow label="AI Tag Precision" value="96.4%" trend="up" />
               </div>
            </DataCard>
         </div>

         {/* Right: Published Reports Table */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="flex flex-col gap-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex border border-border bg-panel">
                     <ReportTab label="All Reports" active={activeTab === 'all'} count={58} onClick={() => setActiveTab('all')} />
                     <ReportTab label="Inspections" active={activeTab === 'ins'} count={24} onClick={() => setActiveTab('ins')} />
                     <ReportTab label="Commercial" active={activeTab === 'com'} count={14} onClick={() => setActiveTab('com')} />
                     <ReportTab label="Safety" active={activeTab === 'saf'} count={20} onClick={() => setActiveTab('saf')} />
                  </div>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                     <input 
                        type="text" 
                        placeholder="Filter reports..." 
                        className="bg-panel border border-border px-10 py-2 text-[10px] font-mono w-48 focus:border-accent outline-none"
                     />
                  </div>
               </div>

               <DataCard className="p-0">
                  <PremiumTable 
                     headers={["Report ID", "Mission Title", "Type", "Status", "Published", "Actions"]}
                     data={MOCK_JOBS.slice(0, 10)}
                     renderRow={(report: any) => (
                        <>
                           <td className="py-4 px-6 font-mono text-[10px] text-accent uppercase">REP-{report.reference.split('-')[2]}</td>
                           <td className="py-4 px-6">
                              <div className="flex flex-col">
                                 <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{report.title}</span>
                                 <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{report.client.company}</span>
                              </div>
                           </td>
                           <td className="py-4 px-6 font-mono text-[9px] text-text-muted uppercase">Technical</td>
                           <td className="py-4 px-6">
                              <StatusBadge status="READY" type="success" />
                           </td>
                           <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                 <Globe size={12} className="text-success" />
                                 <span className="font-mono text-[9px] text-success uppercase">Portal Live</span>
                              </div>
                           </td>
                           <td className="py-4 px-6">
                              <div className="flex justify-end gap-2">
                                 <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                                    <Mail size={14} />
                                 </button>
                                 <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                                    <Download size={14} />
                                 </button>
                                 <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                                    <ExternalLink size={14} />
                                 </button>
                              </div>
                           </td>
                        </>
                     )}
                  />
               </DataCard>
            </div>
         </div>
      </div>
    </div>
  );
}

function ReportTab({ label, active, count, onClick }: any) {
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

function EfficiencyRow({ label, value, trend }: any) {
  return (
    <div className="flex flex-col gap-2">
       <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{label}</span>
          <div className="flex items-center gap-2">
             <span className="text-xs font-bold font-mono text-text-primary">{value}</span>
             {trend === 'up' && <TrendingUp size={12} className="text-success" />}
          </div>
       </div>
       <div className="h-[2px] bg-border w-full relative">
          <motion.div initial={{ width: 0 }} animate={{ width: value }} className="h-full bg-accent" />
       </div>
    </div>
  );
}
