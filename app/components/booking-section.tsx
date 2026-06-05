import type { FormEvent } from 'react';
import { Calendar, Clock, CheckCircle2, Phone, Shield, User } from 'lucide-react';

type BookingSectionProps = {
  selectedDate: string;
  selectedTime: string;
  clientName: string;
  clientPhone: string;
  bookingConfirmed: boolean;
  onSetSelectedDate: (value: string) => void;
  onSetSelectedTime: (value: string) => void;
  onSetClientName: (value: string) => void;
  onSetClientPhone: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onResetBooking: () => void;
};

export default function BookingSection({
  selectedDate,
  selectedTime,
  clientName,
  clientPhone,
  bookingConfirmed,
  onSetSelectedDate,
  onSetSelectedTime,
  onSetClientName,
  onSetClientPhone,
  onSubmit,
  onResetBooking,
}: BookingSectionProps) {
  return (
    <section id="schedule-section" className="py-24 bg-slate-900/20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-4xl border border-amber-500/20 bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 p-8 shadow-[0_0_50px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-amber-300">
              <Shield className="h-4 w-4 animate-pulse text-amber-400" />
              รับสิทธิ์เข้าถึงคลังข้อมูลลับสุดยอด
            </div>
            <h2 className="text-3xl font-black text-white md:text-4xl">ลงทะเบียนเยี่ยมชมแบบส่วนตัว</h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400">
              เฉพาะสมาชิกวีไอพีที่ได้รับการคัดเลือกเท่านั้นที่จะได้รับการต้อนรับด้วยแชมเปญชั้นเลิศและรถลีมูซีนรับ-ส่งไปเยี่ยมชมโครงการจริงโดยตรง.
            </p>
          </div>

          {bookingConfirmed ? (
            <div className="space-y-6 rounded-4xl bg-slate-950/80 p-10 text-center text-slate-200 shadow-lg shadow-slate-950/30">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-rose-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-amber-300">จองสิทธิ์เรียบร้อยแล้ว</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  ขอบคุณ คุณ <strong className="text-white">{clientName}</strong> สำหรับความไว้วางใจ เจ้าหน้าที่จะติดต่อกลับที่หมายเลข <strong className="text-white">{clientPhone}</strong> ในไม่ช้า.
                </p>
              </div>
              <button
                type="button"
                onClick={onResetBooking}
                className="rounded-full bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                ลงทะเบียนให้ผู้อื่นเพิ่ม
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <User className="h-4 w-4 text-amber-400" />
                    ชื่อ-นามสกุล ของท่าน
                  </span>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(event) => onSetClientName(event.target.value)}
                    placeholder="เช่น คุณกิตติพัฒน์ มหาเศรษฐี"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Phone className="h-4 w-4 text-amber-400" />
                    หมายเลขติดต่อส่วนบุคคล
                  </span>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(event) => onSetClientPhone(event.target.value)}
                    placeholder="เช่น 089-123-4567"
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    เลือกวันที่ต้องการจอง
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => onSetSelectedDate(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-300">
                  <span className="flex items-center gap-2 font-semibold text-white">
                    <Clock className="h-4 w-4 text-amber-400" />
                    ช่วงเวลาที่สะดวก
                  </span>
                  <select
                    value={selectedTime}
                    onChange={(event) => onSetSelectedTime(event.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400"
                    required
                  >
                    <option value="">เลือกเวลาที่ต้องการ...</option>
                    <option value="09:00 - 11:30">ช่วงสาย (09:00 - 11:30 น.)</option>
                    <option value="13:00 - 15:30">ช่วงบ่าย (13:00 - 15:30 น.)</option>
                    <option value="16:00 - 18:30">ช่วงเย็น (16:00 - 18:30 น.)</option>
                    <option value="20:00 - 22:00">เวลาค่ำ (20:00 - 22:00 น.)</option>
                  </select>
                </label>
              </div>

              <div className="flex gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
                <Shield className="h-5 w-5 text-amber-400" />
                <p>
                  ข้อมูลของท่านจะถูกจัดเก็บด้วยมาตรฐานความปลอดภัยระดับทหาร และจะไม่มีการเปิดเผยต่อสาธารณะชนโดยเด็ดขาด.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-3xl bg-linear-to-r from-amber-500 via-rose-500 to-purple-600 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]"
              >
                ยืนยันคิวพิเศษระดับอัครมหาเศรษฐี
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
