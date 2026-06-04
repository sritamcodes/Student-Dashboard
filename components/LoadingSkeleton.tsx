import BentoGrid from "./BentoGrid";

export default function LoadingSkeleton() {
  return (
    <BentoGrid className="animate-pulse">
      {/* Hero Tile Skeleton (spans 2 columns on desktop) */}
      <div className="relative md:col-span-2 col-span-1 rounded-2xl glass p-6 lg:p-8 flex flex-col justify-between min-h-[220px]">
        <div className="flex flex-col gap-3">
          {/* Top date badge skeleton */}
          <div className="h-4 w-40 bg-white/5 rounded-md" />
          {/* Title skeleton */}
          <div className="h-10 w-2/3 bg-white/10 rounded-lg mt-2" />
          {/* Subtitle skeleton */}
          <div className="h-4 w-1/2 bg-white/5 rounded-md mt-1" />
        </div>
        {/* Bottom indicator card skeleton */}
        <div className="flex justify-end mt-4">
          <div className="h-16 w-64 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Activity Tile Skeleton */}
      <div className="col-span-1 rounded-2xl glass p-5 flex flex-col justify-between min-h-[220px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/10" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-24 bg-white/10 rounded" />
              <div className="h-2 w-16 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-5 w-20 bg-white/10 rounded-full" />
        </div>
        
        {/* Heatmap grid mockup skeleton */}
        <div className="flex flex-col gap-3 items-center justify-center my-auto">
          <div className="h-14 w-full bg-white/5 rounded-md" />
          <div className="h-3 w-full bg-white/5 rounded" />
        </div>
      </div>

      {/* 4 Course Card Skeletons */}
      {[1, 2, 3, 4].map((id) => (
        <div 
          key={id} 
          className="relative p-[1px] rounded-2xl glass min-h-[180px] flex flex-col justify-between overflow-hidden"
        >
          {/* Inner card plate skeleton */}
          <div className="absolute inset-[1px] rounded-[15px] bg-[#08080cb3] -z-5" />
          
          <div className="p-5 flex flex-col justify-between h-full relative z-10">
            <div className="flex items-start justify-between">
              {/* Icon box */}
              <div className="h-11 w-11 rounded-xl bg-white/10" />
              {/* Top arrow container */}
              <div className="h-7 w-7 rounded-lg bg-white/5" />
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              {/* Title */}
              <div className="h-5 w-3/4 bg-white/10 rounded-md" />
              {/* Progress bar info & bar */}
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-12 bg-white/5 rounded" />
                  <div className="h-3.5 w-8 bg-white/10 rounded" />
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </BentoGrid>
  );
}
