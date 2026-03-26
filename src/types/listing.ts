export interface Listing {
  id: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  lotSize: string
  description: string
  features: string[]
  imageUrl: string
  listingDate: string
  propertyType: string
}

export interface SearchCriteria {
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  maxBeds?: number
  minBaths?: number
  minSqft?: number
  maxSqft?: number
  city?: string
  features?: string[]
  monthlyPayment?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  listings?: Listing[]
  timestamp: Date
}
