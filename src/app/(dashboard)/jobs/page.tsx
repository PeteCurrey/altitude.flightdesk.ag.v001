"use client";

import { PageHeader, DataCard, CommandButton } from "@/components/ui/altitude-ui";
import { Plus, Filter } from "lucide-react";

export default function JobsPage() {
  return (
    <div className="space-y-8 pb-32 px-6 pt-6">
      <PageHeader 
        title="Mission Control" 
        sub="Manage active jobs, flight pipeline, and historical mission data."
        breadcrumbs={["Operations", "Mission Control"]}
      >
        <CommandButton variant="ghost" className="flex items-center gap-2">
          <Filter size={14} /> Filter
        </CommandButton>
        <CommandButton className="flex items-center gap-2">
          <Plus size={14} /> New Mission
        </CommandButton>
      </PageHeader>

      <DataCard>
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 border border-border flex items-center justify-center text-text-muted rounded-full">
            <Filter size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-syne font-bold text-lg text-text-primary uppercase">No Active Missions Found</h3>
            <p className="text-sm font-sans text-text-muted max-w-md">The job directory is currently empty or pending sync. Click New Mission to manually intake a client request.</p>
          </div>
        </div>
      </DataCard>
    </div>
  );
}
