"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  User, 
  Shield, 
  Users, 
  Plane, 
  CreditCard, 
  Bell, 
  Link as LinkIcon, 
  Palette, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Zap, 
  Building,
  Mail,
  Smartphone,
  MapPin,
  Cpu,
  Globe,
  Database
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel, PremiumTable } from "@/components/ui/altitude-ui";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 pb-32">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Operational Configuration</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Platform Governance</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
            Manage your operator profile, fleet, team and commercial rate card. This configuration powers all automated job sheets and reports.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost">Backup Config</CommandButton>
           <CommandButton variant="primary"><Save size={14} /> Commit All Changes</CommandButton>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Sidebar Navigation */}
         <div className="col-span-12 lg:col-span-3 space-y-2">
            <NavTab label="Operator Profile" icon={Building} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
            <NavTab label="Branding & Design" icon={Palette} active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} />
            <NavTab label="Team Management" icon={Users} active={activeTab === 'team'} onClick={() => setActiveTab('team')} />
            <NavTab label="Equipment Register" icon={Plane} active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
            <NavTab label="Commercial Rate Card" icon={CreditCard} active={activeTab === 'ratecard'} onClick={() => setActiveTab('ratecard')} />
            <NavTab label="Notification Rules" icon={Bell} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
            <NavTab label="API Integrations" icon={LinkIcon} active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} />
            <NavTab label="Security & Access" icon={Shield} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
         </div>

         {/* Main Content Area */}
         <div className="col-span-12 lg:col-span-9">
            <AnimatePresence mode="wait">
               {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                     <SectionPanel title="Business Identity">
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="label">Legal Business Name</label>
                              <input type="text" defaultValue="Altitude Aerial Operations Ltd" className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">Contact Email</label>
                              <input type="email" defaultValue="ops@altitude.io" className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">Contact Phone</label>
                              <input type="text" defaultValue="+44 20 7418 2000" className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">Business Address</label>
                              <input type="text" defaultValue="50 Bank St, Canary Wharf, London" className="input-field" />
                           </div>
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Regulatory Credentials">
                        <div className="grid grid-cols-3 gap-6">
                           <div className="space-y-2">
                              <label className="label">CAA Operator ID</label>
                              <input type="text" defaultValue="GBR-OP-77412X" className="input-field font-mono uppercase" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">GVC Certificate #</label>
                              <input type="text" defaultValue="GVC-2024-4412" className="input-field font-mono uppercase" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">GVC Expiry</label>
                              <input type="date" defaultValue="2025-06-12" className="input-field" />
                           </div>
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Insurance Proof">
                        <div className="grid grid-cols-3 gap-6">
                           <div className="space-y-2">
                              <label className="label">Provider</label>
                              <input type="text" defaultValue="Moonrock Insurance" className="input-field" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">Policy Number</label>
                              <input type="text" defaultValue="ALT-INS-8812-X" className="input-field font-mono" />
                           </div>
                           <div className="space-y-2">
                              <label className="label">Liability Level</label>
                              <input type="text" defaultValue="£10,000,000" className="input-field" />
                           </div>
                        </div>
                     </SectionPanel>
                  </motion.div>
               )}

               {activeTab === 'integrations' && (
                  <motion.div key="integrations" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-6">
                     <IntegrationCard name="Mapbox GL JS" status="CONNECTED" type="Geospatial Engine" icon={Globe} />
                     <IntegrationCard name="Claude AI (Anthropic)" status="CONNECTED" type="Neural Compiler" icon={Cpu} />
                     <IntegrationCard name="DJI Cloud API" status="CONNECTED" type="Live Telemetry" icon={Smartphone} />
                     <IntegrationCard name="Polycam" status="ERROR" type="3D Reconstruction" icon={Layers} error="Invalid API Key Pattern" />
                     <IntegrationCard name="Cloudflare R2" status="CONNECTED" type="Asset Storage" icon={Database} />
                     <IntegrationCard name="Stripe" status="CONNECTED" type="Commercial Payments" icon={CreditCard} />
                  </motion.div>
               )}

               {activeTab === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                     <div className="flex justify-between items-center mb-4">
                        <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-text-primary">Personnel Registry</h4>
                        <CommandButton variant="primary"><Plus size={14} /> Invite New Crew</CommandButton>
                     </div>
                     <DataCard className="p-0">
                        <PremiumTable 
                           headers={["Name", "Role", "Certifications", "Assigned Jobs", "Status", "Actions"]}
                           data={[
                              { name: "Marcus Webb", role: "PILOT", certs: "GVC, A2 CofC", jobs: 12, status: "ACTIVE" },
                              { name: "Sarah Chen", role: "OBSERVER", certs: "A2 CofC", jobs: 8, status: "ACTIVE" },
                              { name: "James Wilson", role: "ADMIN", certs: "-", jobs: 0, status: "ACTIVE" },
                           ]}
                           renderRow={(member: any) => (
                              <>
                                 <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                       <span className="font-bold text-text-primary text-[11px] uppercase tracking-tight">{member.name}</span>
                                       <span className="font-mono text-[9px] text-text-muted">{member.role === 'PILOT' ? 'm.webb@altitude.io' : 's.chen@altitude.io'}</span>
                                    </div>
                                 </td>
                                 <td className="py-4 px-6">
                                    <StatusBadge status={member.role} type="default" />
                                 </td>
                                 <td className="py-4 px-6 font-mono text-[10px] text-accent uppercase tracking-widest">{member.certs}</td>
                                 <td className="py-4 px-6 font-mono text-[11px] text-text-primary">{member.jobs}</td>
                                 <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
                                       <span className="text-[9px] font-mono uppercase text-success">{member.status}</span>
                                    </div>
                                 </td>
                                 <td className="py-4 px-6">
                                    <div className="flex justify-end gap-2">
                                       <button className="p-2 border border-border text-text-muted hover:text-accent transition-all"><Settings size={14} /></button>
                                       <button className="p-2 border border-border text-text-muted hover:text-danger transition-all"><Trash2 size={14} /></button>
                                    </div>
                                 </td>
                              </>
                           )}
                        />
                     </DataCard>
                  </motion.div>
               )}

               {activeTab === 'ratecard' && (
                  <motion.div key="ratecard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                     <SectionPanel title="Revenue Configuration">
                        <div className="space-y-4">
                           <RateItem label="Standard Daily Flight Rate" value="850.00" />
                           <RateItem label="Half-Day Flight Rate" value="500.00" />
                           <RateItem label="Post-Production (Hourly)" value="85.00" />
                           <RateItem label="Neural Splat Processing Fee" value="250.00" />
                           <RateItem label="Aerial Survey Surcharge" value="150.00" />
                           <RateItem label="Travel (Per Mile)" value="0.45" />
                        </div>
                     </SectionPanel>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}

function NavTab({ label, icon: Icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 border transition-all text-left group",
        active ? "bg-accent border-accent text-background shadow-[0_0_20px_rgba(0,212,255,0.2)]" : "bg-panel border-border/40 text-text-muted hover:border-accent/40"
      )}
    >
       <div className="flex items-center gap-4">
          <Icon size={18} className={cn(active ? "text-background" : "text-text-muted group-hover:text-accent")} />
          <span className="font-syne font-bold text-xs uppercase tracking-widest">{label}</span>
       </div>
       <ChevronRight size={14} className={active ? "text-background" : "text-border group-hover:text-accent"} />
    </button>
  );
}

