"use client";

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/dashboard" }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
         <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session || !allowedRoles.includes((session.user as any).role)) {
    redirect(redirectTo);
    return null;
  }

  return <>{children}</>;
}
