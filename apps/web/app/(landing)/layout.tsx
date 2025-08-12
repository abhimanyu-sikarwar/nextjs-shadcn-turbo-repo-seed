import * as React from "react";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col bg-background">
      {children}
    </div>
  );
}
