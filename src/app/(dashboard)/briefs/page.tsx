"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  FileText, 
  Zap, 
  MoreVertical,
  Calendar,
  User,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";
import Link from "next/link";

export default function BriefsListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pb-32">
      {/* List Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Pipeline Management</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Mission Briefs & CRM</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
            Centralised mission intake and commercial pipeline tracking. Manage the full job lifecycle from initial enquiry to final invoice.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><Download size={14} /> Export CSV</CommandButton>
           <Link href="/briefs/new">
             <CommandButton variant="primary"><Plus size={14} /> New Brief Protocol</CommandButton>
           </Link>
        </div>
      </div>

      {/* Intelligence Hub / Filtering */}
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FilterCard label="Status Protocol" options={["All", "Enquiry", "Briefed", "Planned", "Scheduled", "Flown", "In Post", "Delivered", "Invoiced"]} />
            <FilterCard label="Mission Type" options={["All", "Photography", "Survey", "Gaussian Splat", "Inspection"]} />
            <FilterCard label="Quote Status" options={["All", "Draft", "Sent", "Approved", "Rejected"]} />
            <div className="flex items-end">
               <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search mission ID, client, project..." 
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
         </div>

         {/* Advanced Filter Pills */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest mr-2 shrink-0">Active Filters:</span>
            <FilterPill label="Date: Last 30 Days" />
            <FilterPill label="Value: > £2,500" />
            <FilterPill label="Pilot: Marcus Webb" />
            <button className="text-[9px] font-mono text-accent uppercase tracking-widest hover:underline ml-auto shrink-0">Clear All Protocol</button>
         </div>

         {/* Results Table */}
         <DataCard className="p-0">
            <PremiumTable 
               headers={[
                  "Job Reference", 
                  "Client / Project", 
                  "Mission Type", 
                  "Deliverables", 
                  "Status", 
                  "Target Date", 
                  "Quote Status", 
                  "Pilot", 
                  "Actions"
               ]}
               data={MOCK_JOBS}
               renderRow={(job: any) => (
                  <>
                     <td className="py-5 px-6 font-mono text-[10px] text-accent font-bold uppercase tracking-widest">{job.reference}</td>
                     <td className="py-5 px-6">
                        <div className="flex flex-col">
                           <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{job.title}</span>
                           <Link href={`/clients/1`} className="font-mono text-[9px] text-text-muted uppercase tracking-widest hover:text-accent transition-colors">
                              {job.client.company}
                           </Link>
                        </div>
                     </td>
                     <td className="py-5 px-6 font-mono text-[9px] text-text-muted uppercase">{job.jobType}</td>
                     <td className="py-5 px-6">
                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                           {job.deliverables.slice(0, 2).map((d: string) => (
                              <span key={d} className="px-1.5 py-0.5 border border-border text-[7px] font-mono text-text-muted uppercase tracking-tighter">{d}</span>
                           ))}
                           {job.deliverables.length > 2 && <span className="text-[7px] font-mono text-accent">+{job.deliverables.length - 2}</span>}
                        </div>
                     </td>
                     <td className="py-5 px-6">
                        <StatusBadge 
                           status={job.status} 
                           type={job.status === 'active' ? 'accent' : job.status === 'completed' ? 'success' : 'warning'} 
                        />
                     </td>
                     <td className="py-5 px-6 font-mono text-[10px] text-text-secondary">{formatDate(job.scheduledDate)}</td>
                     <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                           <div className={cn(
                              "w-1.5 h-1.5 rounded-full shadow-[0_0_8px]",
                              job.status === 'completed' ? "bg-success shadow-success" : "bg-warning shadow-warning"
                           )} />
                           <span className="font-mono text-[9px] text-text-primary uppercase">Approved</span>
                        </div>
                     </td>
                     <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                           <div className="w-5 h-5 bg-navy border border-border flex items-center justify-center text-[8px] font-bold">MW</div>
                           <span className="text-[10px] font-mono text-text-muted">M. Webb</span>
                        </div>
                     </td>
                     <td className="py-5 px-6">
                        <div className="flex justify-end gap-2">
                           <Link href={`/briefs/${job.id}`}>
                              <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                                 <ArrowUpRight size={14} />
                              </button>
                           </Link>
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <MoreVertical size={14} />
                           </button>
                        </div>
                     </td>
                  </>
               )}
            />
         </DataCard>
      </div>
    </div>
  );
}

function FilterCard({ label, options }: any) {
  return (
    <div className="space-y-2">
       <label className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{label}</label>
       <select className="input-field text-[10px] py-2 appearance-none">
          {options.map((o: string) => <option key={o}>{o}</option>)}
       </select>
    </div>
  );
}

function FilterPill({ label }: any) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border text-[9px] font-mono text-text-primary uppercase tracking-widest shrink-0">
       {label}
       <button className="text-text-muted hover:text-danger">×</button>
    </div>
  );
}
