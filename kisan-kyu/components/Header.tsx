import Link from "next/link";

interface HeaderProps {
  title?: string;
  alertCount?: number;
  userName?: string;
}

export default function Header({
  title = "Dashboard",
  alertCount = 2,
  userName = "Rajesh Kumar",
}: HeaderProps) {
  return (
    <header className="h-16 shrink-0 border-b border-[#E5E7EB] bg-white px-6 flex items-center justify-between">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-[#0F172A]">
          {title}
        </h1>
      </div>

      {/* Right Navigation Controls */}
      <div className="flex items-center gap-4">
        {/* Alerts */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        >
          <span>Alerts</span>
          {alertCount > 0 && (
            <span className="rounded-full bg-[#16A34A] px-2 py-0.5 text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>

        <div className="hidden h-4 w-px bg-[#E5E7EB] sm:block" />

        {/* User Info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="hidden text-[#64748B] sm:inline">Operator:</span>
          <span className="font-semibold text-[#0F172A]">{userName}</span>
        </div>

        {/* Sign Out */}
        <Link
          href="/"
          className="rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-xs font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]"
        >
          Sign Out
        </Link>
      </div>
    </header>
  );
}