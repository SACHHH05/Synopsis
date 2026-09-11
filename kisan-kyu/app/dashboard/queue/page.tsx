"use client";

import React, { useState, useMemo } from "react";
import { Users, Clock3, Truck, Wheat, Plus, CheckCircle2, X } from "lucide-react";
import StatCard from "@/components/StatCard";
import QueueTable from "@/components/QueueTable";
import RegisterFarmerModal, {
  RegisterFarmerFormData,
} from "@/components/RegisterFarmerModal";
import {
  QueueItem,
  getEstimatedWaitText,
  generateNextToken,
} from "@/lib/queueUtils";

const initialQueueItems: QueueItem[] = [
  {
    id: "1",
    tokenNumber: "TK-104",
    farmerName: "Rajesh Kumar",
    phoneNumber: "9876543210",
    farmerId: "FID-90124",
    cropType: "Wheat (HD-2967)",
    lotSize: "4.5 Tons",
    lotSizeNum: 4.5,
    arrivalTime: "08:30 AM",
    status: "Processing",
    estimatedWait: "In Counter #1",
  },
  {
    id: "2",
    tokenNumber: "TK-105",
    farmerName: "Harpreet Singh",
    phoneNumber: "9812345678",
    farmerId: "FID-88219",
    cropType: "Mustard",
    lotSize: "3.0 Tons",
    lotSizeNum: 3.0,
    arrivalTime: "09:00 AM",
    status: "Processing",
    estimatedWait: "In Counter #2",
  },
  {
    id: "3",
    tokenNumber: "TK-106",
    farmerName: "Sukhwinder Kaur",
    phoneNumber: "9845612378",
    farmerId: "FID-77123",
    cropType: "Wheat",
    lotSize: "6.0 Tons",
    lotSizeNum: 6.0,
    arrivalTime: "09:15 AM",
    status: "Waiting",
    estimatedWait: "0m",
  },
  {
    id: "4",
    tokenNumber: "TK-107",
    farmerName: "Gurdeep Sharma",
    phoneNumber: "9898765432",
    farmerId: "FID-66321",
    cropType: "Wheat",
    lotSize: "5.0 Tons",
    lotSizeNum: 5.0,
    arrivalTime: "09:40 AM",
    status: "Waiting",
    estimatedWait: "15m",
  },
  {
    id: "5",
    tokenNumber: "TK-108",
    farmerName: "Manpreet Singh",
    phoneNumber: "9765432109",
    farmerId: "FID-55129",
    cropType: "Maize",
    lotSize: "2.5 Tons",
    lotSizeNum: 2.5,
    arrivalTime: "10:05 AM",
    status: "Waiting",
    estimatedWait: "30m",
  },
  {
    id: "6",
    tokenNumber: "TK-101",
    farmerName: "Baldev Singh",
    phoneNumber: "9823456789",
    farmerId: "FID-44102",
    cropType: "Wheat",
    lotSize: "4.0 Tons",
    lotSizeNum: 4.0,
    arrivalTime: "08:00 AM",
    status: "Completed",
    estimatedWait: "Done",
  },
];

export default function QueueStatusPage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>(initialQueueItems);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    tokenNumber: string;
  } | null>(null);

  const activeCounters = 3;

  // Recalculate queue estimated wait times helper and sort by status priority
  const updatedQueueItems = useMemo(() => {
    let waitingAheadCounter = 0;

    const mapped = [];
    for (const item of queueItems) {
      if (item.status === "Processing") {
        mapped.push({ ...item, estimatedWait: "In Counter" });
      } else if (item.status === "Completed") {
        mapped.push({ ...item, estimatedWait: "Done" });
      } else if (item.status === "Waiting") {
        const waitText = getEstimatedWaitText(waitingAheadCounter, activeCounters);
        waitingAheadCounter += 1;
        mapped.push({ ...item, estimatedWait: waitText });
      } else {
        mapped.push(item);
      }
    }

    const statusPriority: Record<QueueItem["status"], number> = {
      Processing: 1,
      Waiting: 2,
      Completed: 3,
      Cancelled: 4,
    };

    return mapped.sort(
      (a, b) => statusPriority[a.status] - statusPriority[b.status]
    );
  }, [queueItems]);

  const waitingItemsCount = useMemo(
    () => updatedQueueItems.filter((i) => i.status === "Waiting").length,
    [updatedQueueItems]
  );

  const currentlyProcessingCount = useMemo(
    () => updatedQueueItems.filter((i) => i.status === "Processing").length,
    [updatedQueueItems]
  );

  const currentTotalQueueCount = waitingItemsCount + currentlyProcessingCount;

  const estimatedWaitForNewArrival = useMemo(
    () => getEstimatedWaitText(waitingItemsCount, activeCounters),
    [waitingItemsCount]
  );

  const handleStatusChange = (
    itemId: string,
    newStatus: "Processing" | "Completed"
  ) => {
    setQueueItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const handleRegisterFarmer = (formData: RegisterFarmerFormData) => {
    const newToken = generateNextToken(queueItems);
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newItem: QueueItem = {
      id: String(Date.now()),
      tokenNumber: newToken,
      farmerName: formData.farmerName,
      phoneNumber: formData.phoneNumber,
      farmerId: formData.farmerId,
      cropType: formData.cropType,
      lotSize: `${formData.lotSizeNum} Tons`,
      lotSizeNum: formData.lotSizeNum,
      arrivalTime: timeString,
      status: "Waiting",
      estimatedWait: getEstimatedWaitText(waitingItemsCount, activeCounters),
    };

    setQueueItems((prev) => [...prev, newItem]);
    setIsRegisterModalOpen(false);

    setNotification({
      message: "Farmer registered successfully",
      tokenNumber: newToken,
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Queue Operations
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Live Queue Status
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Detailed view of active tokens, processing counters, and wait-time distribution
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegisterModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#15803D] shadow-sm self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Register Farmer
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-[#F0FDF4] p-4 text-[#15803D] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#15803D]">
                {notification.message}
              </p>
              <p className="text-[11px] text-[#16A34A] font-mono mt-0.5">
                Token #{notification.tokenNumber} generated and added to live queue
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-[#16A34A] hover:text-[#15803D] p-1 rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Queue Stat Metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Current Queue"
          value={String(currentTotalQueueCount)}
          description={`${waitingItemsCount} waiting, ${currentlyProcessingCount} processing`}
          icon={Users}
          trend="Live active queue"
        />

        <StatCard
          title="Currently Processing"
          value={String(currentlyProcessingCount)}
          description="Active weighbridge counters"
          icon={Truck}
          trend={`Capacity: ${activeCounters} active counters`}
        />

        <StatCard
          title="Estimated Wait"
          value={estimatedWaitForNewArrival}
          description="For a new arrival"
          icon={Clock3}
          trend={`Calculated for ${waitingItemsCount} waiting`}
        />

        <StatCard
          title="Processing Capacity"
          value={`${activeCounters} Counters`}
          description="12.5 Tons / hour throughput"
          icon={Wheat}
          trend="Optimal operational rate"
        />
      </section>

      {/* Main Queue Table */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h2 className="text-base font-bold text-[#0F172A]">
            Khanna APMC Live Queue Table
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active tokens sorted by Processing → Waiting → Completed
          </p>
        </div>

        <QueueTable
          items={updatedQueueItems}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Modal */}
      <RegisterFarmerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleRegisterFarmer}
      />
    </main>
  );
}
