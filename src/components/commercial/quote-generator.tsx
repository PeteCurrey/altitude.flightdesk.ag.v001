"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Send, FileText, CheckCircle2, XCircle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge } from "@/components/ui/altitude-ui";

interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export function QuoteGenerator({ jobId, initialItems = [] }: { jobId: string, initialItems?: QuoteLineItem[] }) {
  const [items, setItems] = useState<QuoteLineItem[]>(initialItems.length > 0 ? initialItems : [
    { id: "1", description: "Standard Full-Day Day Operational Fee", quantity: 1, unitPrice: 850 },
    { id: "2", description: "Equipment Hire (DJI M350 RTK)", quantity: 1, unitPrice: 350 },
    { id: "3", description: "Post-Production (Neural Splat Processing)", quantity: 1, unitPrice: 450 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const subtotal = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
  const vat = subtotal * 0.2;
  const total = subtotal + vat;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
         <h4 className="font-syne font-bold text-xs uppercase tracking-widest">Quote Intelligence Engine</h4>
         <div className="flex gap-2">
            <StatusBadge status="DRAFT" type="default" />
         </div>
      </div>

      <div className="space-y-4">
         <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-background-secondary border border-border font-mono text-[9px] text-text-muted uppercase tracking-widest">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
         </div>

         {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
               <div className="col-span-6">
                  <input 
                    type="text" 
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder="e.g. Flight Operations"
                    className="input-field py-2 text-[11px]"
                  />
               </div>
               <div className="col-span-2">
                  <input 
                    type="number" 
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value))}
                    className="input-field py-2 text-center text-[11px]"
                  />
               </div>
               <div className="col-span-2">
                  <input 
                    type="number" 
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value))}
                    className="input-field py-2 text-right text-[11px]"
                  />
               </div>
               <div className="col-span-2 flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-text-primary">
                     {formatCurrency(item.quantity * item.unitPrice)}
                  </span>
                  <button onClick={() => removeItem(item.id)} className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                     <Trash2 size={12} />
                  </button>
               </div>
            </div>
         ))}

         <button onClick={addItem} className="w-full py-3 border border-dashed border-border text-[9px] font-mono text-text-muted uppercase tracking-widest hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2">
            <Plus size={12} /> Add Revenue Item
         </button>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
         <div className="w-64 space-y-3">
            <div className="flex justify-between items-center">
               <span className="font-mono text-[10px] text-text-muted uppercase">Subtotal</span>
               <span className="font-mono text-[11px] font-bold text-text-primary">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="font-mono text-[10px] text-text-muted uppercase">VAT (20.0%)</span>
               <span className="font-mono text-[11px] font-bold text-text-primary">{formatCurrency(vat)}</span>
            </div>
            <div className="h-[1px] bg-border my-2" />
            <div className="flex justify-between items-center">
               <span className="font-syne font-bold text-xs uppercase text-accent">Total (GBP)</span>
               <span className="font-syne font-black text-lg text-accent tracking-tighter">{formatCurrency(total)}</span>
            </div>
         </div>
      </div>

      <div className="flex justify-between pt-8">
         <div className="flex gap-3">
            <CommandButton variant="ghost"><FileText size={14} /> Preview PDF</CommandButton>
            <CommandButton variant="ghost">Save Draft</CommandButton>
         </div>
         <div className="flex gap-3">
            <CommandButton variant="outline" className="text-danger border-danger hover:bg-danger/10"><XCircle size={14} /> Reject</CommandButton>
            <CommandButton variant="outline" className="text-success border-success hover:bg-success/10"><CheckCircle2 size={14} /> Approve</CommandButton>
            <CommandButton variant="primary"><Send size={14} /> Dispatch to Client</CommandButton>
         </div>
      </div>
    </div>
  );
}
