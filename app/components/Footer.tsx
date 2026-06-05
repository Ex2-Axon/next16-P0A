import { Globe, GitFork, Mail, MessageCircle, MessageSquare } from "lucide-react";

const externalLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/MicrotronicTH",
    icon: Globe,
  },
  {
    label: "GitHub",
    href: "https://github.com/microtronic-thailand",
    icon: GitFork,
  },
  {
    label: "Discord",
    href: "https://discord.gg/ZBu8ARCW",
    icon: MessageSquare,
  },
  {
    label: "LINE",
    href: "https://lin.ee/nHRMd36",
    icon: MessageCircle,
  },
  {
    label: "Email",
    href: "mailto:grids@microtronic.biz",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">
              Microtronic Thailand
            </p>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Official donation and payments portal for creators and social projects. Stay connected through secure micro-donations and modern payment flows.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <a
                    href="https://microtronic-thailand.github.io/privacy-policy/?lang=en"
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://microtronic-thailand.github.io/terms-conditions/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-white"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Get in touch</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-400">
                <li>
                  <a
                    href="https://microtronic.biz/"
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-white"
                  >
                    Official Website
                  </a>
                </li>
                <li>
                  <span className="text-slate-500">Email: grids@microtronic.biz</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 border-t border-slate-800/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © 2026 <a href="https://microtronic.biz/" target="_blank" rel="noreferrer" className="text-white transition hover:text-cyan-300">
              Microtronic Thailand
            </a>
            . All rights reserved.
          </p>
          <div className="flex flex-wrap gap-3">
            {externalLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
