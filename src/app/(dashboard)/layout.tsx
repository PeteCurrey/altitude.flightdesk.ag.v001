import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { AppShell } from "@/components/layout/app-shell";
import { SplashScreen } from "@/components/layout/splash-screen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SplashScreen />
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
