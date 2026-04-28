"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Image as ImageIcon, 
  Film, 
  Box, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Zap, 
  ShieldCheck,
  Cpu,
  Layers,
  Maximize2,
  Trash2,
  MoreVertical,
  Plus
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_MEDIA } from "@/lib/mock-data";

export default function MediaIngestPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8 pb-32">
      {/* Media Control Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Data Architecture</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Media Ingest & AI</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
            High-frequency asset processing hub with integrated computer vision and Gaussian Splat 3D reconstruction.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><Cpu size={14} /> AI Processing Config</CommandButton>
           <CommandButton variant="primary"><Upload size={14} /> Upload Raw Assets</CommandButton>
        </div>
      </div>

      {/* Processing Pipeline Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <DataCard className="relative overflow-hidden">
            <div className="absolute right-[-20px] top-[-20px] opacity-5">
               <Cpu size={100} />
            </div>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Queue Status</span>
               <div className="flex items-center gap-3">
                  <span className="text-2xl font-syne font-black text-text-primary">84%</span>
                  <StatusBadge status="ACTIVE" type="accent" />
               </div>
               <div className="h-1 bg-border w-full mt-2">
                  <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} className="h-full bg-accent" />
               </div>
               <span className="font-mono text-[8px] text-text-muted mt-2 uppercase">12 Assets in Neural Buffer</span>
            </div>
         </DataCard>
         
         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Storage Utilisation</span>
               <span className="text-2xl font-syne font-black text-text-primary">2.4 TB</span>
               <span className="font-mono text-[8px] text-text-muted mt-2 uppercase">AWS S3 BUCKET: ALT-UK-OPS</span>
            </div>
         </DataCard>

         <DataCard>
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">AI Vision Tags</span>
               <span className="text-2xl font-syne font-black text-text-primary">1,420</span>
               <span className="font-mono text-[8px] text-text-muted mt-2 uppercase">98.4% Confidence Index</span>
            </div>
         </DataCard>

         <DataCard className="bg-accent/5 border-accent/20">
            <div className="flex flex-col gap-1">
               <span className="font-mono text-[9px] text-accent uppercase tracking-widest">Splat Active</span>
               <span className="text-2xl font-syne font-black text-accent">4 Models</span>
               <span className="font-mono text-[8px] text-accent/60 mt-2 uppercase">Processing: North Tower Scan</span>
            </div>
         </DataCard>
      </div>

      {/* Asset Browser */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex border border-border bg-panel">
               <TabButton label="All Assets" active={activeTab === 'all'} count={42} onClick={() => setActiveTab('all')} />
               <TabButton label="Images" active={activeTab === 'images'} count={34} onClick={() => setActiveTab('images')} />
               <TabButton label="Videos" active={activeTab === 'videos'} count={4} onClick={() => setActiveTab('videos')} />
               <TabButton label="3D / Splats" active={activeTab === '3d'} count={4} onClick={() => setActiveTab('3d')} />
            </div>

            <div className="flex items-center gap-3">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                  <input 
                     type="text" 
                     placeholder="Filter by Job ID, AI Tag..." 
                     className="bg-panel border border-border px-10 py-2 text-[10px] font-mono w-64 focus:border-accent outline-none"
                  />
               </div>
               <button className="py-2 px-4 flex items-center gap-2 bg-panel border border-border text-text-muted hover:text-text-primary transition-all">
                  <Filter size={12} />
                  <span className="text-[10px] font-mono uppercase">Neural Search</span>
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {MOCK_MEDIA.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col gap-3"
              >
                 <div className="aspect-video bg-panel border border-border overflow-hidden relative">
                    {/* Mock Image Content */}
                    <div className="absolute inset-0 bg-void">
                       <img src={item.thumbnailUrl} alt={item.filename} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                       <div className="flex justify-between items-start">
                          <button className="p-1.5 bg-void/80 border border-border pointer-events-auto text-text-primary hover:text-accent transition-colors">
                             <Maximize2 size={12} />
                          </button>
                          <div className="flex gap-1">
                             <button className="p-1.5 bg-void/80 border border-border pointer-events-auto text-text-primary hover:text-accent transition-colors">
                                <Download size={12} />
                             </button>
                             <button className="p-1.5 bg-void/80 border border-border pointer-events-auto text-text-primary hover:text-danger transition-colors">
                                <Trash2 size={12} />
                             </button>
                          </div>
                       </div>
                       <div className="flex justify-center">
                          <CommandButton variant="primary" className="py-1 px-4 text-[8px] pointer-events-auto">Analyse Data</CommandButton>
                       </div>
                    </div>
                    
                    {/* Status Badge Over Image */}
                    <div className="absolute bottom-2 left-2 pointer-events-none">
                       <StatusBadge status={item.fileType} type={item.fileType === 'model' ? 'accent' : 'default'} />
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-text-primary font-bold truncate uppercase tracking-tight">{item.filename}</span>
                    <div className="flex items-center justify-between font-mono text-[8px] text-text-muted uppercase">
                       <span>{item.jobId}</span>
                       <span>{(item.size / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                    
                    {/* AI Tags */}
                    <div className="flex gap-1 mt-2">
                       {item.aiTags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 border border-border text-[7px] font-mono text-text-muted uppercase tracking-tighter">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </motion.div>
            ))}
            
            {/* Upload Placeholder */}
            <div className="aspect-video border border-dashed border-border hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer">
               <Upload size={20} className="text-text-muted group-hover:text-accent transition-all" />
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-all">Add Missions Assets</span>
            </div>
         </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, count, onClick }: any) {
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
