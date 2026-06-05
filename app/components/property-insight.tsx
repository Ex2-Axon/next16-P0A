import Image from 'next/image';
import { Calendar, Lock, Shield, Sparkles, Workflow } from 'lucide-react';
import { Property } from './property-data';

type PropertyInsightProps = {
  selectedProperty: Property;
  tourMode: 'Normal' | 'Thermal' | 'Blueprint';
  onTourModeChange: (mode: 'Normal' | 'Thermal' | 'Blueprint') => void;
  isVideoPlaying: boolean;
  onToggleVideo: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  scanProgress: number;
  triggerNotification: (message: string) => void;
};

export default function PropertyInsight({
  selectedProperty,
  tourMode,
  onTourModeChange,
  isVideoPlaying,
  onToggleVideo,
  isMuted,
  onToggleMute,
  scanProgress,
  triggerNotification,
}: PropertyInsightProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-12">
      <div className="space-y-8 rounded-4xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-0.5 w-10 bg-amber-400" />
            <span className="text-xs uppercase tracking-[0.35em] text-amber-400">Selected Property Radar</span>
          </div>
          <h2 className="text-3xl font-black text-white">{selectedProperty.title}</h2>
          <p className="text-sm text-slate-400">{selectedProperty.location}</p>
        </div>

        <div className="space-y-6">
          {[
            { label: 'Absolute Privacy', value: selectedProperty.specs.privacy, color: 'from-fuchsia-600 to-purple-400' as const, icon: Lock },
            { label: 'Aesthetic Score', value: selectedProperty.specs.aesthetic, color: 'from-amber-500 to-amber-300' as const, icon: Sparkles },
            { label: 'Strategic Security', value: selectedProperty.specs.security, color: 'from-rose-600 to-rose-400' as const, icon: Shield },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-fuchsia-400" />
                  {label}
                </span>
                <span className="font-bold text-white">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-950">
                <div className={`h-full rounded-full bg-linear-to-r ${color}`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-3xl bg-slate-950/60 p-5 border border-white/10">
          <h3 className="text-xs uppercase tracking-[0.35em] text-slate-400">สเปกพิเศษผ่านการตรวจเช็ก</h3>
          {selectedProperty.highlights.map((item, index) => (
            <div key={index} className="flex items-start gap-3 text-sm text-slate-300">
              <Workflow className="mt-1 h-4 w-4 text-emerald-400" />
              <p>{item}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              <span className="block uppercase tracking-[0.35em]">ราคาประเมินโดยวริศรา</span>
              <span className="text-2xl font-black text-amber-400">{selectedProperty.price}</span>
            </div>
            <a
              href="#schedule-section"
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <Calendar className="h-4 w-4 text-amber-400" />
              จองสิทธิ์เข้าชมนอกสถานที่
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-4xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30 lg:mt-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-purple-400">Aura Inspection Terminal</p>
            <h2 className="text-2xl font-black text-white">Virtual View</h2>
          </div>
          <div className="flex items-center gap-2 rounded-3xl bg-slate-950/70 p-1.5 text-[10px] uppercase text-slate-300">
            {(['Normal', 'Thermal', 'Blueprint'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  onTourModeChange(mode);
                  triggerNotification(`เปลี่ยนกล้องเป็นโหมด ${mode}`);
                }}
                className={`rounded-2xl px-3 py-2 transition ${tourMode === mode ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-4xl border border-white/10 bg-slate-950 aspect-video">
          <Image
            src={selectedProperty.image}
            alt={selectedProperty.title}
            fill
            className={`object-cover transition duration-700 ${tourMode === 'Thermal' ? 'contrast-125 saturate-150 hue-rotate-160 brightness-90' : ''} ${tourMode === 'Blueprint' ? 'grayscale contrast-150 brightness-75 opacity-80' : ''} ${isVideoPlaying ? 'scale-105' : 'scale-100'}`}
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
          <div className="absolute inset-0 pointer-events-none">
            {tourMode === 'Thermal' && <div className="h-full w-full bg-linear-to-tr from-blue-950/40 via-red-950/30 to-yellow-500/10 mix-blend-color-dodge" />}
            {tourMode === 'Blueprint' && (
              <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.04),rgba(255,255,255,0.04)),linear-gradient(90deg,rgba(0,255,0,0.08) 1px,transparent 1px),linear-gradient(rgba(0,255,255,0.08),rgba(0,255,255,0.08))] bg-size-[100%_4px,4px_100%,100%_100%] mix-blend-screen" />
            )}
          </div>

          <div className="absolute inset-x-4 bottom-4 z-20 rounded-3xl border border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onToggleVideo();
                    triggerNotification(isVideoPlaying ? 'หยุดภาพชั่วคราว' : 'เริ่มจำลองภาพเคลื่อนไหว');
                  }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition hover:bg-amber-300"
                >
                  {isVideoPlaying ? '||' : '▶'}
                </button>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-white">{isVideoPlaying ? 'กำลังจำลองบินโดรนสำรวจ' : 'หยุดภาพเพื่อวิเคราะห์สัดส่วน'}</p>
                  <p className="text-xs text-slate-400">ระบบฟิลเตอร์กล้องสถาปัตย์แบบเรียลไทม์</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-end gap-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <span
                      key={index}
                      className={`block h-1 rounded-full bg-amber-400 transition-all ${isVideoPlaying && !isMuted ? 'w-2' : 'w-1'}`}
                      style={{ animationDelay: `${index * 90}ms`, animationName: isVideoPlaying && !isMuted ? 'bounce' : 'none', animationDuration: '500ms', animationIterationCount: 'infinite', animationDirection: 'alternate' }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onToggleMute();
                    triggerNotification(isMuted ? 'เปิดเสียงสุนทรียศาสตร์' : 'ปิดเสียงเรียบร้อย');
                  }}
                  className="inline-flex h-12 items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 text-sm text-slate-200 transition hover:bg-white/10"
                >
                  {isMuted ? 'ปิดเสียง' : 'เปิดเสียง'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>ระบบสแกน</span>
            <span>{Math.floor(scanProgress)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full bg-linear-to-r from-amber-400 to-rose-400" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
