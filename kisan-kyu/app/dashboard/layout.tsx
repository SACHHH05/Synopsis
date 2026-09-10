import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Procurement Centre Operations" alertCount={2} userName="Rajesh Kumar" />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}