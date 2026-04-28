"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  UserCheck, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  Zap, 
  Clock, 
  Award,
  MoreVertical,
  Activity,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";
import { MOCK_USERS } from "@/lib/mock-data";

export default function TeamManagementPage() {
  const [activeTab, setActiveTab] = useState("pilots");

  return (
    <div className="space-y-8 pb-32">
      {/* Team Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Operational Readiness</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Pilot Network & Team</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
             Manage pilot certifications, GVC compliance, flight currency and mission assignments across your network.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><History size={14} /> Duty Logs</CommandButton>
           <CommandButton variant="primary"><Plus size={14} /> Onboard Pilot</CommandButton>
        </div>
      </div>

      {/* Network Health Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Total Personnel</span>
               <span className="text-2xl font-syne font-black text-text-primary">12 Operators</span>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">4 Active Flight Wings</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Compliance Status</span>
               <span className="text-2xl font-syne font-black text-success">98.2%</span>
               <p className="text-[9px] font-mono text-success/60 mt-2 uppercase">1 Cert Awaiting Renewal</p>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Pilot Currency</span>
               <span className="text-2xl font-syne font-black text-text-primary">424h</span>
               <p className="text-[9px] font-mono text-text-muted mt-2 uppercase">30-Day Network Flight Time</p>
            </div>
         </DataCard>

         <DataCard className="bg-accent/5 border-accent/20">
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Duty Availability</span>
               <span className="text-2xl font-syne font-black text-accent uppercase">High</span>
               <p className="text-[9px] font-mono text-accent/60 mt-2 uppercase">4 Ready for Immediate Dispatch</p>
            </div>
         </DataCard>
      </div>

      {/* Team Table Area */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex border border-border bg-panel">
               <TeamTab label="Pilots" active={activeTab === 'pilots'} count={8} onClick={() => setActiveTab('pilots')} />
               <TeamTab label="Command Staff" active={activeTab === 'staff'} count={4} onClick={() => setActiveTab('staff')} />
               <TeamTab label="Contractors" active={activeTab === 'contractors'} count={2} onClick={() => setActiveTab('contractors')} />
            </div>

            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input 
                     type="text" 
                     placeholder="Filter by name, role..." 
                     className="bg-panel border border-border px-10 py-2 text-[10px] font-mono w-48 focus:border-accent outline-none"
                  />
               </div>
            </div>
         </div>

         <DataCard className="p-0">
            <PremiumTable 
               headers={["Operator", "Role", "Certifications", "Flight Time", "Status", "Actions"]}
               data={MOCK_USERS}
               renderRow={(user: any) => (
                  <>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-navy border border-border flex items-center justify-center font-bold text-xs uppercase">{user.name.split(' ').map((n: string) => n[0]).join('')}</div>
                           <div className="flex flex-col">
                              <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{user.name}</span>
                              <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{user.email}</span>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6 font-mono text-[9px] text-text-muted uppercase">{user.role}</td>
                     <td className="py-4 px-6">
                        <div className="flex gap-1">
                           <StatusBadge status="GVC" type="success" />
                           <StatusBadge status="A2CofC" type="success" />
                        </div>
                     </td>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-primary">124.5h</td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                           <span className="font-mono text-[9px] text-text-secondary uppercase">Active</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Mail size={14} />
                           </button>
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Award size={14} />
                           </button>
                           <button className="p-2 border border-border text-text-muted hover:text-accent hover:border-accent transition-all">
                              <Activity size={14} />
                           </button>
                        </div>
                     </td>
                  </>
               )}
            />
         </DataCard>
      </div>

      {/* Certification Tracker (Placeholder) */}
      <SectionPanel title="Compliance Warning System">
         <DataCard className="bg-warning/5 border-warning/30">
            <div className="flex items-center gap-4">
               <AlertCircle size={20} className="text-warning" />
               <div className="flex-1">
                  <h5 className="font-syne font-bold text-xs uppercase tracking-widest text-warning">Upcoming Certification Expiry</h5>
                  <p className="text-[10px] font-mono text-text-muted uppercase mt-1">
                     **Marcus Webb** GVC Certification expires in 12 days. Mission assignment restricted from 12/04/2024.
                  </p>
               </div>
               <CommandButton variant="primary" className="py-2 px-6 text-[9px] h-fit">Initiate Renewal Protocol</CommandButton>
            </div>
         </DataCard>
      </SectionPanel>
    </div>
  );
}

function TeamTab({ label, active, count, onClick }: any) {
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
