"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Wheat,
  Clock3,
  Truck,
  TrendingUp,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Plus,
  BarChart3,
  CheckCircle2,
  X,
} from "lucide-react";

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

export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
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

    const mapped = queueItems.map((item) => {
      if (item.status === "Processing") {
        return { ...item, estimatedWait: "In Counter" };
      }
      if (item.status === "Completed") {
        return { ...item, estimatedWait: "Done" };
      }
      if (item.status === "Waiting") {
        const waitText = getEstimatedWaitText(waitingAheadCounter, activeCounters);
        waitingAheadCounter += 1;
        return { ...item, estimatedWait: waitText };
      }
      return item;
    });

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

  // Derived dashboard metric statistics
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

  const todayProcuredTons = useMemo(() => {
    const total = updatedQueueItems
      .filter((i) => i.status === "Completed" || i.status === "Processing")
      .reduce((sum, item) => sum + item.lotSizeNum, 0);
    return Math.round(total * 10) / 10;
  }, [updatedQueueItems]);

  // Handle status transitions (Waiting -> Processing -> Completed)
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

  // Handle Farmer Registration Submit
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

    // Show Toast Notification
    setNotification({
      message: "Farmer registered successfully",
      tokenNumber: newToken,
    });
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Procurement Centre Operations
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Kisan Kyu Dashboard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Real-time queue monitoring, MSP procurement & AI wait-time prediction
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Online / Offline Toggle Switch */}
          <button
            type="button"
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isOnline
                ? "border-emerald-200 bg-[#F0FDF4] text-[#16A34A] hover:bg-emerald-100"
                : "border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3.5 w-3.5 text-[#16A34A]" />
                <span>ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 text-amber-700" />
                <span>OFFLINE MODE</span>
              </>
            )}
          </button>

          {/* Centre Badge */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#64748B] shadow-sm">
            Centre ID: <span className="font-bold text-[#0F172A]">CEN-001</span>
          </div>
        </div>
      </div>

      {/* Registration Success Notification Banner */}
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

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-800 shrink-0">
              <WifiOff className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Offline Operation Active</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Centre operations continue uninterrupted. Tokens, weight logs, and receipt slips are saved locally.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-amber-200 text-amber-900 shrink-0">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-700" />
            7 records queued for background sync
          </div>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Current Queue"
          value={String(currentTotalQueueCount)}
          description={`${waitingItemsCount} waiting, ${currentlyProcessingCount} processing`}
          icon={Users}
          trend={`Total active farmers in centre`}
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
          description="For a new farmer arrival"
          icon={Clock3}
          trend={`Based on ${activeCounters} active counters`}
        />

        <StatCard
          title="Today's Procurement"
          value={`${todayProcuredTons} T`}
          description="Target: 84.0 Tons (Wheat)"
          icon={Wheat}
          trend={`${Math.round((todayProcuredTons / 84) * 100)}% completed`}
        />
      </section>

      {/* Main Operational Section */}
      <section className="grid gap-6 xl:grid-cols-3 items-start">
        {/* Left Side: Live Farmer Queue Table */}
        <div className="xl:col-span-2 rounded-xl border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E7EB] p-5 gap-3">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Live Farmer Queue
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Khanna APMC Procurement Centre — Real-time token status
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#15803D] shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Register Farmer
            </button>
          </div>

          <QueueTable
            items={updatedQueueItems}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Right Side: Prediction, Capacity & System Info */}
        <div className="space-y-6">
          {/* Queue Prediction Panel */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#16A34A]" />

            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  AI Wait-Time Forecast
                </p>
                <h3 className="text-sm font-bold text-[#0F172A] mt-0.5">
                  Queue Prediction Model
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#16A34A] bg-[#F0FDF4] border border-emerald-200 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <p className="text-xs text-[#64748B]">Estimated Waiting Time</p>
                <p className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
                  {estimatedWaitForNewArrival}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#64748B]">Intake Closure</p>
                <p className="text-sm font-bold text-[#0F172A] mt-1">
                  5:45 PM
                </p>
              </div>
            </div>

            {/* Operational Metrics Subgrid */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-[#E5E7EB] pt-3">
              <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5E7EB]">
                <span className="text-[#64748B] block">Farmers Ahead</span>
                <span className="font-bold text-[#0F172A] text-sm">
                  {waitingItemsCount} Tokens
                </span>
              </div>
              <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E5E7EB]">
                <span className="text-[#64748B] block">Processing Rate</span>
                <span className="font-bold text-[#0F172A] text-sm">12.5 T / hr</span>
              </div>
            </div>

            {/* Prediction Warning Callout */}
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed">
                High afternoon arrival volume expected. Centre may reach today&apos;s 84 T capacity by 5:45 PM.
              </p>
            </div>
          </div>

          {/* Capacity Utilization */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Daily Intake Capacity
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#0F172A]">
                  {Math.min(100, Math.round((todayProcuredTons / 84) * 100))}%
                </p>
              </div>

              <div className="rounded-lg bg-[#F0FDF4] p-2.5 text-[#16A34A] border border-emerald-100">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#F8FAFC] border border-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#16A34A] transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((todayProcuredTons / 84) * 100))}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-[#64748B]">
              <span className="font-medium text-[#0F172A]">
                {todayProcuredTons} T procured
              </span>
              <span>84.0 T max capacity</span>
            </div>
          </div>

          {/* System & Storage Status */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Local Operational Status
                </p>
                <p className="mt-1 text-xs text-[#64748B]">
                  {isOnline ? "Cloud sync active (Every 30s)" : "Offline local mode active"}
                </p>
              </div>
              <BarChart3 className="h-5 w-5 text-[#64748B]" />
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#E5E7EB] text-xs">
              <div className="flex items-center gap-2 text-[#0F172A]">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                <span>Local Database: Ready</span>
              </div>
              <span className="text-[#64748B] font-mono text-[11px]">v1.4.2</span>
            </div>
          </div>
        </div>
      </section>

      {/* Register Farmer Modal */}
      <RegisterFarmerModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSubmit={handleRegisterFarmer}
      />
    </main>
  );
}