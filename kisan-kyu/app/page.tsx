import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import heroImage from "@/components/assert/image.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col justify-between font-sans selection:bg-[#F0FDF4] selection:text-[#16A34A]">
      {/* Top Identity Header */}
      <header className="px-8 sm:px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xl font-bold tracking-tight text-[#111827] block leading-none">
              Kisan Kyu
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#16A34A]">
              SMART PROCUREMENT QUEUE
            </span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Hero Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-8 sm:px-12 flex items-center py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          {/* Left Column: Identity & Call to Action */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.1]">
                Smarter Queues. <br />
                <span className="text-[#16A34A]">Better Procurement.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-lg font-normal">
                Kisan Kyu helps procurement centres manage farmer queues, predict waiting time, and make every visit more efficient.
              </p>
            </div>

            {/* Single Primary Action Button */}
            <div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm transition-all shadow-sm shadow-emerald-600/10 group"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Image from assert */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs flex items-center justify-center p-2">
              <Image
                src={heroImage}
                alt="Kisan Kyu Procurement Visual"
                width={320}
                height={320}
                className="w-full max-w-[320px] h-auto object-contain rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Bottom Footer */}
      <footer className="px-8 sm:px-12 py-6 text-center text-xs text-[#64748B] border-t border-slate-100">
        Smart Queue Management &amp; Procurement Logistics
      </footer>
    </div>
  );
}
