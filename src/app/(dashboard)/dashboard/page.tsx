"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle, 
  Cloud, 
  Radio, 
  FileText, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Send, 
  Camera, 
  Map as MapIcon,
  ChevronDown,
  LayoutGrid,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  Monitor as MonitorPlay
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataCard, MetricReadout, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";
import { MOCK_JOBS, MOCK_ACTIVITY } from "@/lib/mock-data";
import Link from "next/link";

// --- Components ---

function StatusStrip() {
  return (
    <div className="flex items-center gap-10 px-6 py-4 bg-panel border-b border-border overflow-x-auto no-scrollbar">
      <StatusItem label="System" value="OPERATIONAL" status="success" />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Weather (Home)" value="14°C Clear" icon={Cloud} />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Active NOTAMs" value="4" icon={Radio} status="warning" />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Flights Today" value="3" />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Media Awaiting" value="14" icon={Camera} />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Certs Expiring" value="2" status="danger" />
      <div className="w-[1px] h-8 bg-border" />
      <StatusItem label="Insurance" value="VALID" status="success" />
    </div>
  );
}

function StatusItem({ label, value, icon: Icon, status }: any) {
  return (
    <div className="flex flex-col gap-1 min-w-max">
      <span className="font-mono text-[9px] text-text-muted uppercase tracking-[0.2em]">{label}</span>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={12} className="text-text-muted" />}
        <span className={cn(
          "font-mono text-[10px] font-bold uppercase tracking-widest",
          status === "success" ? "text-success" : status === "warning" ? "text-warning" : status === "danger" ? "text-danger" : "text-text-primary"
        )}>
          {value}
        </span>
      </div>
    </div>
  );
}

