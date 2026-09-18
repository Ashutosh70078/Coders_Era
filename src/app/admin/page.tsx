import React from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Admin Gate Verification Desk | Coder's Era",
  description: "Administrative live attendance monitoring, roster search, CSV export, and admission management.",
};

export default function AdminPage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-cyber-neon transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Hub</span>
        </Link>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <Shield className="h-3.5 w-3.5 text-cyber-violet" />
          <span>Restricted Admin Gate Console</span>
        </div>
      </div>

      {/* Admin Dashboard Component */}
      <AdminDashboard />
    </div>
  );
}
