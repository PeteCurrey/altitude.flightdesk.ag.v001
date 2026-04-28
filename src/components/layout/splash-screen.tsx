"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = "ALTITUDE".split("");

export function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("altitude_splash_seen");
    if (!seen) {
      setShow(true);
      sessionStorage.setItem("altitude_splash_seen", "1");
      const t = setTimeout(() => setShow(false), 4500);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ x: "100%", transition: { duration: 0.8, ease: [0.8, 0, 0.2, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

          {/* Rising Terrain Grid */}
          <motion.div
            initial={{ translateY: "20%", opacity: 0 }}
            animate={{ translateY: "0%", opacity: 0.15 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
              transform: 'perspective(600px) rotateX(70deg) scale(2)',
              transformOrigin: 'bottom'
            }}
          />

          {/* Altitude Contour Effect */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute inset-0 pointer-events-none"
            style={{
               backgroundImage: `radial-gradient(circle at 50% 50%, var(--accent) 0.5px, transparent 0.5px)`,
               backgroundSize: '30px 30px'
            }}
          />

          {/* Wordmark Container */}
          <div className="relative flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: 0.5 + i * 0.1,
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="font-syne font-bold text-[5rem] md:text-[7rem] tracking-[0.2em] text-text-primary leading-none"
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="font-syne text-sm text-text-secondary tracking-[0.4em] uppercase"
            >
              Drone Operations Command Centre
            </motion.p>
          </div>

          {/* Telemetry Corner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
            className="absolute bottom-10 right-10 flex flex-col items-end gap-1 font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]"
          >
            <span>SYSTEM BOOT</span>
            <span>MISSION OPS</span>
            <span>AVORRIA</span>
            <div className="w-32 h-[1px] bg-accent/30 mt-2">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ delay: 2.5, duration: 1.5 }}
                 className="h-full bg-accent"
               />
            </div>
          </motion.div>

          {/* Centre Crosshair */}
          <motion.div 
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 0.2, scale: 1 }}
            transition={{ delay: 0.2, duration: 2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-64 h-64 border border-accent/20 rounded-full" />
            <div className="absolute w-[1px] h-32 bg-accent/20" />
            <div className="absolute h-[1px] w-32 bg-accent/20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
