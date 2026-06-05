import Image from 'next/image';

const galleryItems = [
  {
    title: 'ความสอดรับของแสงตะวัน',
    img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'พื้นอ่างออนเซ็นสปาส่วนตัว',
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'บันไดลอยเกลียวทองคำ',
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600',
  },
  {
    title: 'สระว่ายน้ำกระจกไร้ขอบล้น',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  },
];

export default function GalleryShowcase() {
  return (
    <section className="bg-linear-to-b from-slate-900 to-slate-950 py-24 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 space-y-12 text-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-400">Crafting Masterpieces</p>
          <h2 className="text-3xl font-black text-white md:text-5xl">ความงดงามไร้ตําหนิในทุกรายละเอียด</h2>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400">
            ทุกรายละเอียดมุมมองได้รับการคัดกรองจากสายตาสถาปนิกและนักแต่งบ้านระดับท็อปของประเทศเพื่อความงามอันเป็นเอกสิทธิ์หนึ่งเดียว.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item) => (
            <div key={item.title} className="group relative overflow-hidden rounded-4xl border border-white/10 bg-slate-950/70 hover:border-amber-400/30">
              <div className="relative h-72 overflow-hidden transition duration-700 group-hover:scale-105">
                <Image src={item.img} alt={item.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 600px" />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-400">DETAIL</p>
                <h3 className="mt-2 text-sm font-bold text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
