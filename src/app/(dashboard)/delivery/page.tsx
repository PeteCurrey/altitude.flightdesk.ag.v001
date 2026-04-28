"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Send, 
  Link as LinkIcon, 
  Eye, 
  Download, 
  Lock, 
  Globe, 
  Plus, 
  ExternalLink,
  Search,
  MoreVertical,
  Clock,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { MOCK_JOBS } from "@/lib/mock-data";

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-accent/10 border border-accent/20">
              <Send size={20} className="text-accent" />
           </div>
           <div>
              <h2 className="text-2xl font-bold font-syne text-primary leading-none">Client Delivery</h2>
              <p className="text-sm text-secondary mt-1">Manage secure portals, asset distribution, and client access.</p>
           </div>
        </div>
        <div className="flex gap-3">
           <button className="btn-primary">
              <Plus size={14} />
              Create Delivery Portal
           </button>
        </div>
      </div>

      {/* Delivery Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DeliveryMiniCard label="Active Portals" value="12" />
        <DeliveryMiniCard label="Total Downloads" value="1,248" />
        <DeliveryMiniCard label="Avg. Views / Portal" value="14" />
        <DeliveryMiniCard label="Total Bandwidth" value="482 GB" />
      </div>

      <div className="grid grid-cols-12 gap-8">
         {/* Active Portals List */}
         <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="card-elevated p-0 overflow-hidden">
               <div className="flex items-center justify-between p-4 border-b border-border/40 bg-navy/30">
                  <div className="flex gap-4">
                     <FilterTab label="All Portals" active={activeTab === "all"} onClick={() => setActiveTab("all")} />
                     <FilterTab label="Secure (Locked)" active={activeTab === "secure"} onClick={() => setActiveTab("secure")} />
                     <FilterTab label="Public" active={activeTab === "public"} onClick={() => setActiveTab("public")} />
                  </div>
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={14} />
                     <input 
                      type="text" 
                      placeholder="Search projects..." 
                      className="bg-void border border-border px-9 py-1.5 text-xs font-sans w-48 outline-none focus:border-accent/40"
                      style={{ borderRadius: '2px' }}
                     />
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="data-table">
                     <thead>
                        <tr>
                           <th>Project Portal</th>
                           <th>Access Key</th>
                           <th>Views</th>
                           <th>Last Accessed</th>
                           <th>Security</th>
                           <th></th>
                        </tr>
                     </thead>
                     <tbody>
                        {MOCK_JOBS.slice(0, 4).map(job => (
                          <tr key={job.id}>
                             <td>
                                <div className="flex flex-col">
                                   <span className="font-medium text-primary text-xs">{job.title}</span>
                                   <span className="text-[10px] text-tertiary font-mono uppercase tracking-widest">{job.client.company}</span>
                                </div>
                             </td>
                             <td><span className="font-mono text-xs text-accent">portal-882-{job.id}</span></td>
                             <td><span className="text-xs font-mono text-secondary">24</span></td>
                             <td><span className="text-xs text-tertiary">{formatDate(job.updatedAt)}</span></td>
                             <td>
                                <div className="flex items-center gap-2">
                                   <Lock size={12} className="text-success" />
                                   <span className="text-2xs font-mono text-success uppercase tracking-widest">Locked</span>
                                </div>
                             </td>
                             <td className="text-right">
                                <div className="flex justify-end gap-2">
                                   <button className="p-1.5 text-tertiary hover:text-primary"><ExternalLink size={14} /></button>
                                   <button className="p-1.5 text-tertiary hover:text-primary"><MoreVertical size={14} /></button>
                                </div>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Right Column: Portal Settings & Security */}
         <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="card-elevated relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Globe size={64} className="text-accent" />
               </div>
               <h3 className="section-title text-sm mb-4">Portal Configuration</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-navy/40 border border-border space-y-4">
                     <div className="space-y-2">
                        <label className="label">Custom Subdomain</label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-void border border-border text-xs font-mono text-secondary">
                           <span>client.altitudedrone.com/</span>
                           <input type="text" className="bg-transparent outline-none text-accent w-full" placeholder="project-ref" />
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-secondary">White-label Branding</span>
                        <div className="w-8 h-4 bg-accent/20 border border-accent/40 rounded-full relative">
                           <div className="absolute left-4 top-0.5 w-2.5 h-2.5 bg-accent rounded-full" />
                        </div>
                     </div>
                  </div>
                  <button className="btn-primary w-full py-2.5">
                     Update Global Portal Settings
                  </button>
               </div>
            </div>

            <div className="card">
               <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-success" />
                  <h3 className="section-title text-sm mb-0">Security Protocols</h3>
               </div>
               <div className="space-y-3">
                  <SecurityFeature label="AES-256 Encryption" enabled />
                  <SecurityFeature label="Time-based Expiring Links" enabled />
                  <SecurityFeature label="IP Access Filtering" />
                  <SecurityFeature label="Dual-factor Auth (OTP)" />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function DeliveryMiniCard({ label, value }: any) {
  return (
    <div className="card py-4">
       <span className="data-label">{label}</span>
       <div className="mt-1">
          <span className="text-xl font-bold font-syne text-primary">{value}</span>
       </div>
    </div>
  );
}

function FilterTab({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-[10px] font-mono uppercase tracking-[0.2em] transition-all border-b-2",
        active ? "border-accent text-accent" : "border-transparent text-tertiary hover:text-secondary"
      )}
    >
      {label}
    </button>
  );
}

function SecurityFeature({ label, enabled = false }: any) {
  return (
    <div className="flex items-center justify-between">
       <span className="text-xs text-secondary">{label}</span>
       {enabled ? (
         <CheckCircle2 size={12} className="text-success" />
       ) : (
         <div className="w-3 h-3 border border-tertiary/40" />
       )}
    </div>
  );
}
