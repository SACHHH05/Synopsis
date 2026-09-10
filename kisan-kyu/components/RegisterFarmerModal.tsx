"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export interface RegisterFarmerFormData {
  farmerName: string;
  phoneNumber: string;
  farmerId: string;
  cropType: string;
  lotSizeNum: number;
}

interface RegisterFarmerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegisterFarmerFormData) => void;
}

export default function RegisterFarmerModal({
  isOpen,
  onClose,
  onSubmit,
}: RegisterFarmerModalProps) {
  const [farmerName, setFarmerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [farmerId, setFarmerId] = useState("");
  const [cropType, setCropType] = useState("Wheat");
  const [lotSize, setLotSize] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!farmerName.trim()) {
      newErrors.farmerName = "Farmer name is required.";
    }

    const cleanPhone = phoneNumber.trim().replace(/\D/g, "");
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (cleanPhone.length < 10) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }

    if (!farmerId.trim()) {
      newErrors.farmerId = "Farmer ID / Registration # is required.";
    }

    if (!cropType) {
      newErrors.cropType = "Please select a crop.";
    }

    const parsedLotSize = parseFloat(lotSize);
    if (!lotSize.trim() || isNaN(parsedLotSize) || parsedLotSize <= 0) {
      newErrors.lotSize = "Enter a valid lot size greater than 0 tonnes.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        farmerName: farmerName.trim(),
        phoneNumber: phoneNumber.trim(),
        farmerId: farmerId.trim(),
        cropType,
        lotSizeNum: parseFloat(lotSize),
      });

      // Reset form
      setFarmerName("");
      setPhoneNumber("");
      setFarmerId("");
      setCropType("Wheat");
      setLotSize("");
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl border border-[#E5E7EB] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">Register Farmer</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Add a farmer to today&apos;s procurement queue
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Farmer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Singh"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-lg border text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent ${
                errors.farmerName ? "border-red-400 bg-red-50/50" : "border-[#E5E7EB] bg-white"
              }`}
            />
            {errors.farmerName && (
              <p className="text-xs text-red-500 mt-1">{errors.farmerName}</p>
            )}
          </div>

          {/* Phone Number & Farmer ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent ${
                  errors.phoneNumber ? "border-red-400 bg-red-50/50" : "border-[#E5E7EB] bg-white"
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Farmer ID / Reg # <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="FID-98214"
                value={farmerId}
                onChange={(e) => setFarmerId(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent ${
                  errors.farmerId ? "border-red-400 bg-red-50/50" : "border-[#E5E7EB] bg-white"
                }`}
              />
              {errors.farmerId && (
                <p className="text-xs text-red-500 mt-1">{errors.farmerId}</p>
              )}
            </div>
          </div>

          {/* Crop & Lot Size Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Crop <span className="text-red-500">*</span>
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent"
              >
                <option value="Paddy">Paddy</option>
                <option value="Wheat">Wheat</option>
                <option value="Maize">Maize</option>
                <option value="Other">Other</option>
              </select>
              {errors.cropType && (
                <p className="text-xs text-red-500 mt-1">{errors.cropType}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Lot Size (in Tonnes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 4.5"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-lg border text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent ${
                  errors.lotSize ? "border-red-400 bg-red-50/50" : "border-[#E5E7EB] bg-white"
                }`}
              />
              {errors.lotSize && (
                <p className="text-xs text-red-500 mt-1">{errors.lotSize}</p>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E7EB] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-xs font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-colors shadow-sm"
            >
              Generate Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
