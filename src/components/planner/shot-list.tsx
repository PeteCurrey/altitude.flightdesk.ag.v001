"use client";

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Camera, 
  Settings, 
  ChevronRight, 
  Copy, 
  Move, 
  Layers, 
  Clock, 
  Video, 
  Eye,
  Info,
  Maximize2,
  MoreVertical,
  CheckCircle2,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, PremiumTable } from "@/components/ui/altitude-ui";

interface Shot {
  id: string;
  number: number;
  name: string;
  description: string;
  linkedWaypoints: string[]; // IDs
  duration: string;
  settings: string;
  gimbal: string;
  status: string;
}

const SHOT_TEMPLATES = [
  { name: "Opening Establishing Shot", desc: "Wide view of site from entry point.", gimbal: "-15°", dur: "15s", settings: "4K/30fps, ISO 100" },
  { name: "Slow POI Orbit", desc: "Circular orbit around central asset.", gimbal: "-45°", dur: "45s", settings: "4K/60fps, ISO 200" },
  { name: "Reveal Rise", desc: "Ascending vertical rise while tilting gimbal.", gimbal: "0° to -90°", dur: "20s", settings: "5.1K/24fps" },
  { name: "Nadir Survey Pass", desc: "Top-down grid coverage for mapping.", gimbal: "-90°", dur: "Variable", settings: "Raw/DNG" },
  { name: "Gaussian Splat Pass", desc: "Multi-altitude oblique capture for neural reconstruction.", gimbal: "-45°", dur: "120s", settings: "4K/60fps" },
];

export function ShotList({ jobId, waypoints = [] }: { jobId: string, waypoints: any[] }) {
  const [shots, setShots] = useState<Shot[]>([
    { 
      id: "1", number: 1, name: "Site Orientation Wide", 
      description: "Establishing shot from South-West boundary.", 
      linkedWaypoints: ["wp1", "wp2"], duration: "12s", settings: "4K/30 - H.265", 
      gimbal: "-15°", status: "PLANNED" 
    },
    { 
      id: "2", number: 2, name: "North Tower Facade Orbit", 
      description: "Detail scan of primary structure.", 
      linkedWaypoints: ["wp4", "wp5", "wp6"], duration: "45s", settings: "4K/60 - D-Log", 
      gimbal: "-45°", status: "PLANNED" 
    }
  ]);

  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);

  const addShotFromTemplate = (template: typeof SHOT_TEMPLATES[0]) => {
    const newShot: Shot = {
      id: Math.random().toString(),
      number: shots.length + 1,
      name: template.name,
      description: template.desc,
      linkedWaypoints: [],
      duration: template.dur,
      settings: template.settings,
      gimbal: template.gimbal,
      status: "PLANNED"
    };
    setShots([...shots, newShot]);
  };

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Left: Shot List Table */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
         <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
               <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-text-primary">Operational Shot List</h4>
               <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Connect technical waypoints to creative deliverables.</p>
            </div>
            <div className="flex gap-3">
               <CommandButton variant="ghost"><Copy size={14} /> Duplicate List</CommandButton>
               <CommandButton variant="primary" onClick={() => addShotFromTemplate(SHOT_TEMPLATES[0])}><Plus size={14} /> Add Individual Shot</CommandButton>
            </div>
         </div>

         <DataCard className="p-0 border-border/40">
            <PremiumTable 
               headers={["#", "Shot Protocol", "Linkage", "Dur", "Camera / Gimbal", "Status", "Actions"]}
               data={shots}
               renderRow={(shot: Shot) => (
                  <>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-muted">{shot.number.toString().padStart(2, '0')}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col">
                           <span className="font-syne font-bold text-[11px] text-text-primary uppercase tracking-tight">{shot.name}</span>
                           <span className="font-mono text-[8px] text-text-muted uppercase truncate max-w-[200px]">{shot.description}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                           <Layers size={10} className="text-accent" />
                           <span className="font-mono text-[9px] text-accent uppercase tracking-widest">WPs: {shot.linkedWaypoints.length || 'NONE'}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6 font-mono text-[10px] text-text-secondary">{shot.duration}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                              <Camera size={10} className="text-text-muted" />
                              <span className="font-mono text-[8px] text-text-primary uppercase">{shot.settings}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Maximize2 size={10} className="text-text-muted" />
                              <span className="font-mono text-[8px] text-text-primary uppercase">{shot.gimbal}</span>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <StatusBadge status={shot.status} type="default" />
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => setSelectedShotId(shot.id)} className="p-2 border border-border text-text-muted hover:text-accent transition-all">
                              <Settings size={14} />
                           </button>
                           <button className="p-2 border border-border text-text-muted hover:text-danger transition-all">
                              <Trash2 size={14} />
                           </button>
                        </div>
                     </td>
                  </>
               )}
            />
         </DataCard>
      </div>

      {/* Right: Template Library & Inspector */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
         <DataCard title="Protocol Templates" subtitle="Pre-defined Shot Archetypes">
            <div className="space-y-3 mt-4">
               {SHOT_TEMPLATES.map((t) => (
                  <button 
                    key={t.name}
                    onClick={() => addShotFromTemplate(t)}
                    className="w-full p-4 bg-background-secondary border border-border flex items-center justify-between group hover:border-accent transition-all text-left"
                  >
                     <div className="flex flex-col gap-1">
                        <span className="font-syne font-bold text-[10px] text-text-primary uppercase tracking-tight">{t.name}</span>
                        <span className="font-mono text-[8px] text-text-muted uppercase leading-tight">{t.desc}</span>
                     </div>
                     <Plus size={14} className="text-border group-hover:text-accent" />
                  </button>
               ))}
            </div>
         </DataCard>

         {selectedShotId && (
            <DataCard className="bg-accent/5 border-accent/20">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-accent">Shot Inspector</h4>
                  <button onClick={() => setSelectedShotId(null)} className="text-accent hover:text-white">×</button>
               </div>
               <div className="space-y-4">
                  <div className="space-y-1">
                     <label className="label">Linked Path Segments</label>
                     <div className="p-3 bg-void border border-accent/20 flex flex-wrap gap-2">
                        {waypoints.slice(0, 3).map(wp => (
                           <div key={wp.id} className="px-2 py-1 bg-accent/10 border border-accent/20 text-[9px] font-mono text-accent uppercase">WP-{wp.index + 1}</div>
                        ))}
                        <button className="px-2 py-1 border border-dashed border-accent/20 text-[9px] font-mono text-accent/60 uppercase">+ Link</button>
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="label">Gimbal Logic</label>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-void border border-border">
                           <span className="font-mono text-[8px] text-text-muted uppercase">Pitch</span>
                           <p className="font-mono text-xs font-bold text-text-primary">-45.0°</p>
                        </div>
                        <div className="p-3 bg-void border border-border">
                           <span className="font-mono text-[8px] text-text-muted uppercase">Yaw Lock</span>
                           <p className="font-mono text-xs font-bold text-text-primary">142° SE</p>
                        </div>
                     </div>
                  </div>
                  <CommandButton variant="primary" className="w-full justify-center mt-2">Commit Shot Configuration</CommandButton>
               </div>
            </DataCard>
         )}
      </div>
    </div>
  );
}
