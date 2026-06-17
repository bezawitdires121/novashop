export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="aspect-square shimmer-bg" />
          <div className="p-4 space-y-3">
            <div className="h-3 w-1/3 rounded shimmer-bg" />
            <div className="h-4 w-3/4 rounded shimmer-bg" />
            <div className="h-5 w-1/2 rounded shimmer-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}