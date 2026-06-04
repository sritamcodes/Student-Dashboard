import Sidebar from "@/components/Sidebar";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full bg-[#050508]">
      {/* Static Sidebar placeholder on page load */}
      <Sidebar />

      {/* Main shell matching page structure */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-20 lg:pl-64 pb-20 md:pb-6">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6 lg:px-8 bg-[#050508cc] backdrop-blur-md border-b border-white/5">
          <div className="h-4.5 w-16 bg-white/5 rounded-md animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-48 bg-white/5 rounded-xl animate-pulse hidden sm:block" />
            <div className="h-8.5 w-8.5 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </header>

        {/* Content grid skeleton */}
        <main className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto w-full">
          <LoadingSkeleton />
        </main>
      </div>
    </div>
  );
}
