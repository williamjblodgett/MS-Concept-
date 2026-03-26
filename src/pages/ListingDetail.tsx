import { useParams, Link, useNavigate } from 'react-router-dom'
import { listings } from '../data/listings'
import { useFavorites } from '../hooks/useFavorites'
import MortgageCalc from '../components/MortgageCalc'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const listing = listings.find((l) => l.id === id)

  if (!listing) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center">
        <p className="text-gray-500">Listing not found.</p>
        <Link to="/listings" className="text-ms-red text-sm mt-2 inline-block">
          Browse all listings
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto pb-8">
      {/* Image */}
      <div className="relative h-64 bg-gray-200">
        <img
          src={listing.imageUrl}
          alt={listing.address}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <svg className="w-5 h-5 text-ms-navy" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => toggleFavorite(listing.id)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"
        >
          <svg
            className={`w-5 h-5 ${isFavorite(listing.id) ? 'text-ms-red fill-ms-red' : 'text-gray-400'}`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            fill={isFavorite(listing.id) ? 'currentColor' : 'none'}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        <div className="absolute bottom-3 left-3 bg-ms-navy/90 text-white text-xs px-2 py-1 rounded">
          {listing.propertyType}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-4">
        <p className="text-2xl font-bold text-ms-navy">${listing.price.toLocaleString()}</p>
        <p className="text-sm text-gray-600 mt-1">{listing.address}</p>
        <p className="text-sm text-gray-500">{listing.city}, {listing.state} {listing.zip}</p>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Beds', value: listing.beds },
            { label: 'Baths', value: listing.baths },
            { label: 'Sq Ft', value: listing.sqft.toLocaleString() },
            { label: 'Year', value: listing.yearBuilt },
          ].map((stat) => (
            <div key={stat.label} className="bg-ms-gray rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-ms-navy">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="font-bold text-ms-navy">About This Home</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{listing.description}</p>
        </div>

        {/* Features */}
        <div className="mt-4">
          <h2 className="font-bold text-ms-navy">Features</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {listing.features.map((feature) => (
              <span
                key={feature}
                className="text-xs bg-ms-gray text-ms-navy px-3 py-1.5 rounded-full capitalize"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4">
          <h2 className="font-bold text-ms-navy">Details</h2>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div className="flex justify-between bg-ms-gray rounded-lg px-3 py-2">
              <span className="text-gray-500">Lot Size</span>
              <span className="font-medium text-ms-navy">{listing.lotSize}</span>
            </div>
            <div className="flex justify-between bg-ms-gray rounded-lg px-3 py-2">
              <span className="text-gray-500">Listed</span>
              <span className="font-medium text-ms-navy">{new Date(listing.listingDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Mortgage Estimate */}
        <div className="mt-6">
          <h2 className="font-bold text-ms-navy mb-3">Mortgage Estimate</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <MortgageCalc defaultPrice={listing.price} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => toggleFavorite(listing.id)}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${
              isFavorite(listing.id)
                ? 'bg-ms-red/10 text-ms-red border border-ms-red/30'
                : 'bg-ms-gray text-ms-navy hover:bg-gray-200'
            }`}
          >
            {isFavorite(listing.id) ? 'Saved' : 'Save Home'}
          </button>
          <button className="flex-1 bg-ms-red hover:bg-ms-red-dark text-white py-3 rounded-xl font-semibold text-sm transition-colors">
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  )
}
