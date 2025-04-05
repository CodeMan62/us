export function StatsBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-gray-800 my-24">
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-500 mb-2 stat-number">2M+</div>
        <div className="text-gray-400">Links shortened</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-500 mb-2 stat-number">1K+</div>
        <div className="text-gray-400">Active users</div>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold text-blue-500 mb-2 stat-number">99.9%</div>
        <div className="text-gray-400">Uptime guaranteed</div>
      </div>
    </div>
  )
} 