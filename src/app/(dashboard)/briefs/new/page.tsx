"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Plus, 
  AlertTriangle,
  Info,
  Save,
  Globe,
  Trash2,
  FileText
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, SectionPanel } from "@/components/ui/altitude-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, label: "Client Intake", icon: User },
  { id: 2, label: "Project Mission", icon: Layers },
  { id: 3, label: "Site Analysis", icon: MapPin },
  { id: 4, label: "Logistics", icon: Clock },
  { id: 5, label: "Review & Commit", icon: CheckCircle2 },
];

export default function NewBriefPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 01
    clientName: "",
    company: "",
    email: "",
    phone: "",
    billingAddress: "",
    clientNotes: "",
    // Step 02
    projectName: "",
    jobType: "Aerial photography",
    deliverables: [] as string[],
    // Step 03
    siteAddress: "",
    postcode: "",
    w3w: "",
    siteType: "Urban",
    accessNotes: "",
    // Step 04
    targetDate: "",
    shootWindow: "AM",
    permissionRequired: "A2 CofC",
    budgetBand: "£1,000 - £2,500",
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleCreate = async () => {
    // Mock save
    router.push("/briefs");
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex gap-12">
      {/* Left Progress Rail */}
      <div className="w-64 flex flex-col gap-2 shrink-0 py-4">
        <h3 className="font-syne font-bold text-xs uppercase tracking-[0.2em] mb-6 text-accent">New Brief Protocol</h3>
        {STEPS.map((s) => (
          <div key={s.id} className={cn(
            "flex items-center gap-4 p-4 border transition-all relative overflow-hidden",
            step === s.id ? "bg-accent border-accent text-background" : 
            step > s.id ? "bg-panel border-border text-success" : "bg-panel border-border text-text-muted"
          )}>
             <div className="w-6 h-6 border border-current flex items-center justify-center text-[10px] font-mono font-bold">
                {s.id.toString().padStart(2, '0')}
             </div>
             <span className="font-syne font-bold text-[10px] uppercase tracking-widest">{s.label}</span>
             {step > s.id && <CheckCircle2 size={12} className="ml-auto" />}
             {step === s.id && <motion.div layoutId="rail-active" className="absolute left-0 top-0 bottom-0 w-1 bg-white" />}
          </div>
        ))}
        
        <div className="mt-auto p-4 bg-accent/5 border border-accent/20">
           <p className="text-[9px] font-mono text-accent leading-relaxed uppercase">
              Current Reference: <br />
              **ALT-2024-NEW**
           </p>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col card-elevated p-0 bg-panel border-border overflow-hidden">
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-10"
              >
                {step === 1 && (
                  <div className="space-y-8">
                     <FormHeader title="Step 01: Client Intelligence" desc="Select an existing client or create a new profile." />
                     <div className="grid grid-cols-2 gap-8">
                        <InputGroup label="Client Name" placeholder="e.g. James Wilson" />
                        <InputGroup label="Company" placeholder="e.g. Skanska UK" />
                        <InputGroup label="Email Address" placeholder="j.wilson@skanska.co.uk" />
                        <InputGroup label="Phone Number" placeholder="+44 7..." />
                        <div className="col-span-2">
                           <InputGroup label="Billing Address" placeholder="Full address for invoicing" />
                        </div>
                     </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                     <FormHeader title="Step 02: Project Mission" desc="Define the scope and technical deliverables." />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Project Name" placeholder="e.g. M4 Bridge Inspection" />
                        <SelectGroup 
                          label="Job Type" 
                          options={["Aerial photography", "Aerial video", "Survey/mapping", "Gaussian Splat / 3D capture", "Inspection", "Event coverage"]} 
                          value={formData.jobType}
                          onChange={(v) => setFormData({...formData, jobType: v})}
                        />
                        <div className="col-span-2">
                           <label className="label mb-4">Mission Deliverables</label>
                           <div className="grid grid-cols-3 gap-3">
                              {["Edited video", "Raw footage", "Orthomosaic map", "Gaussian Splat", "Point cloud .las/.ply", "Inspection report", "Still photography"].map(d => (
                                 <button 
                                  key={d}
                                  onClick={() => {
                                    const next = formData.deliverables.includes(d) 
                                      ? formData.deliverables.filter(x => x !== d) 
                                      : [...formData.deliverables, d];
                                    setFormData({...formData, deliverables: next});
                                  }}
                                  className={cn(
                                    "p-3 border text-[10px] font-mono uppercase tracking-widest text-left transition-all",
                                    formData.deliverables.includes(d) ? "bg-accent border-accent text-background" : "bg-background-secondary border-border text-text-muted hover:border-accent/40"
                                  )}
                                 >
                                    {d}
                                 </button>
                              ))}
                           </div>
                        </div>

                        {formData.jobType === "Gaussian Splat / 3D capture" && (
                           <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="col-span-2 p-6 bg-accent/5 border border-accent/20"
                           >
                              <div className="flex items-center gap-3 mb-4">
                                 <AlertTriangle size={18} className="text-accent" />
                                 <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-accent">3D Neural Radiance Requirements</h4>
                              </div>
                              <ul className="grid grid-cols-2 gap-4">
                                 <TechInfo label="Coverage" desc="Requires 80% overlap for neural alignment." />
                                 <TechInfo label="Lighting" desc="Consistent overcast or flat lighting preferred." />
                                 <TechInfo label="Orbit" desc="Execute 3-tier orbital capture (15°, 45°, 75°)." />
                                 <TechInfo label="Quantity" desc="Minimum 150 high-res images for convergence." />
                              </ul>
                           </motion.div>
                        )}
                     </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                     <FormHeader title="Step 03: Site Analysis" desc="Geospatial location and access restrictions." />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="col-span-2">
                           <InputGroup label="Site Address" placeholder="Start typing address..." icon={Search} />
                        </div>
                        <InputGroup label="Postcode" placeholder="e.g. M50 3AZ" />
                        <InputGroup label="What3Words" placeholder="///filled.count.soap" />
                        <SelectGroup label="Site Type" options={["Urban", "Rural", "Coastal", "Industrial", "Residential", "Heritage"]} />
                        <InputGroup label="Access Notes" placeholder="e.g. Keyholder on site from 08:00" />
                     </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                     <FormHeader title="Step 04: Logistics & Compliance" desc="Scheduling window and regulatory requirements." />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Target Date" type="date" />
                        <SelectGroup label="Shoot Window" options={["AM", "PM", "Full day"]} />
                        <SelectGroup label="CAA Permission Level" options={["A2 CofC", "GVC", "PDRA", "Article 16"]} />
                        <SelectGroup label="Budget Band" options={["< £1,000", "£1,000 - £2,500", "£2,500 - £5,000", "> £5,000"]} />
                        <div className="col-span-2">
                           <InputGroup label="Weather Dependencies" placeholder="e.g. Requires wind < 15mph" />
                        </div>
                     </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-8">
                     <FormHeader title="Step 05: Review & Commit" desc="Final protocol verification before mission initialization." />
                     <div className="grid grid-cols-1 gap-6">
                        <ReviewSection title="Client" data={[
                           { l: "Name", v: "James Wilson" },
                           { l: "Company", v: "Skanska UK" },
                           { l: "Email", v: "j.wilson@skanska.co.uk" },
                        ]} onEdit={() => setStep(1)} />
                        
                        <ReviewSection title="Mission" data={[
                           { l: "Project", v: "M4 Bridge Inspection" },
                           { l: "Type", v: formData.jobType },
                           { l: "Deliverables", v: formData.deliverables.join(", ") },
                        ]} onEdit={() => setStep(2)} />

                        <ReviewSection title="Site" data={[
                           { l: "Address", v: "M4 Junction 12, Reading" },
                           { l: "Postcode", v: "RG7 4HY" },
                        ]} onEdit={() => setStep(3)} />
                     </div>
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-border bg-background-secondary/50 flex items-center justify-between">
           <CommandButton variant="ghost" onClick={prevStep} disabled={step === 1}>
              <ChevronLeft size={14} /> Back
           </CommandButton>
           
           <div className="flex gap-4">
              <CommandButton variant="ghost" onClick={() => router.push("/briefs")}>
                 Discard
              </CommandButton>
              {step < 5 ? (
                <CommandButton variant="primary" onClick={nextStep}>
                   Continue <ChevronRight size={14} />
                </CommandButton>
              ) : (
                <CommandButton variant="primary" onClick={handleCreate} className="bg-accent shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                   Initialise Brief <Save size={14} />
                </CommandButton>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function FormHeader({ title, desc }: any) {
  return (
    <div className="space-y-1">
       <h4 className="font-syne font-black text-xl uppercase tracking-tight text-text-primary">{title}</h4>
       <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">{desc}</p>
    </div>
  );
}

function InputGroup({ label, icon: Icon, type = "text", ...props }: any) {
  return (
    <div className="space-y-2">
       <label className="label">{label}</label>
       <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />}
          <input 
            type={type} 
            className={cn("input-field", Icon && "pl-10")} 
            {...props}
          />
       </div>
    </div>
  );
}

function SelectGroup({ label, options, value, onChange }: any) {
  return (
    <div className="space-y-2">
       <label className="label">{label}</label>
       <select 
         value={value} 
         onChange={(e) => onChange?.(e.target.value)}
         className="input-field appearance-none"
       >
          {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
       </select>
    </div>
  );
}

function TechInfo({ label, desc }: any) {
  return (
    <li className="space-y-1">
       <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">{label}</span>
       <p className="text-[9px] text-text-muted uppercase leading-tight">{desc}</p>
    </li>
  );
}

function ReviewSection({ title, data, onEdit }: any) {
  return (
    <div className="p-6 bg-background-secondary border border-border group relative">
       <button onClick={onEdit} className="absolute top-6 right-6 text-[9px] font-mono text-accent opacity-0 group-hover:opacity-100 uppercase tracking-widest transition-all">Edit</button>
       <h5 className="font-syne font-bold text-xs uppercase tracking-widest mb-4">{title} Intelligence</h5>
       <div className="grid grid-cols-3 gap-6">
          {data.map((d: any) => (
             <div key={d.l} className="flex flex-col gap-1">
                <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{d.l}</span>
                <span className="text-[11px] font-bold text-text-primary uppercase">{d.v || '—'}</span>
             </div>
          ))}
       </div>
    </div>
  );
}
