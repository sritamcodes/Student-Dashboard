"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console or error reporter
    console.error("Dashboard error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050508] p-6">
      <div className="relative p-[1px] rounded-2xl glass w-full max-w-md overflow-hidden text-center">
        {/* Border glow decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/0 pointer-events-none -z-10" />
        <div className="absolute inset-[1px] rounded-[15px] bg-[#0c0c12]/95 -z-5" />

        <div className="p-8 flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-[#f4f4f7] mb-2 tracking-wide font-sans">
            Something went wrong
          </h2>
          
          <p className="text-sm text-neutral-400 mb-6 font-sans leading-relaxed">
            Failed to retrieve course learning progress from the database. Please verify your connection settings and try again.
          </p>

          <button
            id="error-reset-button"
            onClick={() => reset()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-sm font-semibold text-[#f4f4f7] border border-white/10 shadow-lg shadow-accent-primary/20 transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
