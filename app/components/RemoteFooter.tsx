import { fetchRemoteComponent } from "@/lib/server-api";
import { Globe, GitFork, Mail, MessageCircle, MessageSquare } from "lucide-react";

export default async function RemoteFooter() {
  const component = await fetchRemoteComponent("footer");
  const data = component?.data ?? component?.render ?? {};

  const description = (data.content as { description?: string })?.description ??
    "Official donation and payments portal for creators and social projects. Stay connected through secure micro-donations and modern payment flows.";

  const legalLinks = (data.legalLinks as Array<{ label: string; href: string }> | undefined) ?? [
    {
      label: "Privacy Policy",
      href: "https://microtronic-thailand.github.io/privacy-policy/?lang=en",
    },
    {
      label: "Terms of Service",
      href: "https://microtronic-thailand.github.io/terms-conditions/",
    },
  ];

  const contactLinks = (data.contactLinks as Array<{ label: string; href: string }> | undefined) ?? [
    {
      label: "Official Website",
      href: "https://microtronic.biz/",
    },
    {
      label: "Email: grids@microtronic.biz",
      href: "mailto:grids@microtronic.biz",
    },
  ];

  const socialLinks = (data.socialLinks as Array<{ label: string; href: string }> | undefined) ?? [
    {
      label: "Facebook",
      href: "https://www.facebook.com/MicrotronicTH",
    },
    {
      label: "GitHub",
      href: "https://github.com/microtronic-thailand",
    },
    {
      label: "Discord",
      href: "https://discord.gg/ZBu8ARCW",
    },
    {
      label: "LINE",
      href: "https://lin.ee/nHRMd36",
    },
    {
      label: "Email",
      href: "mailto:grids@microtronic.biz",
    },
  ];

  const iconMap: Record<string, typeof Globe> = {
    Facebook: Globe,
    GitHub: GitFork,
    Discord: MessageSquare,
    LINE: MessageCircle,
    Email: Mail,
  };

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">Microtronic Thailand</p>
          <p className="max-w-2xl text-sm leading-7 text-slate-400">{description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Legal</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Contact</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {contactLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Follow us</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = iconMap[social.label] ?? Globe;
                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 <a href="https://microtronic.biz/" target="_blank" rel="noreferrer" className="text-white transition hover:text-cyan-300">
              Microtronic Thailand
            </a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
