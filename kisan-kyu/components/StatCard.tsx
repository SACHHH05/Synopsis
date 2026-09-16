import React from "react";

export interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon?: React.ElementType;
}

export default function StatCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
}: StatCardProps) {
  const isPositiveTrend = trend.includes("+") || trend.includes("↓") || trend.includes("completed");

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
          {title}
        </p>
        {Icon && (
          <div className="rounded-lg bg-[#F8FAFC] p-2 border border-[#E5E7EB]">
            <Icon className="h-4 w-4 text-[#16A34A]" />
          </div>
        )}
      </div>

      <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A]">
        {value}
      </p>

      <p className="mt-1 text-xs text-[#64748B]">{description}</p>

      <div className="mt-4 border-t border-[#E5E7EB] pt-3">
        <p
          className={`text-xs font-medium ${isPositiveTrend ? "text-[#16A34A]" : "text-[#64748B]"
            }`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}