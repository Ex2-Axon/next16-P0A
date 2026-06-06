import { fetchRemoteRenderedComponent } from "@/lib/server-api";

export default async function RemoteNavbar() {
  const html = await fetchRemoteRenderedComponent("navbar");

  if (!html) {
    return (
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-white sm:px-6 lg:px-8">
          <span className="text-sm font-semibold">Microtronic Thailand</span>
        </div>
      </nav>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