function IntegrationCard({ name, status, type, icon: Icon, error }: any) {
  return (
    <div className={cn(
       "p-6 border bg-panel space-y-6 transition-all",
       status === 'CONNECTED' ? "border-border/40 hover:border-accent/40" : "border-danger/40 bg-danger/5"
    )}>
       <div className="flex justify-between items-start">
          <div className="p-3 bg-background-secondary border border-border text-accent">
             <Icon size={24} />
          </div>
          <StatusBadge status={status} type={status === 'CONNECTED' ? 'success' : 'danger'} />
       </div>
       <div className="space-y-1">
          <h4 className="font-syne font-bold text-sm text-text-primary uppercase tracking-tight">{name}</h4>
          <span className="font-mono text-[9px] text-text-muted uppercase tracking-[0.2em]">{type}</span>
       </div>
       {error && <p className="text-[9px] font-mono text-danger uppercase font-bold">ERROR: {error}</p>}
       <div className="flex justify-between items-center pt-2">
          <span className="text-[8px] font-mono text-text-muted uppercase">Last sync: 2 min ago</span>
          <CommandButton variant="ghost" className="py-1 px-3 text-[8px] border-border/60">Configure Protocol</CommandButton>
       </div>
    </div>
  );
}

function RateItem({ label, value }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-background-secondary border border-border">
       <span className="font-mono text-[10px] text-text-primary uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">GBP</span>
          <input 
            type="text" defaultValue={value}
            className="w-24 bg-panel border border-border text-right px-3 py-1 font-mono text-xs font-bold text-text-primary focus:border-accent outline-none"
          />
       </div>
    </div>
  );
}
