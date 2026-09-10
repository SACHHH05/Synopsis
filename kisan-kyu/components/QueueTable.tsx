import React from "react";
import { QueueItem } from "@/lib/queueUtils";

interface QueueTableProps {
  items: QueueItem[];
  onStatusChange?: (itemId: string, newStatus: "Processing" | "Completed") => void;
  onActionClick?: (item: QueueItem) => void;
}

export default function QueueTable({
  items,
  onStatusChange,
}: QueueTableProps) {
  const statusStyles: Record<QueueItem["status"], string> = {
    Processing: "bg-amber-50 text-amber-700 border-amber-200 font-semibold",
    Waiting: "bg-rose-50 text-rose-700 border-rose-200 font-semibold",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    Cancelled: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-[#0F172A]">
        <thead className="text-xs font-semibold uppercase tracking-wider bg-[#F8FAFC] text-[#64748B] border-b border-[#E5E7EB]">
          <tr>
            <th scope="col" className="px-6 py-3.5">
              Token #
            </th>
            <th scope="col" className="px-6 py-3.5">
              Farmer
            </th>
            <th scope="col" className="px-6 py-3.5">
              Crop
            </th>
            <th scope="col" className="px-6 py-3.5">
              Lot Size
            </th>
            <th scope="col" className="px-6 py-3.5">
              Arrival Time
            </th>
            <th scope="col" className="px-6 py-3.5">
              Status
            </th>
            <th scope="col" className="px-6 py-3.5">
              Est. Wait
            </th>
            <th scope="col" className="px-6 py-3.5 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-[#F8FAFC] transition-colors"
            >
              <td className="px-6 py-4 font-mono font-bold text-[#0F172A] text-xs">
                {item.tokenNumber}
              </td>
              <td className="px-6 py-4">
                <p className="font-semibold text-[#0F172A]">{item.farmerName}</p>
                {item.farmerId && (
                  <p className="text-[11px] text-[#64748B] font-mono">
                    {item.farmerId} {item.phoneNumber ? `• ${item.phoneNumber}` : ""}
                  </p>
                )}
              </td>
              <td className="px-6 py-4 text-[#64748B]">{item.cropType}</td>
              <td className="px-6 py-4 font-medium text-[#0F172A]">
                {item.lotSize}
              </td>
              <td className="px-6 py-4 text-[#64748B] text-xs font-mono">
                {item.arrivalTime}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    statusStyles[item.status]
                  }`}
                >
                  {item.status === "Processing" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                  )}
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-xs font-medium text-[#64748B]">
                {item.estimatedWait}
              </td>
              <td className="px-6 py-4 text-right">
                {item.status === "Waiting" && (
                  <button
                    type="button"
                    onClick={() => onStatusChange?.(item.id, "Processing")}
                    className="text-xs text-[#0F172A] font-semibold hover:text-[#16A34A] px-2.5 py-1 rounded-md border border-[#E5E7EB] hover:bg-[#F0FDF4] hover:border-emerald-200 transition-colors"
                  >
                    Start
                  </button>
                )}

                {item.status === "Processing" && (
                  <button
                    type="button"
                    onClick={() => onStatusChange?.(item.id, "Completed")}
                    className="text-xs bg-[#16A34A] text-white font-bold px-3 py-1 rounded-md hover:bg-[#15803D] transition-colors shadow-xs"
                  >
                    Complete
                  </button>
                )}

                {item.status === "Completed" && (
                  <span className="text-xs text-[#64748B] font-medium">
                    Done
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
