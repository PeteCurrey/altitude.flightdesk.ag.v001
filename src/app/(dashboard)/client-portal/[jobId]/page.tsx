"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Layers, Download, Lock } from "lucide-react";
import { SplatViewer } from "@/components/ui/splat-viewer";
import { DataCard, CommandButton } from "@/components/ui/altitude-ui";

export default function ClientPortalPage({ params }: { params: { jobId: string } }) {
  const [activeTab, setActiveTab] = useState("twin");

  return (
    <div className="fixed inset-0 pt-20 pl-[72px] bg-void flex flex-col overflow-hidden">
      {/* Client Portal Header */}
      <div className="h-16 bg-panel border-b border-border flex items-center px-6 justify-between z-50">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 border border-accent/20 flex items-center justify-center">
               <Lock size={16} className="text-accent" />
            </div>
            <div>
               <h2 className="text-sm font-syne font-bold text-text-primary uppercase tracking-widest">Secure Delivery Portal</h2>
               <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Job Ref: {params.jobId}</p>
            </div>
         </div>
         <div className="flex border border-border bg-background-secondary">
            <button 
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-4 text-[9px] font-mono uppercase tracking-widest transition-all ${activeTab === 'gallery' ? 'bg-accent/5 text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-primary border-b-2 border-transparent'}`}
            >
              Media Gallery
            </button>
            <button 
              onClick={() => setActiveTab('twin')}
              className={`px-6 py-4 text-[9px] font-mono uppercase tracking-widest transition-all ${activeTab === 'twin' ? 'bg-accent/5 text-accent border-b-2 border-accent' : 'text-text-muted hover:text-text-primary border-b-2 border-transparent'}`}
            >
              3D Digital Twin
            </button>
         </div>
         <div>
            <CommandButton variant="primary"><Download size={14} /> Download All Assets</CommandButton>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         <AnimatePresence mode="wait">
            {activeTab === 'twin' && (
               <motion.div 
                 key="twin" 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 className="flex-1 flex w-full h-full relative"
               >
                  <SplatViewer url="https://mock-storage.altitude.app/models/mock-scene.splat" />
                  
                  {/* Floating Controls */}
                  <div className="absolute top-6 left-6 z-50">
                     <DataCard className="p-4 bg-background/80 backdrop-blur-md min-w-[250px]">
                        <div className="flex items-center gap-2 mb-4">
                           <Layers size={14} className="text-accent" />
                           <h5 className="font-mono text-[10px] text-text-primary uppercase tracking-widest font-bold">Neural Radiance Field</h5>
                        </div>
                        <p className="text-[10px] font-sans text-text-muted mb-4">
                           Fully interactive 3D reconstruction generated via Gaussian Splatting. Use your mouse to orbit, pan, and zoom around the asset.
                        </p>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[9px] font-mono border-t border-border pt-2">
                              <span className="text-text-muted">RESOLUTION</span>
                              <span className="text-accent">HIGH</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-text-muted">POINTS</span>
                              <span className="text-text-primary">2.4M</span>
                           </div>
                        </div>
                     </DataCard>
                  </div>
               </motion.div>
            )}

            {activeTab === 'gallery' && (
               <motion.div 
                 key="gallery" 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 className="flex-1 p-8 overflow-y-auto"
               >
                  <div className="grid grid-cols-4 gap-6">
                     {/* Mock Gallery */}
                     {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="aspect-video bg-panel border border-border flex items-center justify-center">
                           <span className="font-mono text-[10px] text-text-muted uppercase">Asset {i+1}</span>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
