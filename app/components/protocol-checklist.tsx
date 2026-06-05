import { Activity, CheckCircle2 } from 'lucide-react';

type ProtocolChecklistProps = {
  checkedProtocols: Record<string, boolean>;
  onToggleProtocol: (id: string) => void;
  triggerNotification: (message: string) => void;
};

const protocols = [
  {
    id: 'p1',
    title: 'ตรวจแสงตามธรรมชาติ 4 ทิศทาง',
    desc: 'ต้องไม่สร้างจุดสะท้อนความร้อนเข้าสู่ห้องนอนหลักในช่วงบ่าย',
  },
  {
    id: 'p2',
    title: 'ระบบกรองอากาศ 5 ชั้น',
    desc: 'รับประกันความสดชื่นและป้องกันฝุ่น PM 2.5 ครบถ้วน 100%',
  },
  {
    id: 'p3',
    title: 'รอยต่อหินอ่อนไร้ตะเข็บ',
    desc: 'หินนำเข้าจากอิตาลีลวดลายต้องต่อเนื่องกันไม่ขัดสายตาแม้มิลลิเมตรเดียว',
  },
  {
    id: 'p4',
    title: 'โครงสร้างรับแรงแผ่นดินไหวสูงสุด',
    desc: 'เพื่อทัศนียภาพกว้างไกลแบบพาโนรามารอบทิศอย่างสมบูรณ์แบบที่สุด',
  },
  {
    id: 'p5',
    title: 'ศาสตร์ฮวงจุ้ยชั้นสูง',
    desc: 'คัดกรองพลังงานบวก พัดพาความเจริญรุ่งเรืองและสุขภาพดีมาให้ครอบครัว',
  },
];

export default function ProtocolChecklist({ checkedProtocols, onToggleProtocol, triggerNotification }: ProtocolChecklistProps) {
  return (
    <section className="bg-slate-950 border-t border-white/10 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.35em] text-rose-400">Varisara&apos;s Personal Guarantee</p>
          <h2 className="text-3xl font-black text-white md:text-5xl">โปรโตคอล<br />ความเพอร์เฟกต์ 150 ข้อ</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            เราไม่เคยปล่อยผ่านแม้แต่ตำหนิขนาดฝุ่น คุณวริศราได้ตั้งเกณฑ์การตรวจวัดอสังหาริมทรัพย์ก่อนส่งมอบให้กับท่านอย่างละเอียดยิบ.
          </p>
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-rose-500 text-slate-950 font-black">
              100%
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-white">รับประกันความพึงพอใจตลอดชีพ</p>
              <p className="mt-1 text-[11px] text-slate-400">รวมการรับประกันโครงสร้างและบริการหลังการโอนชั้นเลิศ</p>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 lg:mt-0">
          <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.35em] text-slate-400">
            <Activity className="h-5 w-5 text-rose-500" />
            รายงานการประเมินสภาพที่ดินและการตกแต่งภายใน
          </div>
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <button
                key={protocol.id}
                type="button"
                onClick={() => {
                  onToggleProtocol(protocol.id);
                  triggerNotification(checkedProtocols[protocol.id] ? `ปิดการตรวจสอบ: ${protocol.title}` : `ตรวจสอบผ่านเกณฑ์: ${protocol.title}`);
                }}
                className={`w-full rounded-3xl border p-4 text-left transition ${
                  checkedProtocols[protocol.id]
                    ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
                    : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-slate-950/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${checkedProtocols[protocol.id] ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600 text-slate-400'}`}>
                    {checkedProtocols[protocol.id] ? <CheckCircle2 className="h-4 w-4" /> : '•'}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{protocol.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{protocol.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
