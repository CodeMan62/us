import { useState } from 'react'
import { Navigation } from './components/Navigation'
import { Hero } from './components/Hero'
import { UrlShortenerForm } from './components/UrlShortenerForm'
import { RecentUrls } from './components/RecentUrls'
import { StatsBar } from './components/StatsBar'
import { Features } from './components/Features'

function App() {
  const [recentUrls, setRecentUrls] = useState<Array<{ original: string; shortened: string }>>([])

  const handleUrlShortened = (originalUrl: string, shortUrl: string) => {
    setRecentUrls(prev => [{
      original: originalUrl,
      shortened: shortUrl
    }, ...prev].slice(0, 5))
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-6 py-16">
        <Hero />

        <div className="max-w-3xl mx-auto">
          <UrlShortenerForm onUrlShortened={handleUrlShortened} />
          <RecentUrls urls={recentUrls} />
        </div>

        <StatsBar />
        <Features />
      </main>
    </div>
  )
}

export default App
