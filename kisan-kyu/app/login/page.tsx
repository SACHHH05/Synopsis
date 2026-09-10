import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#16A34A] flex items-center justify-center font-bold text-white text-xl">
              K
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Kisan Kyu
            </span>
          </Link>
          <h2 className="text-lg font-bold text-slate-900">Procurement Centre Login</h2>
          <p className="text-slate-500 text-xs mt-1">
            Enter your credentials to access the centre portal
          </p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Operator ID / Phone
            </label>
            <input
              type="text"
              placeholder="CEN-001-OP or +91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAF9] border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password / Passcode
              </label>
              <a href="#" className="text-xs text-[#16A34A] font-medium hover:underline">
                Forgot passcode?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#F8FAF9] border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent text-sm transition-all"
            />
          </div>

          <Link
            href="/dashboard"
            className="w-full mt-2 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm transition-all shadow-sm"
          >
            Access Dashboard
          </Link>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          Authorized Procurement Staff Only &bull;{" "}
          <Link href="/" className="text-[#16A34A] font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
