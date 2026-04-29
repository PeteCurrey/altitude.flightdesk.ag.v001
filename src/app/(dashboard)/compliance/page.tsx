"use client";

import { PageHeader, DataCard, CommandButton } from "@/components/ui/altitude-ui";
import { ShieldAlert, Download, AlertTriangle } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="space-y-8 pb-32 px-6 pt-6">
      <PageHeader 
        title="Compliance & Safety" 
        sub="Track operator certifications, insurance validity, active NOTAMs, and equipment health."
        breadcrumbs={["Operations", "Compliance"]}
      >
        <CommandButton variant="ghost" className="flex items-center gap-2">
          <Download size={14} /> Export Logs
        </CommandButton>
        <CommandButton className="flex items-center gap-2 bg-danger text-background border-danger hover:bg-danger/90">
          <ShieldAlert size={14} /> View Critical Alerts
        </CommandButton>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataCard title="Operator Certifications" subtitle="CAA & Competency">
           <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-12 h-12 border border-border flex items-center justify-center text-text-muted rounded-full">
              <AlertTriangle size={20} />
            </div>
            <p className="text-sm font-sans text-text-muted max-w-sm">No certifications loaded. Upload your GVC/A2CofC to enable flight planning.</p>
          </div>
        </DataCard>

        <DataCard title="Active NOTAMs" subtitle="Airspace Restrictions">
           <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-12 h-12 border border-border flex items-center justify-center text-text-muted rounded-full">
              <ShieldAlert size={20} />
            </div>
            <p className="text-sm font-sans text-text-muted max-w-sm">Connect your map provider to fetch live airspace restrictions.</p>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
