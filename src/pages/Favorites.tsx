import { Link } from 'react-router-dom'
import { listings } from '../data/listings'
import ListingCard from '../components/ListingCard'
import { useFavorites } from '../hooks/useFavorites'

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  const savedListings = listings.filter((l) => favorites.has(l.id))

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-ms-navy text-white px-4 py-3">
        <h1 className="font-bold text-lg">Saved Homes</h1>
        <p className="text-xs text-gray-300">{savedListings.length} saved</p>
      </div>

      {savedListings.length > 0 ? (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorite={isFavorite(listing.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-ms-gray rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No saved homes yet</p>
          <p className="text-gray-400 text-sm mt-1">Tap the heart icon on any listing to save it here</p>
          <Link
            to="/listings"
            className="inline-block mt-6 bg-ms-red text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-ms-red-dark transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      )}
    </div>
  )
}
