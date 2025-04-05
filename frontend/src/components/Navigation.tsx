import { LinkIcon } from '@heroicons/react/24/outline'

export function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-lg z-50">
      <div className="flex items-center space-x-2">
        <LinkIcon className="w-6 h-6 text-blue-500" />
        <span className="text-xl font-semibold">Shorten</span>
      </div>
      <div className="flex items-center space-x-6">
        <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
        <a href="#resources" className="text-gray-300 hover:text-white transition-colors">Resources</a>
        <button className="text-gray-300 hover:text-white transition-colors">Log in</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Sign Up
        </button>
      </div>
    </nav>
  )
} 