"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Download, 
  Maximize2, 
  ImageIcon, 
  Box, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Clock,
  ArrowRight
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

export default function ClientPortalPage({ params }: { params: { jobRef: string } }) {
  const [activeView, setActiveView] = useState("gallery");
  const job = MOCK_JOBS[0]; // Simulated retrieval by token

  return (
    <div className="min-h-screen bg-void text-text-primary selection:bg-accent selection:text-background font-sans">
      {/* Premium Header */}
      <nav className="h-24 border-b border-white/5 flex items-center px-12 justify-between bg-void/50 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-accent text-background flex items-center justify-center font-black italic">A</div>
             <span className="font-syne font-black text-xl tracking-tighter uppercase italic">Altitude</span>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col">
             <span className="font-mono text-[9px] text-accent uppercase tracking-[0.2em]">{params.jobRef}</span>
             <span className="font-syne font-bold text-xs uppercase tracking-widest text-white/80">{job.title}</span>
          </div>
        </div>
        <div className="flex gap-4">
           <CommandButton variant="ghost" className="border-white/10 text-white/60 hover:text-white"><MessageSquare size={14} /> Submit Feedback</CommandButton>
           <CommandButton variant="primary" className="bg-white text-black border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]">Accept Delivery</CommandButton>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-12 py-20 space-y-24">
         {/* Hero / Introduction */}
         <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
               <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
               <span className="font-mono text-[9px] text-white uppercase tracking-widest font-bold">Protocol Ready for Review</span>
            </div>
            <h1 className="text-6xl font-syne font-black text-white uppercase tracking-tighter leading-none">Your Digital Site <br /> Delivery is Complete.</h1>
            <p className="text-lg text-white/60 font-sans leading-relaxed">
               Welcome to your mission hub. Below you will find the processed results of the flight operations conducted at {job.location}. This includes your high-resolution media selects, 3D neural reconstruction and technical reporting.
            </p>
         </div>

         {/* Delivery Stats */}
         <div className="grid grid-cols-4 gap-1 border-y border-white/10 py-12">
            <DeliveryStat label="Assets Captured" value="142" />
            <DeliveryStat label="Data Volume" value="4.2 GB" />
            <DeliveryStat label="3D Resolution" value="8K NEURAL" />
            <DeliveryStat label="Processing" value="CLOUD NATIVE" />
         </div>

         {/* Protocol Navigation */}
         <div className="flex gap-12 border-b border-white/5">
            <PortalTab label="Asset Gallery" active={activeView === 'gallery'} onClick={() => setActiveView('gallery')} count="128" />
            <PortalTab label="3D Digital Twin" active={activeView === '3d'} onClick={() => setActiveTab('3d')} count="BETA" />
            <PortalTab label="Technical Report" active={activeView === 'report'} onClick={() => setActiveTab('report')} />
         </div>

         <AnimatePresence mode="wait">
            {activeView === 'gallery' && (
               <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                  <div className="grid grid-cols-3 gap-8">
                     {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="group relative aspect-video bg-white/5 border border-white/10 overflow-hidden cursor-zoom-in">
                           <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity">
                              <ImageIcon size={48} strokeWidth={1} />
                           </div>
                           {/* Watermark Overlay */}
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="font-syne font-black text-[40px] text-white/5 uppercase -rotate-12 select-none">PROOF — ALTITUDE</span>
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all" />
                           <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                              <div className="flex flex-col">
                                 <span className="font-mono text-[9px] text-accent uppercase font-bold">ASSET_44{i}_SELECT</span>
                                 <span className="text-[10px] text-white font-bold uppercase tracking-widest">High-Res DNG Protocol</span>
                              </div>
                              <Maximize2 size={16} className="text-white" />
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-center">
                     <CommandButton variant="outline" className="border-white/10 text-white/60 hover:text-white px-12 py-4">Load Protocol History <ChevronRight size={14} /></CommandButton>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Footer / Contact */}
         <div className="border-t border-white/5 pt-24 pb-48 grid grid-cols-2 gap-24">
            <div className="space-y-8">
               <h4 className="font-syne font-black text-2xl uppercase tracking-widest text-white">Need Technical Support?</h4>
               <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                  Our flight operations team is available to discuss the findings of this report or to provision higher-fidelity data exports.
               </p>
               <CommandButton variant="primary" className="bg-accent text-background border-accent shadow-[0_0_20px_rgba(0,212,255,0.2)]">Connect with Operations</CommandButton>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <div className="space-y-4">
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Operator Info</span>
                  <div className="space-y-1 text-xs text-white/60 uppercase font-bold">
                     <p>Altitude Aerial Operations</p>
                     <p>GBR-OP-77412X</p>
                     <p>+44 20 7418 2000</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">Security Compliance</span>
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-success">
                        <ShieldCheck size={12} />
                        <span className="text-[9px] font-mono font-bold uppercase">TLS 1.3 SECURE</span>
                     </div>
                     <div className="flex items-center gap-2 text-success">
                        <CheckCircle2 size={12} />
                        <span className="text-[9px] font-mono font-bold uppercase">ENCRYPTED AT REST</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}

function DeliveryStat({ label, value }: any) {
  return (
    <div className="flex flex-col gap-2 p-8">
       <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">{label}</span>
       <span className="text-4xl font-syne font-black text-white uppercase tracking-tighter leading-none">{value}</span>
    </div>
  );
}

function PortalTab({ label, active, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-2 py-6 text-[10px] font-mono uppercase tracking-[0.3em] transition-all relative",
        active ? "text-white" : "text-white/30 hover:text-white/60"
      )}
    >
      {label} {count && <span className="ml-2 text-accent/60">({count})</span>}
      {active && (
         <motion.div layoutId="portal-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
      )}
    </button>
  );
}
