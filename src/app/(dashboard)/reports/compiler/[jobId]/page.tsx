"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Layout, 
  Settings, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Send, 
  Download, 
  Cpu, 
  CheckCircle2, 
  GripVertical,
  Type,
  Image as ImageIcon,
  Map as MapIcon,
  Table,
  Zap,
  Clock,
  Sparkles,
  Share2
} from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { MOCK_JOBS } from "@/lib/mock-data";

interface ReportSection {
  id: string;
  type: string;
  title: string;
  content: string;
  enabled: boolean;
}

export default function ReportCompilerPage({ params }: { params: { jobId: string } }) {
  const [sections, setSections] = useState<ReportSection[]>([
    { id: "1", type: "summary", title: "Executive Summary", content: "", enabled: true },
    { id: "2", type: "job_details", title: "Operational Parameters", content: "Auto-populated from Brief protocol.", enabled: true },
    { id: "3", type: "flight_data", title: "Flight Intelligence", content: "Telemetry & Weather data.", enabled: true },
    { id: "4", type: "media", title: "Asset Gallery", content: "Selected mission media.", enabled: true },
    { id: "5", type: "splat", title: "3D Neural Reconstruction", content: "Gaussian Splat viewer link.", enabled: true },
    { id: "6", type: "compliance", title: "Compliance Record", content: "RAMS & Signed Job Sheet.", enabled: true },
    { id: "7", type: "recommendations", title: "Technical Recommendations", content: "", enabled: true },
  ]);

  const [activeSectionId, setActiveSectionId] = useState<string>("1");
  const [isDrafting, setIsDrafting] = useState<string | null>(null);

  const job = MOCK_JOBS.find(j => j.id === params.jobId) || MOCK_JOBS[0];

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleDraftNarrative = (id: string) => {
    setIsDrafting(id);
    // Simulating AI generation delay
    setTimeout(() => {
      setSections(sections.map(s => s.id === id ? { 
        ...s, 
        content: s.type === 'summary' 
          ? `Mission ${job.reference} was successfully executed at ${job.location}. The primary objective was to perform a high-resolution structural assessment and 3D neural reconstruction of the primary infrastructure module. Our flight team achieved 100% shot list fulfilment across 142 valid assets with no safety incidents recorded.`
          : `Following the neural reconstruction, we have identified minor surface degradation on the upper North-East parapet. We recommend a focused inspection within the next 24 months. All other structural elements are verified within operational tolerances.`
      } : s));
      setIsDrafting(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 pt-20 pl-[72px] bg-void flex overflow-hidden">
      {/* Left: Section Navigator */}
      <div className="w-[300px] bg-panel border-r border-border flex flex-col z-50">
         <div className="p-6 border-b border-border bg-background-secondary/50">
            <div className="flex items-center justify-between mb-2">
               <span className="font-mono text-[9px] text-accent uppercase tracking-[0.2em]">Neural Compiler v2.1</span>
               <StatusBadge status="DRAFTING" type="accent" />
            </div>
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest">{job.reference} Report Builder</h4>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {sections.map((section) => (
               <div 
                 key={section.id}
                 className={cn(
                   "group flex items-center gap-3 p-3 border transition-all cursor-pointer",
                   activeSectionId === section.id ? "bg-accent/5 border-accent/40" : "bg-panel border-border/40 hover:border-accent/20"
                 )}
                 onClick={() => setActiveSectionId(section.id)}
               >
                  <GripVertical size={14} className="text-border group-hover:text-text-muted shrink-0" />
                  <div className="flex-1 flex flex-col min-w-0">
                     <span className={cn(
                        "font-syne font-bold text-[10px] uppercase tracking-tight truncate",
                        activeSectionId === section.id ? "text-accent" : "text-text-primary"
                     )}>{section.title}</span>
                     <span className="font-mono text-[8px] text-text-muted uppercase">TYPE: {section.type}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSection(section.id); }}
                    className={cn(
                      "w-4 h-4 border border-border flex items-center justify-center transition-colors",
                      section.enabled ? "bg-accent border-accent" : ""
                    )}
                  >
                     {section.enabled && <CheckCircle2 size={10} className="text-background" />}
                  </button>
               </div>
            ))}
            <button className="w-full py-4 border border-dashed border-border text-[9px] font-mono text-text-muted uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 mt-4">
               <Plus size={14} /> Add Protocol Section
            </button>
         </div>

         <div className="p-4 border-t border-border bg-background-secondary/30">
            <CommandButton variant="ghost" className="w-full justify-center text-[10px]"><Settings size={14} /> Report Configuration</CommandButton>
         </div>
      </div>

      {/* Main Content: Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
         {/* Editor Toolbar */}
         <div className="h-16 bg-panel border-b border-border flex items-center px-8 justify-between z-40">
            <div className="flex gap-4">
               <EditorAction icon={Type} label="Text" />
               <EditorAction icon={MapIcon} label="Map" />
               <EditorAction icon={ImageIcon} label="Asset" />
               <EditorAction icon={Table} label="Table" />
               <div className="w-[1px] h-6 bg-border mx-2" />
               <EditorAction icon={Zap} label="Data Block" />
            </div>
            <div className="flex gap-3">
               <CommandButton variant="ghost"><Eye size={14} /> Preview Protocol</CommandButton>
               <CommandButton variant="ghost"><Save size={14} /> Save Draft</CommandButton>
               <CommandButton variant="primary" className="shadow-[0_0_20px_var(--accent)]"><Download size={14} /> Finalise & Export</CommandButton>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-12">
               {/* Document Header (Fixed in Report) */}
               <div className="flex justify-between items-start border-b-4 border-accent pb-8">
                  <div className="space-y-4">
                     <span className="font-mono text-xs text-accent font-bold uppercase tracking-widest">Flight Intelligence Report</span>
                     <h1 className="text-5xl font-syne font-black text-text-primary uppercase tracking-tighter">Mission Delivery Package</h1>
                     <div className="flex gap-8 pt-4">
                        <ReportMeta label="Job Reference" value={job.reference} />
                        <ReportMeta label="Target Site" value={job.location} />
                        <ReportMeta label="Protocol Type" value="UAV Inspection" />
                        <ReportMeta label="Date" value={formatDate(job.createdAt)} />
                     </div>
                  </div>
                  <div className="w-24 h-24 bg-panel border border-border flex items-center justify-center text-accent">
                     <Zap size={48} strokeWidth={1} />
                  </div>
               </div>

               {/* Active Section Content */}
               <AnimatePresence mode="wait">
                  {sections.filter(s => s.id === activeSectionId).map((section) => (
                     <motion.div 
                       key={section.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                       className="space-y-8"
                     >
                        <div className="flex justify-between items-center">
                           <h2 className="font-syne font-black text-2xl uppercase tracking-widest text-text-primary">{section.title}</h2>
                           {(section.type === 'summary' || section.type === 'recommendations') && (
                              <button 
                                onClick={() => handleDraftNarrative(section.id)}
                                disabled={isDrafting !== null}
                                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/40 text-[10px] font-mono text-accent uppercase tracking-widest hover:bg-accent hover:text-background transition-all"
                              >
                                 <Sparkles size={14} className={isDrafting === section.id ? "animate-spin" : ""} />
                                 {isDrafting === section.id ? "Initialising Narrative..." : "Draft Protocol Narrative"}
                              </button>
                           )}
                        </div>

                        <div className="min-h-[400px] p-8 bg-panel border border-border/40 focus-within:border-accent/40 transition-colors">
                           <textarea 
                             className="w-full h-full bg-transparent border-none text-sm text-text-secondary leading-relaxed font-sans focus:ring-0 p-0 resize-none min-h-[400px]"
                             placeholder="Protocol content pending. Select 'Draft Narrative' to initialise using mission intelligence..."
                             value={section.content}
                             onChange={(e) => {
                               setSections(sections.map(s => s.id === section.id ? { ...s, content: e.target.value } : s));
                             }}
                           />
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>
      </div>

      {/* Right: Asset/Data Picker */}
      <div className="w-[320px] bg-panel border-l border-border flex flex-col z-50">
         <div className="p-6 border-b border-border bg-background-secondary/50">
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest">Intelligence Feed</h4>
         </div>
         <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <SectionPanel title="Mission Metrics">
               <div className="space-y-4">
                  <MetricItem label="Flight Duration" value="42:12 MIN" />
                  <MetricItem label="Total Assets" value="142 JPG" />
                  <MetricItem label="Max Altitude" value="62.4M AGL" />
                  <MetricItem label="Site Coverage" value="98.2%" />
               </div>
            </SectionPanel>

            <SectionPanel title="Linked 3D Assets">
               <div className="p-4 bg-background-secondary border border-accent/20 group hover:border-accent transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold">Neural Splat v1</span>
                     <ExternalLink size={12} className="text-accent" />
                  </div>
                  <div className="aspect-video bg-void flex items-center justify-center mb-3">
                     <ImageIcon size={24} className="text-accent opacity-20" />
                  </div>
                  <CommandButton variant="ghost" className="w-full py-2 text-[8px]">Insert Viewer Block</CommandButton>
               </div>
            </SectionPanel>

            <SectionPanel title="Report Distribution">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-success" />
                     <span className="text-[9px] font-mono text-text-muted uppercase">Client Portal Published</span>
                  </div>
                  <CommandButton variant="outline" className="w-full justify-center text-[10px]"><Share2 size={12} /> Send to Client Hub</CommandButton>
               </div>
            </SectionPanel>
         </div>
      </div>
    </div>
  );
}

function EditorAction({ icon: Icon, label }: any) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 border border-border bg-background-secondary/50 text-text-muted hover:text-accent hover:border-accent transition-all">
       <Icon size={14} />
       <span className="font-mono text-[9px] uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ReportMeta({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="font-mono text-[10px] font-bold text-text-primary uppercase">{value}</span>
    </div>
  );
}

function MetricItem({ label, value }: any) {
  return (
    <div className="flex justify-between items-center border-b border-border/40 pb-2">
       <span className="font-mono text-[9px] text-text-muted uppercase">{label}</span>
       <span className="font-mono text-[10px] font-bold text-text-primary">{value}</span>
    </div>
  );
}

function ExternalLink({ size, className }: any) {
   return (
      <svg 
         xmlns="http://www.w3.org/2000/svg" width={size} height={size} 
         viewBox="0 0 24 24" fill="none" stroke="currentColor" 
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}
      >
         <path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      </svg>
   )
}
