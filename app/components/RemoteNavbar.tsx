import { fetchRemoteComponent } from "@/lib/server-api";
import { Award, Compass } from "lucide-react";

export default async function RemoteNavbar() {
  const component = await fetchRemoteComponent("navbar");
  const data = component?.data ?? component?.render ?? {};
  const content = (data.content ?? data) as Record<string, string>;

  const brand = content.brand ?? "Microtronic Thailand";
  const badge = content.badge ?? "Donation & Payment";
  const subtitle = content.subtitle ?? "Support creators and communities with secure micro donations.";
  const actionLabel = content.actionLabel ?? "Micro Donate & Payment";
  const actionHref = content.actionHref ?? "https://microtronic-thailand.github.io/micro-payment/";
  const ctaText = content.ctaText ?? "นัดหมาย Exclusive";
  const ctaHref = content.ctaHref ?? "#schedule-section";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-xl transition duration-300">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:max-w-7xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-500 shadow-lg shadow-amber-500/20">
            <Compass className="h-6 w-6 text-slate-950" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-black tracking-[0.18em] text-transparent bg-gradient-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text">
              {brand}
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">{badge}</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 text-xs text-slate-300 lg:flex">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-slate-200">
            <Award className="h-4 w-4 text-amber-400" />
            <span>{subtitle}</span>
          </div>
          <a
            href={actionHref}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-300 transition hover:bg-amber-400/20 hover:text-amber-100"
          >
            {actionLabel}
          </a>
        </div>

        <a
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-rose-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] hover:shadow-lg hover:shadow-rose-500/20"
        >
          {ctaText}
        </a>
      </div>
    </nav>
  );
}
