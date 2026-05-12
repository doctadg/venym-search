export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-600">Loading</span>
      </div>
    </div>
  )
}
