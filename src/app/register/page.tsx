import React from "react";
import TicketForm from "@/components/ticket/TicketForm";
import Link from "next/link";
import { ArrowLeft, Sparkles, Shield } from "lucide-react";

export const metadata = {
  title: "Get Virtual Pass | Coder's Era",
  description: "Register and generate your official holographic Coder's Era 2026 pass.",
};

export default function RegisterPage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-cyber-neon transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Hub</span>
        </Link>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <Shield className="h-3.5 w-3.5 text-cyber-cyan" />
          <span>Collision-Free ID Allocation Active</span>
        </div>
      </div>

      {/* Ticket Generator Form Component */}
      <TicketForm />
    </div>
  );
}
