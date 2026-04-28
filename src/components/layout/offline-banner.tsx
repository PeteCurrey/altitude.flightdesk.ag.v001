"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, AlertTriangle, RefreshCcw } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[200] h-10 bg-danger text-white flex items-center justify-center gap-4 px-6 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <WifiOff size={14} className="animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Connection Severed // Operating in Offline Protocol</span>
          </div>
          <div className="h-4 w-[1px] bg-white/20" />
          <p className="text-[9px] font-sans uppercase tracking-widest opacity-80">Local queue active. Flight logs will synchronise upon restoration.</p>
          <button 
            onClick={() => window.location.reload()}
            className="ml-auto flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-[9px] font-mono uppercase"
          >
            <RefreshCcw size={10} /> Force Reconnect
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
