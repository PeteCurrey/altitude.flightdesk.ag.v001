"use client";

import { useState, useRef } from "react";
import { Map, Source, Layer, NavigationControl, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, 
  LayoutGrid, 
  Map as MapIcon, 
  CheckCircle2, 
  Cpu, 
  Truck, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Trash2, 
  Maximize2,
  Info,
  Tag,
  Camera,
  Layers,
  FileUp,
  Image as ImageIcon,
  ChevronRight,
  Eye,
  ShieldCheck,
  Star
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoicGV0ZWFsdGl0dWRlIiwiYSI6ImNsdzR1ZzNxejBwYTMyaW93ZzN6ZzN6ZzYifQ.Placeholder";

export default function MediaHubPage({ params }: { params: { jobId: string } }) {
  const [activeTab, setActiveTab] = useState("gallery");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const job = MOCK_JOBS.find(j => j.id === params.jobId) || MOCK_JOBS[0];

  return (
    <div className="space-y-8 pb-32">
      {/* Media Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="font-mono text-[9px] text-accent uppercase tracking-[0.3em]">Post-Flight Ingest</span>
          <h1 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">Media Hub & AI Pipeline</h1>
          <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
            Manage, analyse and deliver mission assets. AI-powered metadata extraction and quality assessment for job {job.reference}.
          </p>
        </div>
        <div className="flex gap-3">
           <CommandButton variant="ghost"><FileUp size={14} /> Batch Export</CommandButton>
           <CommandButton variant="primary" onClick={() => setActiveTab('upload')}><CloudUpload size={14} /> Ingest Media Protocol</CommandButton>
        </div>
      </div>

      {/* Protocol Tabs */}
      <div className="flex border-b border-border bg-panel">
         <ProtocolTab label="Ingest Queue" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
         <ProtocolTab label="Asset Gallery" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
         <ProtocolTab label="Spatial Context" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
         <ProtocolTab label="Technical Selects" active={activeTab === 'selects'} onClick={() => setActiveTab('selects')} />
         <ProtocolTab label="Neural Processing" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
         <ProtocolTab label="Client Delivery" active={activeTab === 'delivery'} onClick={() => setActiveTab('delivery')} />
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <DataCard className="p-20 border-dashed border-2 flex flex-col items-center justify-center text-center gap-6 bg-background-secondary/30">
                  <div className="w-16 h-16 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                     <CloudUpload size={32} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="font-syne font-bold text-xl uppercase tracking-widest">Initialise Media Ingest</h3>
                     <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest">Supported: JPG, DNG, RAW, MP4, MOV (MAX 500MB PER ASSET)</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                     <CommandButton variant="primary" className="px-10">Select Local Files</CommandButton>
                     <CommandButton variant="ghost">Preserve Folder Logic</CommandButton>
                  </div>
               </DataCard>
            </motion.div>
         )}

         {activeTab === 'gallery' && (
            <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
               <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                     <FilterPill label="Perspective: Oblique" active />
                     <FilterPill label="Quality: > 90%" />
                     <FilterPill label="Type: Image" />
                     <FilterPill label="Shot: SHOT-04" />
                  </div>
                  <div className="relative w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
                     <input type="text" placeholder="Search metadata..." className="input-field pl-10 text-[10px]" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 15 }).map((_, i) => (
                     <AssetCard 
                       key={i} 
                       index={i} 
                       onClick={() => setSelectedAssetId(`asset-${i}`)}
                       selected={selectedAssetId === `asset-${i}`}
                     />
                  ))}
               </div>
            </motion.div>
         )}

         {activeTab === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[600px] border border-border relative">
               <Map
                  initialViewState={{ latitude: 53.4792, longitude: -2.2901, zoom: 17 }}
                  mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                  mapboxAccessToken={MAPBOX_TOKEN}
               >
                  {/* Mock Media Pins */}
                  {Array.from({ length: 10 }).map((_, i) => (
                     <Marker 
                        key={i} 
                        latitude={53.4792 + (Math.random() - 0.5) * 0.002} 
                        longitude={-2.2901 + (Math.random() - 0.5) * 0.002}
                     >
                        <button className="p-0.5 bg-accent border border-white shadow-lg hover:scale-125 transition-all">
                           <div className="w-6 h-6 bg-void flex items-center justify-center text-[8px] font-bold text-accent">IMG</div>
                        </button>
                     </Marker>
                  ))}
                  <NavigationControl position="bottom-right" />
               </Map>
               <div className="absolute top-6 left-6 z-40">
                  <DataCard className="p-4 bg-background/80 backdrop-blur-md min-w-[200px]">
                     <h5 className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold mb-3">Spatial Index</h5>
                     <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-mono text-text-primary">
                           <span className="text-text-muted">TOTAL PINS</span>
                           <span>142</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] font-mono text-text-primary">
                           <span className="text-text-muted">ZONE COVERAGE</span>
                           <span className="text-success">OPTIMAL</span>
                        </div>
                     </div>
                  </DataCard>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Lightbox Overlay */}
      <AnimatePresence>
         {selectedAssetId && (
            <div className="fixed inset-0 z-[100] bg-void/95 flex overflow-hidden">
               <div className="flex-1 p-12 flex items-center justify-center relative">
                  <button 
                     onClick={() => setSelectedAssetId(null)}
                     className="absolute top-8 left-8 p-3 border border-border text-text-muted hover:text-white transition-all bg-panel"
                  >
                     <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <div className="w-full h-full max-w-5xl max-h-[80vh] bg-panel border border-border/40 shadow-2xl relative flex items-center justify-center">
                     <ImageIcon size={64} className="text-accent opacity-20" />
                     <div className="absolute top-4 left-4 flex gap-2">
                        <StatusBadge status="94% QUALITY" type="success" />
                        <StatusBadge status="HERO" type="accent" />
                     </div>
                  </div>
               </div>
               
               <div className="w-[400px] bg-panel border-l border-border flex flex-col overflow-y-auto custom-scrollbar">
                  <div className="p-8 border-b border-border space-y-4">
                     <div className="flex items-center justify-between">
                        <h4 className="font-syne font-bold text-sm text-text-primary uppercase tracking-widest">IMG_2024_4412.DNG</h4>
                        <Star size={16} className="text-accent fill-accent" />
                     </div>
                     <div className="flex gap-2">
                        <CommandButton variant="ghost" className="py-2 text-[9px]">Assign to Shot-04</CommandButton>
                        <CommandButton variant="ghost" className="py-2 text-[9px]">Add to Delivery</CommandButton>
                     </div>
                  </div>

                  <div className="p-8 space-y-8">
                     <SectionPanel title="Technical Metadata">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                           <MetaItem label="ISO" value="100" />
                           <MetaItem label="Shutter" value="1/240" />
                           <MetaItem label="Aperture" value="f/2.8" />
                           <MetaItem label="Focal" value="24mm" />
                           <MetaItem label="Model" value="DJI P1" />
                           <MetaItem label="Dimensions" value="8192 x 5460" />
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Neural Analysis">
                        <div className="space-y-4">
                           <div className="flex flex-wrap gap-2">
                              {["SHARP", "OBLIQUE", "INDUSTRIAL", "FACADE", "STEADY"].map(tag => (
                                 <div key={tag} className="px-2 py-1 bg-accent/5 border border-accent/20 text-[8px] font-mono text-accent uppercase">{tag}</div>
                              ))}
                           </div>
                           <p className="text-[10px] font-sans text-text-muted leading-relaxed">
                              AI Confidence: 98.4%. Subject correctly identified as north-east infrastructure module. Excellent edge retention.
                           </p>
                        </div>
                     </SectionPanel>

                     <SectionPanel title="Spatial Location">
                        <div className="p-4 bg-background-secondary border border-border space-y-2">
                           <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-text-muted uppercase">Lat / Lng</span>
                              <span className="text-text-primary">53.4792, -2.2901</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="text-text-muted uppercase">Alt AGL</span>
                              <span className="text-text-primary">62.4m</span>
                           </div>
                        </div>
                     </SectionPanel>
                  </div>

                  <div className="mt-auto p-8 border-t border-border bg-background-secondary/30">
                     <CommandButton variant="primary" className="w-full justify-center py-4 text-[10px]">
                        <Download size={14} /> Download High-Res Protocol
                     </CommandButton>
                  </div>
               </div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

function ProtocolTab({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-4 text-[9px] font-mono uppercase tracking-widest transition-all border-b-2",
        active ? "border-accent text-accent bg-accent/5" : "border-transparent text-text-muted hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

function AssetCard({ index, onClick, selected }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        "group relative aspect-square bg-panel border transition-all cursor-pointer overflow-hidden",
        selected ? "border-accent ring-2 ring-accent/20" : "border-border/40 hover:border-accent/60"
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
         <ImageIcon size={24} className="text-accent/20 group-hover:scale-110 transition-transform" />
      </div>
      
      {/* Top Badges */}
      <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-4 h-4 bg-accent/90 flex items-center justify-center text-[8px] font-bold text-background">H</div>
         <div className="w-4 h-4 bg-success/90 flex items-center justify-center text-[8px] font-bold text-white">
            <CheckCircle2 size={8} />
         </div>
      </div>

      {/* Hover Info Strip */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-void/80 backdrop-blur-sm border-t border-accent/20 translate-y-full group-hover:translate-y-0 transition-transform">
         <div className="flex justify-between items-center">
            <span className="font-mono text-[8px] text-text-primary uppercase tracking-widest">IMG_4412.DNG</span>
            <span className="font-mono text-[8px] text-accent">1/240 f2.8</span>
         </div>
      </div>
      
      {selected && <div className="absolute inset-0 bg-accent/5 pointer-events-none" />}
    </motion.div>
  );
}

function FilterPill({ label, active }: any) {
  return (
    <button className={cn(
      "px-3 py-1.5 border font-mono text-[9px] uppercase tracking-widest transition-all shrink-0",
      active ? "bg-accent border-accent text-background" : "border-border text-text-muted hover:border-accent/40"
    )}>
       {label}
    </button>
  );
}

function MetaItem({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="text-[11px] font-bold text-text-primary uppercase">{value}</span>
    </div>
  );
}
