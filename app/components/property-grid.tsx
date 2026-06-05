import Image from 'next/image';
import { CheckCircle2, ChevronRight, MapPin, Shield, Star } from 'lucide-react';
import { Property } from './property-data';

import { PropertyCategory } from './property-data';

type PropertyGridProps = {
  filteredProperties: Property[];
  selectedProperty: Property;
  onSelectProperty: (property: Property) => void;
  selectedCategory: 'All' | PropertyCategory;
  onSelectCategory: (category: 'All' | PropertyCategory) => void;
};

const filters = ['All', 'Penthouse', 'Mansion', 'Private Island'] as const;

export default function PropertyGrid({
  filteredProperties,
  selectedProperty,
  onSelectProperty,
  selectedCategory,
  onSelectCategory,
}: PropertyGridProps) {
  return (
    <section className="bg-slate-900/40 border-y border-white/10 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Exclusive Collection</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">ผลงานศิลปะที่คุณสามารถครอบครองได้</h2>
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {filters.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`rounded-full px-5 py-2 text-xs font-semibold tracking-widest transition ${
                  selectedCategory === category
                    ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {category === 'All' ? 'คอลเลกชันทั้งหมด' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <article
                key={property.id}
                onClick={() => onSelectProperty(property)}
                className={`group cursor-pointer overflow-hidden rounded-4xl border bg-slate-950/90 transition duration-300 hover:border-white/20 ${
                  selectedProperty.id === property.id ? 'border-amber-400 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-[1.01]' : 'border-white/5'
                }`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/10 to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full bg-slate-950/85 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-amber-400">
                    {property.category}
                  </div>
                  <div className="absolute left-4 top-16 rounded-full bg-slate-950/85 px-3 py-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-amber-400">
                    <Star className="h-3.5 w-3.5" /> Aura-Score {property.details.perfectionScore}%
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="flex items-center gap-2 text-[10px] text-rose-300">
                      <MapPin className="h-3.5 w-3.5" /> {property.location}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">{property.title}</h3>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-400">
                    <span>พื้นที่: <strong className="text-white">{property.details.area}</strong></span>
                    <span>
                      <strong className="text-white">{property.details.beds}</strong> ห้องนอน | <strong className="text-white">{property.details.baths}</strong> ห้องน้ำ
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {property.highlights.slice(0, 2).map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-1 h-4 w-4 text-amber-400" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                    <div>
                      <span className="block uppercase tracking-[0.25em]">ราคาขายเอกสิทธิ์</span>
                      <span className="text-lg font-bold text-amber-400">{property.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-300">
                      <span>ดูวิดเจ็ตสแกน</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full rounded-4xl border border-white/10 bg-slate-950/80 p-12 text-center text-slate-300">
              <Shield className="mx-auto mb-4 h-12 w-12 text-slate-500" />
              <p>ไม่พบอสังหาริมทรัพย์ระดับเทพที่ตรงกับช่วงราคาหรือหมวดหมู่ที่ระบุ</p>
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className="mt-6 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/10"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
