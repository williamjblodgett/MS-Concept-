import { useState, useMemo } from 'react'
import { listings, GA_CITIES } from '../data/listings'
import ListingCard from '../components/ListingCard'
import { useFavorites } from '../hooks/useFavorites'

export default function Listings() {
  const [maxPrice, setMaxPrice] = useState(900000)
  const [minBeds, setMinBeds] = useState(0)
  const [minBaths, setMinBaths] = useState(0)
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest'>('newest')
  const { isFavorite, toggleFavorite } = useFavorites()

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (l.price > maxPrice) return false
      if (minBeds > 0 && l.beds < minBeds) return false
      if (minBaths > 0 && l.baths < minBaths) return false
      if (city && l.city !== city) return false
      return true
    })

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result = [...result].sort((a, b) => b.listingDate.localeCompare(a.listingDate))
        break
    }

    return result
  }, [maxPrice, minBeds, minBaths, city, sortBy])

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-ms-navy text-white px-4 py-3">
        <h1 className="font-bold text-lg">Browse Listings</h1>
        <p className="text-xs text-gray-300">{filtered.length} homes in Georgia</p>
      </div>

      {/* Filters */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Max Price</span>
            <span className="font-semibold text-ms-navy">${maxPrice.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={200000}
            max={900000}
            step={25000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-ms-red"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={minBeds}
            onChange={(e) => setMinBeds(Number(e.target.value))}
            className="flex-1 text-sm bg-ms-gray rounded-lg px-3 py-2 text-ms-navy focus:outline-none focus:ring-2 focus:ring-ms-red/30"
          >
            <option value={0}>Any Beds</option>
            <option value={2}>2+ Beds</option>
            <option value={3}>3+ Beds</option>
            <option value={4}>4+ Beds</option>
            <option value={5}>5+ Beds</option>
          </select>

          <select
            value={minBaths}
            onChange={(e) => setMinBaths(Number(e.target.value))}
            className="flex-1 text-sm bg-ms-gray rounded-lg px-3 py-2 text-ms-navy focus:outline-none focus:ring-2 focus:ring-ms-red/30"
          >
            <option value={0}>Any Baths</option>
            <option value={2}>2+ Baths</option>
            <option value={3}>3+ Baths</option>
            <option value={4}>4+ Baths</option>
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 text-sm bg-ms-gray rounded-lg px-3 py-2 text-ms-navy focus:outline-none focus:ring-2 focus:ring-ms-red/30"
          >
            <option value="">All Cities</option>
            {GA_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-1">
          {([
            ['newest', 'Newest'],
            ['price-asc', 'Price: Low'],
            ['price-desc', 'Price: High'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                sortBy === value ? 'bg-ms-red text-white' : 'bg-ms-gray text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            isFavorite={isFavorite(listing.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 px-4">
          <p className="text-gray-500 text-sm">No homes match your filters.</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  )
}
