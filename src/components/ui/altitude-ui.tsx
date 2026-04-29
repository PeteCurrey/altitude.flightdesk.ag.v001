import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// --- Page Header ---
export function PageHeader({ title, sub, breadcrumbs, children }: any) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-border pb-8">
      <div className="space-y-1">
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-2">
            {breadcrumbs.map((crumb: string, i: number) => (
              <div key={crumb} className="flex items-center gap-2">
                <span>{crumb}</span>
                {i < breadcrumbs.length - 1 && <span className="text-border-strong">/</span>}
              </div>
            ))}
          </nav>
        )}
        <h1 className="text-3xl font-syne font-extrabold tracking-tighter uppercase text-text-primary">
          {title}
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl font-sans tracking-tight">
          {sub}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";

// --- Data Card ---
export function DataCard({ children, className, title, subtitle, href }: any) {
  const content = (
    <div className={cn("bg-panel border border-border p-6 relative overflow-hidden group transition-all hover:border-border-strong", className)}>
      {(title || subtitle) && (
        <div className="mb-6 flex flex-col gap-0.5">
          {title && <h3 className="font-syne text-xs font-bold uppercase tracking-widest text-text-primary">{title}</h3>}
          {subtitle && <p className="font-mono text-[9px] text-text-muted uppercase tracking-[0.1em]">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );

  if (href) {
    return <Link href={href} className="block w-full h-full">{content}</Link>;
  }

  return content;
}

// --- Metric Readout ---
export function MetricReadout({ label, value, subValue, trend, trendType, icon: Icon }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">{label}</span>
        {Icon && <Icon size={12} className="text-accent/40" />}
      </div>
      <div className="flex items-end gap-3 mt-1">
        <span className="text-3xl font-syne font-bold text-text-primary tracking-tighter">{value}</span>
        {trend && (
          <span className={cn(
            "font-mono text-[10px] mb-1.5",
            trendType === "up" ? "text-success" : "text-danger"
          )}>
            {trendType === "up" ? "▲" : "▼"} {trend}
          </span>
        )}
      </div>
      {subValue && (
        <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{subValue}</span>
      )}
    </div>
  );
}

// --- Status Badge ---
export function StatusBadge({ status, type = "default" }: any) {
  const styles: any = {
    default: "bg-panel border-border text-text-muted",
    success: "bg-success/10 border-success/30 text-success",
    warning: "bg-warning/10 border-warning/30 text-warning",
    danger: "bg-danger/10 border-danger/30 text-danger",
    accent: "bg-accent/10 border-accent/30 text-accent",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.15em] border",
      styles[type] || styles.default
    )}>
      {status}
    </span>
  );
}

// --- Command Button ---
export function CommandButton({ children, variant = "primary", className, ...props }: any) {
  const variants: any = {
    primary: "bg-accent text-background border-accent hover:shadow-[0_0_15px_rgba(197,160,89,0.4)]",
    ghost: "bg-transparent text-text-secondary border-border hover:text-text-primary hover:border-accent hover:bg-accent/10",
    outline: "bg-transparent text-text-primary border-border hover:border-text-primary",
    danger: "bg-danger/10 text-danger border-danger/30 hover:bg-danger hover:text-background",
  };

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] border transition-all duration-200 active:scale-95 disabled:opacity-30",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Section Panel ---
export function SectionPanel({ title, children, action }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <h4 className="font-syne text-sm font-bold uppercase tracking-widest text-text-primary">
          {title}
        </h4>
        {action}
      </div>
      {children}
    </div>
  );
}

// --- Premium Table ---
export function PremiumTable({ headers, data, renderRow }: any) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-strong bg-background-secondary/50">
            {headers.map((h: string) => (
              <th key={h} className="py-4 px-6 font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {data.map((item: any, i: number) => (
            <motion.tr 
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group hover:bg-white/[0.02] transition-colors"
            >
              {renderRow(item)}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
