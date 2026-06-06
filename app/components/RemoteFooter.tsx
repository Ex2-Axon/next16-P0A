import { fetchRemoteRenderedComponent } from "@/lib/server-api";

export default async function RemoteFooter() {
  const html = await fetchRemoteRenderedComponent("footer");

  if (!html) {
    return (
      <footer className="border-t border-slate-800/80 bg-slate-950/95 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm text-slate-400">Footer content is loading from the remote server.</p>
        </div>
      </footer>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