function PipelineStrip() {
  const statuses = [
    { label: "Enquiry", count: 2, value: 4500, age: "2d" },
    { label: "Briefed", count: 3, value: 12800, age: "4d" },
    { label: "Planned", count: 2, value: 8400, age: "1d" },
    { label: "Scheduled", count: 4, value: 18200, age: "6h" },
    { label: "Flown", count: 1, value: 3500, age: "2h" },
    { label: "In Post", count: 2, value: 7200, age: "5h" },
    { label: "Delivered", count: 12, value: 48000, age: "0d" },
    { label: "Invoiced", count: 5, value: 14500, age: "3d" },
    { label: "Archived", count: 142, value: 524000, age: "-" },
  ];

  return (
    <div className="grid grid-cols-9 gap-[1px] bg-border border border-border">
      {statuses.map((s, i) => (
        <div key={s.label} className="bg-panel p-4 flex flex-col gap-2 hover:bg-background-secondary transition-colors cursor-pointer group">
          <div className="flex items-center justify-between">
             <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest group-hover:text-accent transition-colors">{s.label}</span>
             <span className="font-mono text-xs font-bold text-text-primary">{s.count}</span>
          </div>
          <div className="flex flex-col">
             <span className="font-mono text-[10px] text-accent">{formatCurrency(s.value)}</span>
             <span className="font-mono text-[8px] text-text-muted uppercase tracking-tighter">Oldest: {s.age}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarStrip() {
  // Generate 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         <h4 className="font-syne text-xs font-bold uppercase tracking-widest">14-Day Operations Schedule</h4>
         <div className="flex gap-2">
            <button className="p-1 border border-border hover:border-accent text-text-muted"><ChevronLeft size={12} /></button>
            <button className="p-1 border border-border hover:border-accent text-text-muted"><ChevronRight size={12} /></button>
         </div>
      </div>
      <div className="flex gap-[2px] bg-border border border-border overflow-x-auto no-scrollbar">
        {days.map((day, i) => {
          const isToday = i === 0;
          const hasFlight = i === 0 || i === 3 || i === 7;
          const hasWarning = i === 3;
          
          return (
            <div key={i} className={cn(
              "flex-1 min-w-[80px] bg-panel p-3 h-24 flex flex-col justify-between border-b-2 transition-all",
              isToday ? "border-accent bg-accent/5" : "border-transparent",
              hasFlight ? "cursor-pointer hover:bg-background-secondary" : ""
            )}>
              <div className="flex flex-col">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{day.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                <span className="font-syne text-xs font-bold">{day.getDate()}</span>
              </div>
              
              {hasFlight && (
                <div className="flex flex-col gap-1">
                   <div className={cn("h-1 w-full", hasWarning ? "bg-warning" : "bg-accent")} />
                   <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] text-text-primary uppercase tracking-tighter">Mission</span>
                      {hasWarning && <ShieldAlert size={8} className="text-warning" />}
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OperationalAlerts() {
  const alerts = [
    { label: "Insurance Expiring", value: "8 Days", status: "danger" },
    { label: "Pilot Cert (M. Webb)", value: "Exp. 12/04", status: "warning" },
    { label: "Battery Health #TB65-04", value: "72%", status: "danger" },
    { label: "Unassigned Mission", value: "ALT-25-012", status: "warning" },
    { label: "Report Pending", value: "48h Overdue", status: "warning" },
    { label: "Splat Processing", value: "FAILED", status: "danger" },
    { label: "Client Feedback", value: "New Message", status: "accent" },
  ];

  return (
    <DataCard title="Operational Alerts" subtitle="System Intelligence & Compliance">
      <div className="space-y-4 mt-4">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-border/40 pb-3 last:border-0">
             <span className="text-[10px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">{a.label}</span>
             <div className="flex items-center gap-2">
                <span className={cn(
                  "font-mono text-[9px] font-bold uppercase tracking-widest",
                  a.status === "danger" ? "text-danger" : a.status === "warning" ? "text-warning" : a.status === "accent" ? "text-accent" : "text-text-muted"
                )}>
                  {a.value}
                </span>
                <ChevronRight size={10} className="text-border group-hover:text-accent transition-colors" />
             </div>
          </div>
        ))}
        <CommandButton variant="ghost" className="w-full mt-2 py-2 text-[8px]">
          Resolve All Conflicts
        </CommandButton>
      </div>
    </DataCard>
  );
}

// --- Main Page ---

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 pb-32">
      {/* Top Status Strip */}
      <StatusStrip />

      <div className="px-6 space-y-10">
        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard>
            <MetricReadout label="Jobs This Month" value="24" trend="+4" trendType="up" />
          </DataCard>
          <DataCard>
            <MetricReadout label="Flights Completed" value="112" trend="+12" trendType="up" />
          </DataCard>
          <DataCard>
            <MetricReadout label="Avg. Job Value" value="£3,420" trend="+£140" trendType="up" />
          </DataCard>
          <DataCard>
            <MetricReadout label="Hours Flown" value="482" trend="-8" trendType="down" />
          </DataCard>
        </div>

        {/* Job Pipeline */}
        <div className="space-y-4">
           <h4 className="font-syne text-xs font-bold uppercase tracking-widest">Global Job Pipeline</h4>
           <PipelineStrip />
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Column */}
          <div className="col-span-12 lg:col-span-9 space-y-10">
            {/* Calendar Strip */}
            <CalendarStrip />

            {/* Active Jobs Table */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <h4 className="font-syne text-xs font-bold uppercase tracking-widest">Active Mission Management</h4>
                 <div className="flex items-center gap-3">
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                       <input 
                        type="text" 
                        placeholder="Search missions..." 
                        className="bg-panel border border-border px-8 py-1.5 text-[10px] font-mono w-48 focus:border-accent outline-none"
                       />
                    </div>
                    <button className="btn-ghost py-1 px-3 flex items-center gap-2">
                       <Filter size={10} />
                       <span className="text-[10px]">Filter</span>
                    </button>
                 </div>
              </div>

              <DataCard className="p-0">
                <PremiumTable 
                  headers={["Reference", "Client / Project", "Deliverables", "Date", "Status", "Pilot", "Actions"]}
                  data={MOCK_JOBS.slice(0, 6)}
                  renderRow={(job: any) => (
                    <>
                      <td className="py-4 px-6 font-mono text-[10px] text-accent">{job.reference}</td>
                      <td className="py-4 px-6">
                         <div className="flex flex-col">
                            <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{job.title}</span>
                            <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{job.client.company}</span>
                         </div>
                      </td>
                      <td className="py-4 px-6">
                         <div className="flex gap-1 flex-wrap">
                            {job.deliverables?.slice(0, 2).map((d: string) => (
                              <span key={d} className="text-[8px] font-mono border border-border px-1.5 py-0.5 text-text-muted">{d}</span>
                            ))}
                         </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-[10px] text-text-secondary">{formatDate(job.scheduledDate)}</td>
                      <td className="py-4 px-6">
                         <StatusBadge 
                          status={job.status} 
                          type={job.status === 'active' ? 'accent' : job.status === 'completed' ? 'success' : 'warning'} 
                         />
                      </td>
                      <td className="py-4 px-6">
                         <div className="flex items-center gap-2">
                            <div className="w-5 h-5 bg-navy border border-border flex items-center justify-center text-[8px] font-bold">MW</div>
                            <span className="text-[10px] font-mono text-text-muted">M. Webb</span>
                         </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                         <div className="flex justify-end gap-2">
                            <ActionIcon icon={FileText} tooltip="Brief" />
                            <ActionIcon icon={MapIcon} tooltip="Planner" />
                            <ActionIcon icon={Camera} tooltip="Media" />
                            <ActionIcon icon={Zap} tooltip="Report" />
                         </div>
                      </td>
                    </>
                  )}
                />
              </DataCard>
            </div>
          </div>

          {/* Side Column */}
          <div className="col-span-12 lg:col-span-3 space-y-8">
            <OperationalAlerts />
            
            <DataCard title="Operator Performance" subtitle="Flight Efficiency Analytics">
               <div className="mt-6 space-y-4">
                  <EfficiencyMetric label="Uptime" value={98.2} />
                  <EfficiencyMetric label="Data Flow" value={84.1} />
                  <EfficiencyMetric label="Safety Score" value={100} />
               </div>
            </DataCard>
          </div>
        </div>
      </div>

      {/* Quick Action FAB */}
      <div className="fixed bottom-10 right-10 z-[100]">
         <CommandButton 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 bg-accent text-background shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_50px_rgba(0,212,255,0.6)] flex items-center gap-4 transition-all active:scale-95"
         >
            <Plus size={20} strokeWidth={3} />
            <span className="font-syne font-black text-sm uppercase tracking-[0.2em]">New Operation</span>
         </CommandButton>
      </div>

      {/* Command Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[110]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[120]"
            >
              <div className="card-elevated p-0 border-accent/40 bg-panel overflow-hidden">
                <div className="p-6 border-b border-border bg-background-secondary/50 flex items-center justify-between">
                   <div>
                      <h3 className="font-syne font-bold text-base uppercase tracking-widest text-accent">Initiate Command</h3>
                      <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Select operational protocol</p>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                      <Zap size={14} />
                   </button>
                </div>
                <div className="p-2 grid grid-cols-1 gap-1">
                   <ModalActionItem icon={Plus} label="New Mission Brief" desc="Create client project and intake scope." />
                   <ModalActionItem icon={MapIcon} label="Flight Planner" desc="Initiate geospatial mission design." />
                   <ModalActionItem icon={MonitorPlay} label="Manual Flight Entry" desc="Log external mission data." />
                   <ModalActionItem icon={Send} label="Upload Media" desc="Ingest aircraft assets for AI analysis." />
                   <ModalActionItem icon={Zap} label="Generate Report" desc="Compile mission findings with AI." />
                </div>
                <div className="p-4 bg-background-secondary/50 flex justify-between items-center px-6">
                   <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">System Ready / Operator: 8841</span>
                   <span className="font-mono text-[8px] text-accent uppercase tracking-widest">Ready for Command</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionIcon({ icon: Icon, tooltip }: any) {
  return (
    <button className="p-2 border border-border bg-background-secondary/30 text-text-muted hover:text-accent hover:border-accent transition-all group relative">
       <Icon size={12} />
       <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background border border-border text-[8px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {tooltip}
       </span>
    </button>
  );
}

function EfficiencyMetric({ label, value }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end">
          <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{label}</span>
          <span className="font-mono text-[10px] font-bold text-text-primary">{value}%</span>
       </div>
       <div className="h-1 bg-border w-full relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className="h-full bg-accent shadow-[0_0_8px_var(--accent)]"
          />
       </div>
    </div>
  );
}

function ModalActionItem({ icon: Icon, label, desc }: any) {
  return (
    <button className="flex items-center gap-5 p-4 hover:bg-accent/5 group transition-all text-left">
       <div className="w-10 h-10 border border-border flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent transition-all">
          <Icon size={18} />
       </div>
       <div className="flex flex-col">
          <span className="font-syne font-bold text-xs text-text-primary uppercase tracking-tight group-hover:text-accent transition-colors">{label}</span>
          <span className="font-sans text-[10px] text-text-muted">{desc}</span>
       </div>
       <ChevronRight size={14} className="ml-auto text-border group-hover:text-accent transition-all" />
    </button>
  );
}


