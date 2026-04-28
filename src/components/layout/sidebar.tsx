"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, 
  ClipboardList, 
  Map, 
  RadioTower, 
  Image as ImageIcon,
  FileCheck, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Users, 
  Package, 
  Send, 
  MonitorPlay, 
  Layers, 
  Truck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "Briefs & CRM", icon: ClipboardList, href: "/briefs" },
  { label: "Flight Planner", icon: Map, href: "/planner" },
  { label: "Live Flight", icon: RadioTower, href: "/live" },
  { label: "Media", icon: ImageIcon, href: "/media" },
  { label: "Job Sheets", icon: FileCheck, href: "/jobsheets" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Equipment", icon: Package, href: "/equipment" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const { isCollapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: "tween", duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col bg-panel border-r border-border overflow-hidden"
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center border border-accent bg-accent/10">
            <span className="font-mono text-accent text-sm font-bold tracking-tighter">AL</span>
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col leading-tight"
            >
              <span className="font-syne font-extrabold text-lg text-text-primary tracking-tighter uppercase">
                Altitude
              </span>
              <span className="font-mono text-[9px] text-accent tracking-[0.3em] uppercase">
                Command Centre
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center h-11 transition-all duration-200",
                isActive ? "text-accent" : "text-text-muted hover:text-text-primary"
              )}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute left-[-12px] w-[3px] h-full bg-accent shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                />
              )}
              
              <div className={cn(
                "flex items-center gap-4 px-3 w-full h-full",
                isActive && "bg-accent/5 border-l-0 border-r-0"
              )}>
                <item.icon size={18} className={cn("flex-shrink-0 transition-colors", isActive ? "text-accent" : "group-hover:text-text-primary")} />
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-syne text-sm font-semibold tracking-tight">
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-mono text-[8px] uppercase tracking-widest text-accent/60"
                      >
                        Mission Ops Active
                      </motion.span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-border bg-background-secondary flex-shrink-0">
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center h-10 border border-border hover:border-accent/40 text-text-muted hover:text-text-primary transition-all"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!isCollapsed && <span className="ml-2 text-[10px] font-mono uppercase tracking-widest">Collapse System</span>}
        </button>
      </div>
    </motion.aside>
  );
}
