import { useState } from 'react'
import axios from 'axios'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL

interface UrlShortenerFormProps {
  onUrlShortened: (originalUrl: string, shortUrl: string) => void;
}

export function UrlShortenerForm({ onUrlShortened }: UrlShortenerFormProps) {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: any = {
        original_url: url,
      }

      if (customSlug) {
        payload.custom_slug = customSlug
      }

      if (expirationDate) {
        payload.expiration_date = new Date(expirationDate).toISOString()
      }

      const response = await axios.post(`${API_URL}/api/urls`, payload)
      const newShortUrl = `${API_URL}/${response.data.short_code}`
      onUrlShortened(url, newShortUrl)
      
      // Reset form
      setUrl('')
      setCustomSlug('')
      setExpirationDate('')
    } catch (err: any) {
      setError(err.response?.data || 'Failed to create short URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a link to shorten it"
              className="w-full px-4 py-3 bg-[#2A2A2A] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="Custom slug (optional)"
              className="w-full px-4 py-3 bg-[#2A2A2A] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <div className="flex-1">
            <input
              type="datetime-local"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#2A2A2A] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-200 flex items-center justify-center min-w-[120px] button-hover ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              'Shorten'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 text-red-400 text-center p-3 rounded-lg bg-red-900/20 animate-fade-in">
          {error}
        </div>
      )}
    </div>
  )
} 