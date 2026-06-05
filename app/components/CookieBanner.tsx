"use client";

import { useState } from "react";
import { Settings2, Slash, X, CheckCircle2 } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl rounded-3xl border border-slate-700/80 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
              <Settings2 className="h-4 w-4 text-cyan-300" />
              Cookie Notice
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-300">
              We use cookies to enhance your browsing experience, improve site functionality, and analyze traffic. You can manage preferences at any time.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Close cookie banner"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span>Manage your preferences:</span>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-slate-200 transition hover:bg-slate-800"
            >
              <Settings2 className="h-4 w-4" />
              Cookies Settings
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-transparent px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              <Slash className="h-4 w-4" />
              Reject All
            </button>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
