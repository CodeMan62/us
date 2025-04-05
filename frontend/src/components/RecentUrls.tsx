import { ClipboardIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface RecentUrlsProps {
  urls: Array<{ original: string; shortened: string }>;
}

export function RecentUrls({ urls }: RecentUrlsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (textToCopy: string, index: number) => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (urls.length === 0) return null

  return (
    <div className="mt-8 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Recently shortened</h3>
      <div className="space-y-3">
        {urls.map((item, index) => (
          <div key={index} className="bg-[#1A1A1A] p-3 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 truncate">
                <p className="text-sm text-gray-400 truncate">{item.original}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={item.shortened}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  {item.shortened}
                </a>
                <button
                  onClick={() => copyToClipboard(item.shortened, index)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors relative"
                  title="Copy to clipboard"
                >
                  <ClipboardIcon className="w-4 h-4" />
                  {copiedIndex === index && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 