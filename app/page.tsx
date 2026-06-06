import AnimatedHero from "./components/AnimatedHero";
import CookieBanner from "./components/CookieBanner";
import RemoteFooter from "./components/RemoteFooter";
import { ArrowRight, CircleDollarSign, ShieldCheck, Sparkles, Users } from "lucide-react";

const featureCards = [
  {
    title: "Fast Payments",
    description: "Accept donations and payments with lightning-fast micro-transaction flows built for modern audiences.",
    icon: CircleDollarSign,
  },
  {
    title: "Secure by Design",
    description: "Protect donor data with secure patterns and clear privacy-first messaging throughout the payment experience.",
    icon: ShieldCheck,
  },
  {
    title: "Community First",
    description: "Create trust across channels with social links, Discord support, and easy access to your main site.",
    icon: Users,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <AnimatedHero />

        <section className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Trusted donation platform</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A welcoming donation page for creators, charities, and community teams.
              </h2>
              <p className="text-base leading-8 text-slate-400 sm:text-lg">
                Convert visitors into supporters with a clean donation journey, easy navigation, and simple access to your Micro Donate & Payment system.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {featureCards.map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/50 hover:bg-slate-900/90">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-linear-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-8 shadow-2xl shadow-slate-950/30">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Make it easier</p>
              <h3 className="text-2xl font-semibold text-white sm:text-3xl">
                Build a distinct donation hub with modern branding and simple action points.
              </h3>
              <p className="text-base leading-7 text-slate-300">
                Your audience sees a compelling case to support your mission, complete with fast access links to Micro Donate & Payment and clearly labeled contact channels.
              </p>
            </div>

            <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-cyan-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Micro Donate Subscription</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Embed donation buttons and keep supporters engaged with clear, friendly micro payments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-cyan-300">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Instant access</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Direct buttons and external links make it easy for visitors to give without complexity.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-4xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Launch with confidence</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Ready to connect supporters, donors, and community members in one place.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-400">
                Use Microtronic Thailand’s official payment page as the central destination for micro donations, social outreach, and policy transparency.
              </p>
            </div>
            <a
              href="https://microtronic-thailand.github.io/micro-payment/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Visit Micro Donate & Payment
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </div>

      <RemoteFooter />
      <CookieBanner />
    </main>
  );
}
