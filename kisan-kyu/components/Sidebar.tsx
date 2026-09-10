"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { id: "overview", label: "Overview", href: "/dashboard", disabled: false },
    { id: "queue", label: "Queue Status", href: "/dashboard/queue", disabled: false },
    { id: "crops", label: "My Crops", href: "", disabled: true },
    { id: "mandi", label: "Mandi Rates", href: "", disabled: true },
    { id: "weather", label: "Weather", href: "", disabled: true },
    { id: "advisory", label: "AI Advisory", href: "", disabled: true },
    { id: "settings", label: "Settings", href: "/dashboard/settings", disabled: false },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-[#E5E7EB] bg-white md:min-h-screen">
      <div className="flex h-full flex-col">
        {/* Brand Header */}
        <div className="border-b border-[#E5E7EB] px-6 py-5">
          <Link href="/" className="block">
            <span className="text-xl font-bold tracking-tight text-[#0F172A]">
              Kisan Kyu
            </span>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-[#64748B]">
              Procurement Centre Portal
            </p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
            Main Menu
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : item.href !== "" && pathname.startsWith(item.href);

              if (item.disabled) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 cursor-not-allowed opacity-70"
                  >
                    <span>{item.label}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#F0FDF4] text-[#16A34A] border-l-4 border-[#16A34A] font-semibold"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Procurement Centre Info */}
        <div className="border-t border-[#E5E7EB] p-4 bg-white">
          <div className="rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                Procurement Centre
              </p>
              <span className="text-xs font-mono font-bold text-[#0F172A]">
                CEN-001
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-[#0F172A]">
              Khanna Grain Market
            </p>

            <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-[#E5E7EB]">
              <span className="h-2 w-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-[11px] font-medium text-[#64748B]">
                System Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}