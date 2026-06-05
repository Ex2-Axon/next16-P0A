import Image from 'next/image';
import { Search, Sparkles } from 'lucide-react';
import { categories, PropertyCategory } from './property-data';

type HeroSectionProps = {
  searchQuery: string;
  onSearchQuery: (value: string) => void;
  selectedCategory: 'All' | PropertyCategory;
  onSelectedCategory: (value: 'All' | PropertyCategory) => void;
  priceRange: number;
  onPriceRange: (value: number) => void;
};

export default function HeroSection({
  searchQuery,
  onSearchQuery,
  selectedCategory,
  onSelectedCategory,
  priceRange,
  onPriceRange,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-6 py-12 lg:px-8 lg:py-16">
      <div className="absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-rose-300 shadow-lg shadow-slate-950/20">
            <Sparkles className="h-4 w-4 text-amber-400" />
            สัมผัสที่สุดของความวิจิตรตระการตา
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              ที่อยู่อาศัยที่สะท้อน
              <span className="block bg-linear-to-r from-amber-400 via-rose-400 to-purple-500 bg-clip-text text-transparent">&quot;ความเพอร์เฟกต์ระดับสูงสุด&quot;</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              คัดเลือกและเจรจาด้วยตัวเองทุกขั้นตอนโดย <span className="font-semibold text-amber-400 underline decoration-wavy">คุณวริศรา</span> ตัวแทนอสังหาฯ และนักออกแบบตกแต่งภายในผู้มีสายตาแหลมคม รักความสมบูรณ์แบบระดับ 100%.
            </p>
          </div>

          <div className="grid gap-6 rounded-4xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Virtual Concierge</p>
                <p className="mt-2 text-sm text-slate-300">
                  ค้นหาคฤหาสน์หรูหรือเกาะส่วนตัวด้วยตัวกรองพร้อมปุ่มลัด Micro Donate.
                </p>
              </div>
              <a
                href="https://microtronic-thailand.github.io/micro-payment/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                เปิด Micro Donate
              </a>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <label className="space-y-2 text-sm text-slate-400">
                <span>ค้นหา</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => onSearchQuery(event.target.value)}
                    placeholder="กรอกทำเลทองคำ..."
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-amber-400"
                  />
                </div>
              </label>
              <label className="space-y-2 text-sm text-slate-400">
                <span>ประเภท</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => onSelectedCategory(event.target.value as 'All' | PropertyCategory)}
                  className="w-full rounded-3xl border border-white/10 bg-slate-950/90 py-3 px-4 text-sm text-white outline-none transition focus:border-amber-400"
                >
                  {categories.map((option) => (
                    <option key={option} value={option} className="bg-slate-950 text-slate-100">
                      {option === 'All' ? 'ทั้งหมดทุกรูปแบบ' : option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-3 text-sm text-slate-400">
                <span className="flex items-center justify-between gap-2">
                  <span>งบสูงสุด</span>
                  <strong className="text-white">{priceRange} ล้านบาท</strong>
                </span>
                <input
                  type="range"
                  min={200}
                  max={1500}
                  step={50}
                  value={priceRange}
                  onChange={(event) => onPriceRange(Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-amber-400"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/40">
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/0 to-transparent opacity-80" />
          <div className="relative z-10 space-y-6">
            <div className="relative h-96 overflow-hidden rounded-[1.5rem] shadow-2xl shadow-slate-950/40">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=900"
                alt="Varisara luxury real estate"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 900px"
              />
            </div>
            <div className="space-y-2 rounded-[1.5rem] bg-slate-900/70 p-5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-400">
                FOUNDER & VISIONARY
              </p>
              <h2 className="text-2xl font-black text-white">วริศรา เสนีย์พิทักษ์</h2>
              <p className="text-sm text-slate-300">
                &quot;การเลือกคฤหาสน์ที่ดีที่สุด คือการใส่ใจถึงการโค้งงอของทิศทางลม&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
