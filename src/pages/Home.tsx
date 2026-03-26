import { Link } from 'react-router-dom'
import { listings } from '../data/listings'
import { GA_CITIES } from '../data/listings'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ms-navy via-ms-navy-light to-ms-navy text-white">
        <div className="max-w-lg mx-auto px-4 pt-12 pb-16">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-ms-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MS</span>
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">Mark Spain</p>
              <p className="text-xs text-gray-300">REAL ESTATE</p>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight">
            Find Your Dream Home
            <br />
            <span className="text-ms-red">with AI</span>
          </h1>
          <p className="mt-3 text-gray-300 text-sm leading-relaxed">
            Tell our AI assistant what you're looking for — budget, size, features, location — and
            we'll find the perfect match in seconds.
          </p>

          <div className="flex gap-3 mt-8">
            <Link
              to="/chat"
              className="flex-1 bg-ms-red hover:bg-ms-red-dark text-white font-semibold py-3 px-4 rounded-xl text-center transition-colors text-sm"
            >
              Chat with AI
            </Link>
            <Link
              to="/listings"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl text-center transition-colors text-sm border border-white/20"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 -mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-ms-red">{listings.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active Listings</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-ms-red">{GA_CITIES.length}</p>
            <p className="text-xs text-gray-500 mt-1">GA Cities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-ms-red">AI</p>
            <p className="text-xs text-gray-500 mt-1">Powered Search</p>
          </div>
        </div>
      </div>

      {/* Quick Search Suggestions */}
      <div className="max-w-lg mx-auto px-4 mt-8 pb-8">
        <h2 className="font-bold text-ms-navy text-lg mb-4">Popular Searches</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Under $400K', to: '/chat', query: 'homes under $400k' },
            { label: 'With Pool', to: '/chat', query: 'homes with a pool' },
            { label: '4+ Bedrooms', to: '/chat', query: '4 bedroom homes' },
            { label: 'New Construction', to: '/chat', query: 'new construction homes' },
            { label: 'In Alpharetta', to: '/chat', query: 'homes in Alpharetta' },
            { label: '$2K/month', to: '/chat', query: 'homes for $2000 a month' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              state={{ initialQuery: item.query }}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-ms-navy text-sm">{item.label}</p>
              <p className="text-xs text-gray-400 mt-1">Tap to search</p>
            </Link>
          ))}
        </div>

        {/* Featured Listings Preview */}
        <h2 className="font-bold text-ms-navy text-lg mt-8 mb-4">Featured Homes</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {listings.slice(0, 5).map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-gray-200 overflow-hidden">
                <img
                  src={listing.imageUrl}
                  alt={listing.address}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="font-bold text-ms-navy">${listing.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500 truncate">{listing.address}</p>
                <p className="text-xs text-gray-400">{listing.city}, GA</p>
                <div className="flex gap-2 mt-1 text-xs text-ms-navy font-medium">
                  <span>{listing.beds} bd</span>
                  <span>|</span>
                  <span>{listing.baths} ba</span>
                  <span>|</span>
                  <span>{listing.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
