import {
  ChartBarIcon,
  ShieldCheckIcon,
  CursorArrowRaysIcon,
  ArrowTrendingUpIcon,
  DocumentChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl hover:bg-[#222] transition-colors feature-card">
      <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

export function Features() {
  return (
    <section className="mt-24" id="features">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why choose Shorten?</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Get more than just a shorter link. Build your brand's recognition and get detailed insights on how your links are performing.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={ChartBarIcon}
          title="Detailed Analytics"
          description="Track your links' performance with comprehensive click analytics and insights."
        />
        <FeatureCard
          icon={ShieldCheckIcon}
          title="Secure & Reliable"
          description="Enterprise-grade security with 99.9% uptime guarantee and SSL encryption."
        />
        <FeatureCard
          icon={CursorArrowRaysIcon}
          title="Easy Integration"
          description="Simple API integration with your existing tools and workflows."
        />
        <FeatureCard
          icon={ArrowTrendingUpIcon}
          title="Link Management"
          description="Organize, track, and manage all your links from one dashboard."
        />
        <FeatureCard
          icon={DocumentChartBarIcon}
          title="Custom Reports"
          description="Generate and export custom reports based on your link performance."
        />
        <FeatureCard
          icon={GlobeAltIcon}
          title="Global CDN"
          description="Lightning-fast redirects with our globally distributed network."
        />
      </div>
    </section>
  )
} 