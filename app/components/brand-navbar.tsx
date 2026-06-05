import { Award, Compass } from 'lucide-react';

export default function BrandNavbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl px-6 py-4">
      <div className="mx-auto flex flex-wrap items-center justify-between gap-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-linear-to-br from-amber-400 via-rose-500 to-purple-500 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <Compass className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <p className="text-base font-black tracking-[0.18em] text-transparent bg-linear-to-r from-amber-400 via-rose-300 to-purple-400 bg-clip-text">
              VARISARA AURA
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Aura Luxe Real Estate</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 text-xs text-slate-400 lg:flex">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-2 text-slate-200">
            <Award className="h-4 w-4 text-amber-400" />
            <span>ยอดขายกว่า 1.8 หมื่นล้านบาท</span>
          </div>
          <a
            href="https://microtronic-thailand.github.io/micro-payment/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-amber-300 transition hover:bg-amber-400/20 hover:text-amber-100"
          >
            Micro Donate & Payment
          </a>
        </div>

        <a
          href="#schedule-section"
          className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-rose-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-[1.02]"
        >
          นัดหมาย Exclusive
        </a>
      </div>
    </nav>
  );
}
