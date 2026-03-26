import { Link } from 'react-router-dom'
import { Listing } from '../types/listing'

interface Props {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  compact?: boolean
}

export default function ListingCard({ listing, isFavorite, onToggleFavorite, compact }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/listing/${listing.id}`} className="block">
        <div className={`relative ${compact ? 'h-36' : 'h-48'} bg-gray-200 overflow-hidden`}>
          <img
            src={listing.imageUrl}
            alt={listing.address}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite(listing.id)
              }}
              className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
            >
              <svg
                className={`w-5 h-5 ${isFavorite ? 'text-ms-red fill-ms-red' : 'text-gray-400'}`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                fill={isFavorite ? 'currentColor' : 'none'}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-ms-navy/90 text-white text-xs px-2 py-1 rounded">
            {listing.propertyType}
          </div>
        </div>
      </Link>
      <div className="p-3">
        <div className="flex justify-between items-start">
          <p className="text-lg font-bold text-ms-navy">
            ${listing.price.toLocaleString()}
          </p>
        </div>
        <Link to={`/listing/${listing.id}`} className="block mt-1">
          <p className="text-sm text-gray-600 truncate">{listing.address}</p>
          <p className="text-sm text-gray-500">{listing.city}, {listing.state} {listing.zip}</p>
          <div className="flex items-center gap-3 mt-2 text-sm text-ms-navy">
            <span className="font-medium">{listing.beds} bd</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{listing.baths} ba</span>
            <span className="text-gray-300">|</span>
            <span className="font-medium">{listing.sqft.toLocaleString()} sqft</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
