"use client";

import React, { useState } from "react";
import {
  Building2,
  Sliders,
  Bell,
  HardDrive,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  const [centreId, setCentreId] = useState("CEN-001");
  const [centreName, setCentreName] = useState("Khanna APMC Grain Market");
  const [dailyCapacity, setDailyCapacity] = useState("84.0");
  const [activeCounters, setActiveCounters] = useState("3");
  const [avgProcessingTime, setAvgProcessingTime] = useState("15");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [queueThresholdAlerts, setQueueThresholdAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#16A34A]">
            Centre Operations
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
            System Settings
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Configure procurement centre parameters, capacity thresholds & offline sync settings
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16A34A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#15803D] shadow-sm self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Save Success Banner */}
      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-[#F0FDF4] p-4 text-[#15803D] flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="h-5 w-5 text-[#16A34A] shrink-0" />
          <p className="text-xs font-bold text-[#15803D]">
            Settings saved successfully. Parameters updated across local procurement queue.
          </p>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Procurement Centre Info */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-5">
            <div className="rounded-lg bg-[#F0FDF4] p-2 text-[#16A34A] border border-emerald-100">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Procurement Centre Profile
              </h2>
              <p className="text-xs text-[#64748B]">
                Primary operational location details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Centre ID
              </label>
              <input
                type="text"
                value={centreId}
                onChange={(e) => setCentreId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] text-sm font-mono text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Centre Name
              </label>
              <input
                type="text"
                value={centreName}
                onChange={(e) => setCentreName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Capacity & Operational Parameters */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-5">
            <div className="rounded-lg bg-[#F0FDF4] p-2 text-[#16A34A] border border-emerald-100">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Capacity & Throughput Parameters
              </h2>
              <p className="text-xs text-[#64748B]">
                Values used to calculate estimated farmer wait times & intake closure
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Daily Capacity (Tons)
              </label>
              <input
                type="number"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Active Weighbridge Counters
              </label>
              <input
                type="number"
                value={activeCounters}
                onChange={(e) => setActiveCounters(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                Avg. Processing Time (Mins)
              </label>
              <input
                type="number"
                value={avgProcessingTime}
                onChange={(e) => setAvgProcessingTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Notification Settings */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-5">
            <div className="rounded-lg bg-[#F0FDF4] p-2 text-[#16A34A] border border-emerald-100">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                Notification & Alert Controls
              </h2>
              <p className="text-xs text-[#64748B]">
                Automated SMS token dispatches and operator notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Automatic SMS Token Alerts to Farmers
                </p>
                <p className="text-xs text-[#64748B]">
                  Send SMS token confirmation and estimated arrival slot to registered phone numbers
                </p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5E7EB] text-[#16A34A] focus:ring-[#16A34A]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  High Queue Capacity Warning Alerts
                </p>
                <p className="text-xs text-[#64748B]">
                  Alert operators when waiting queue exceeds 80% daily processing threshold
                </p>
              </div>
              <input
                type="checkbox"
                checked={queueThresholdAlerts}
                onChange={(e) => setQueueThresholdAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-[#E5E7EB] text-[#16A34A] focus:ring-[#16A34A]"
              />
            </label>
          </div>
        </div>

        {/* Section 4: System & Offline Sync Status */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] pb-4 mb-5">
            <div className="rounded-lg bg-[#F0FDF4] p-2 text-[#16A34A] border border-emerald-100">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                System & Offline Sync Diagnostics
              </h2>
              <p className="text-xs text-[#64748B]">
                Local database and cloud replication state
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
              <span className="text-[#64748B] block">Local Database Status</span>
              <span className="font-bold text-[#16A34A] text-sm flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Ready & Healthy
              </span>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] space-y-1">
              <span className="text-[#64748B] block">Pending Cloud Sync Records</span>
              <span className="font-bold text-[#0F172A] text-sm">7 Records Queued</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
