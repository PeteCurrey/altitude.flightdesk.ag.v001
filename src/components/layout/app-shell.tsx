"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { Bell, Search, Activity, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_METADATA: Record<string, { title: string; sub: string; crumbs: string[] }> = {
  "/dashboard": { 
    title: "Command Centre",  
    sub: "Operational overview of active flight wings and client pipelines.",
    crumbs: ["Altitude", "Ops", "Command Centre"]
  },
  "/briefs": { 
    title: "Briefs & CRM",    
    sub: "Manage client intake, mission specifications and commercial pipeline.",
    crumbs: ["Altitude", "CRM", "Briefs"]
  },
  "/planner": { 
    title: "Flight Planner",  
    sub: "Geospatial mission design, 3D terrain analysis and airspace authorization.",
    crumbs: ["Altitude", "Ops", "Flight Planner"]
  },
  "/live": { 
    title: "Live Cockpit",    
    sub: "Real-time telemetry uplink and tactical mission control.",
    crumbs: ["Altitude", "Ops", "Live"]
  },
  "/media": { 
    title: "Media Ingest",    
    sub: "High-frequency asset processing and AI-powered metadata extraction.",
    crumbs: ["Altitude", "Data", "Media"]
  },
  "/jobsheets": { 
    title: "Job Sheets",      
    sub: "Regulatory compliance logs, pre-flight checklists and risk assessments.",
    crumbs: ["Altitude", "Docs", "Job Sheets"]
  },
  "/reports": { 
    title: "Reports Hub",     
    sub: "Mission analytics, inspection summaries and commercial intelligence.",
    crumbs: ["Altitude", "Data", "Reports"]
  },
  "/equipment": { 
    title: "Fleet Register",  
    sub: "Equipment maintenance logs, battery cycles and airframe status.",
    crumbs: ["Altitude", "Assets", "Equipment"]
  },
  "/settings": { 
    title: "System Settings", 
    sub: "Platform configuration, integration keys and workspace management.",
    crumbs: ["Altitude", "System", "Settings"]
  },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const key = Object.keys(PAGE_METADATA).find(k => pathname === k || pathname.startsWith(k + "/")) ?? "/dashboard";
  const meta = PAGE_METADATA[key] || { title: "Altitude", sub: "Mission Management", crumbs: ["Altitude"] };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-[margin-left] duration-300",
          isCollapsed ? "ml-[72px]" : "ml-[260px]"
        )}
      >
        {/* Top Bar */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-border bg-background/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
               <span className="font-mono text-[9px] text-text-muted uppercase tracking-[0.2em] leading-none">Workspace</span>
               <span className="font-syne font-bold text-xs text-text-primary mt-1 uppercase tracking-widest">AVORRIA FLIGHT DESK</span>
            </div>
            
            <div className="h-6 w-[1px] bg-border" />
            
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
               <span className="font-mono text-[9px] text-text-primary uppercase tracking-widest">System Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Input */}
            <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors" size={14} />
               <input 
                type="text" 
                placeholder="EXECUTE COMMAND... (⌘K)" 
                className="bg-background-secondary border border-border px-10 py-2 text-[10px] font-mono w-64 focus:border-accent focus:outline-none transition-all placeholder:text-text-muted/40"
               />
            </div>

            <div className="flex items-center gap-4">
               <button className="p-2 text-text-muted hover:text-accent transition-colors relative border border-transparent hover:border-border">
                  <Bell size={16} />
                  <span className="absolute top-2 right-2 w-1 h-1 bg-accent rounded-full" />
               </button>
               
               <div className="h-8 w-[1px] bg-border" />
               
               <button className="flex items-center gap-3 pl-2 group">
                  <div className="flex flex-col items-end text-right">
                     <span className="font-syne font-bold text-[10px] text-text-primary uppercase tracking-widest">P. CURREY</span>
                     <span className="font-mono text-[8px] text-text-muted uppercase tracking-tighter">OPERATOR_ID: 8841</span>
                  </div>
                  <div className="w-9 h-9 bg-accent/10 border border-accent/40 flex items-center justify-center group-hover:border-accent transition-all">
                     <User size={16} className="text-accent" />
                  </div>
               </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 px-10 py-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Page Header integrated into content */}
              <div className="mb-10 space-y-4">
                <nav className="flex items-center gap-2 text-[9px] font-mono text-text-muted uppercase tracking-[0.3em]">
                   {meta.crumbs.map((c, i) => (
                     <div key={c} className="flex items-center gap-2">
                        <span>{c}</span>
                        {i < meta.crumbs.length - 1 && <ChevronRight size={8} />}
                     </div>
                   ))}
                </nav>
                <div className="flex flex-col gap-1">
                   <h2 className="text-3xl font-syne font-extrabold text-text-primary uppercase tracking-tight">{meta.title}</h2>
                   <p className="text-sm text-text-secondary font-sans tracking-tight max-w-3xl">{meta.sub}</p>
                </div>
                <div className="h-[1px] w-full bg-gradient-to-r from-accent/40 via-border to-transparent mt-6" />
              </div>

              {/* Main Content Render */}
              <div className="stagger-reveal">
                 {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
