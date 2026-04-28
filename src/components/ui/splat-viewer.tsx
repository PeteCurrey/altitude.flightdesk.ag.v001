"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, RefreshCcw, Maximize2 } from "lucide-react";

interface SplatViewerProps {
  url: string;
  className?: string;
  autoRotate?: boolean;
}

// Note: In production, this would use a package like 'gsplat' or 'splat.js'
// Example: import * as SPLAT from "gsplat";

export function SplatViewer({ url, className, autoRotate = true }: SplatViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Stub for WebGL/WebGPU Gaussian Splat renderer initialization
    let isActive = true;

    const initSplat = async () => {
      try {
        console.log(`[SplatViewer] Initialising WebGL renderer for: ${url}`);
        
        // Simulating the heavy payload download and GPU initialization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (!isActive) return;
        setIsLoading(false);
        
        // In production:
        // const viewer = new SPLAT.Viewer(containerRef.current);
        // await viewer.loadFile(url);
        // viewer.start();
        
      } catch (err: any) {
        if (!isActive) return;
        console.error("[SplatViewer] Failed to load splat:", err);
        setError("Failed to initialize WebGPU Splat Renderer.");
        setIsLoading(false);
      }
    };

    initSplat();

    return () => {
      isActive = false;
      // In production: viewer.dispose();
    };
  }, [url]);

  return (
    <div className={cn("relative w-full h-full bg-void overflow-hidden flex items-center justify-center", className)} ref={containerRef}>
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-void/80 backdrop-blur-sm gap-4">
          <Loader2 className="animate-spin text-accent" size={32} />
          <div className="text-center space-y-1">
             <h4 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] font-bold">Compiling Neural Radiance Field</h4>
             <p className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Loading Gaussian Data into WebGPU Buffer...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-danger/10 gap-4 p-6 text-center">
          <p className="font-mono text-[10px] text-danger uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Mock Renderer Visuals (When Loaded) */}
      {!isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
           <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void" />
           
           {/* Mock Interactive Hint */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-panel/80 backdrop-blur-md border border-border/40 rounded-full">
              <RefreshCcw size={12} className="text-accent animate-spin-slow" />
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Interactive 3D Context</span>
           </div>
        </div>
      )}
      
      {/* Tools */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
         <button className="p-2 bg-panel/80 backdrop-blur-md border border-border/40 text-text-muted hover:text-accent transition-colors">
            <Maximize2 size={14} />
         </button>
      </div>
    </div>
  );
}
