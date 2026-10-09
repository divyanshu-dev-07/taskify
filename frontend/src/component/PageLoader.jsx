import { Check } from "lucide-react";

export default function PageLoader({ message = "Loading TodoFlow..." }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#F7F8FF]/92 dark:bg-slate-950/92 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5">
        <div className="relative h-16 w-16">
          <span className="absolute inset-0 rounded-2xl bg-indigo-600/20 animate-ping" />
          <span className="absolute inset-0 rounded-2xl border-2 border-indigo-500/30 border-t-indigo-600 animate-spin" />
          <span className="absolute inset-2 flex items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
            <Check size={22} strokeWidth={3} />
          </span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-100">
            Todo<span className="text-indigo-600">Flow</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{message}</p>
        </div>
      </div>
    </div>
  );
}
