"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  FileText, 
  Download, 
  Zap, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  CreditCard,
  History,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div className="space-y-8 pb-32">
      {/* Client Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-panel border border-border flex items-center justify-center text-accent">
              <User size={32} />
           </div>
           <div className="space-y-1">
              <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Key Account Protocol</span>
              <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Skanska UK</h1>
              <p className="text-sm text-text-secondary font-sans tracking-tight">Lead Contact: James Wilson — Senior Site Manager</p>
           </div>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><MessageSquare size={14} /> Send Update</CommandButton>
           <CommandButton variant="primary"><Plus size={14} /> Create New Mission</CommandButton>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Left: Client Intelligence Sidebar */}
         <div className="col-span-12 lg:col-span-4 space-y-8">
            <DataCard title="Contact Profile" subtitle="Personnel Details">
               <div className="space-y-4 mt-4">
                  <ContactInfo icon={Mail} label="Primary Email" value="j.wilson@skanska.co.uk" />
                  <ContactInfo icon={Phone} label="Contact Phone" value="+44 20 7418 2000" />
                  <ContactInfo icon={MapPin} label="Billing Address" value="50 Bank St, London E14 5NT" />
                  <div className="h-[1px] bg-border my-2" />
                  <div className="p-3 bg-background-secondary border border-border">
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">Client Intelligence</span>
                     <p className="text-[10px] font-sans text-text-primary leading-relaxed mt-1">
                        High-volume industrial client. Requires RAMS signed 48h prior to flight. Prefers neural splat deliverables.
                     </p>
                  </div>
               </div>
            </DataCard>

            <DataCard title="Commercial Overview" subtitle="Fiscal Performance">
               <div className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                     <StatBox label="Total Billed" value="£42,850" />
                     <StatBox label="Active Pipeline" value="£12,400" />
                  </div>
                  <div className="h-[1px] bg-border" />
                  <div className="flex justify-between items-center">
                     <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Outstanding Quotes</span>
                     <span className="font-mono text-xs font-bold text-warning">2 Pending</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Avg. Cycle Time</span>
                     <span className="font-mono text-xs font-bold text-text-primary">14 Days</span>
                  </div>
               </div>
            </DataCard>
         </div>

         {/* Right: Operational History */}
         <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="flex border-b border-border bg-panel">
               <ProfileTab label="Mission History" active={activeTab === 'jobs'} count={8} onClick={() => setActiveTab('jobs')} />
               <ReportTab label="Documents & Reports" active={activeTab === 'docs'} count={14} onClick={() => setActiveTab('docs')} />
               <ActivityTab label="Interaction Log" active={activeTab === 'logs'} count={42} onClick={() => setActiveTab('logs')} />
            </div>

            <AnimatePresence mode="wait">
               {activeTab === 'jobs' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <DataCard className="p-0">
                        <PremiumTable 
                           headers={["Ref", "Mission Title", "Status", "Target Date", "Value", "Actions"]}
                           data={MOCK_JOBS.slice(0, 5)}
                           renderRow={(job: any) => (
                              <>
                                 <td className="py-4 px-6 font-mono text-[10px] text-text-muted uppercase">{job.reference}</td>
                                 <td className="py-4 px-6 font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{job.title}</td>
                                 <td className="py-4 px-6">
                                    <StatusBadge status={job.status} type={job.status === 'active' ? 'accent' : 'success'} />
                                 </td>
                                 <td className="py-4 px-6 font-mono text-[10px] text-text-secondary">{formatDate(job.scheduledDate)}</td>
                                 <td className="py-4 px-6 font-mono text-[10px] text-text-primary">{formatCurrency(job.value)}</td>
                                 <td className="py-4 px-6">
                                    <div className="flex justify-end">
                                       <button className="p-2 border border-border text-text-muted hover:text-accent transition-all">
                                          <ChevronRight size={14} />
                                       </button>
                                    </div>
                                 </td>
                              </>
                           )}
                        />
                     </DataCard>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon: Icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex items-center gap-2">
          <Icon size={12} className="text-text-muted" />
          <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-[11px] font-bold text-text-primary">{value}</span>
    </div>
  );
}

function StatBox({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="text-xl font-syne font-black text-text-primary tracking-tighter">{value}</span>
    </div>
  );
}

function ProfileTab({ label, active, count, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-4 text-[9px] font-mono uppercase tracking-widest transition-all border-b-2",
        active ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
      )}
    >
      {label} <span className="ml-2 text-accent/60">({count})</span>
    </button>
  );
}

function ReportTab(props: any) { return <ProfileTab {...props} /> }
function ActivityTab(props: any) { return <ProfileTab {...props} /> }
