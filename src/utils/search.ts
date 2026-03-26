import { Listing, SearchCriteria, ChatMessage } from '../types/listing'
import { listings, GA_CITIES } from '../data/listings'
import { priceFromMonthlyPayment } from './mortgage'

function extractCriteria(message: string): SearchCriteria {
  const lower = message.toLowerCase()
  const criteria: SearchCriteria = {}

  // Monthly payment: "$2000/month", "$2,000 a month", "$1500 per month", "2000 monthly"
  const monthlyMatch = lower.match(/\$?([\d,]+)\s*(?:\/|\s*(?:a|per)\s*)month|(\d[\d,]*)\s*monthly/)
  if (monthlyMatch) {
    const val = parseInt((monthlyMatch[1] || monthlyMatch[2]).replace(/,/g, ''))
    criteria.monthlyPayment = val
    criteria.maxPrice = priceFromMonthlyPayment(val)
  }

  // Price: "under $400k", "$300,000 to $500,000", "below 400000", "less than $500k"
  const underMatch = lower.match(/(?:under|below|less than|up to|max|budget)\s*\$?([\d,]+)\s*k?/i)
  if (underMatch) {
    let val = parseInt(underMatch[1].replace(/,/g, ''))
    if (val < 10000) val *= 1000
    criteria.maxPrice = val
  }

  const overMatch = lower.match(/(?:over|above|more than|at least|min(?:imum)?)\s*\$?([\d,]+)\s*k?/i)
  if (overMatch) {
    let val = parseInt(overMatch[1].replace(/,/g, ''))
    if (val < 10000) val *= 1000
    criteria.minPrice = val
  }

  const rangeMatch = lower.match(/\$?([\d,]+)\s*k?\s*(?:to|-)\s*\$?([\d,]+)\s*k?/)
  if (rangeMatch && !monthlyMatch) {
    let min = parseInt(rangeMatch[1].replace(/,/g, ''))
    let max = parseInt(rangeMatch[2].replace(/,/g, ''))
    if (min < 10000) min *= 1000
    if (max < 10000) max *= 1000
    if (min > max) [min, max] = [max, min]
    criteria.minPrice = min
    criteria.maxPrice = max
  }

  // Bedrooms: "3 bed", "3br", "3 bedroom", "3-bed"
  const bedMatch = lower.match(/(\d)\s*[-]?\s*(?:bed(?:room)?s?|br)\b/)
  if (bedMatch) {
    criteria.minBeds = parseInt(bedMatch[1])
  }

  // Bathrooms: "2 bath", "2ba", "2 bathroom"
  const bathMatch = lower.match(/([\d.]+)\s*[-]?\s*(?:bath(?:room)?s?|ba)\b/)
  if (bathMatch) {
    criteria.minBaths = parseFloat(bathMatch[1])
  }

  // Sqft: "2000 sqft", "2000 sq ft", "2,000 square feet"
  const sqftMatch = lower.match(/([\d,]+)\s*(?:sq\s*(?:ft|feet)|square\s*feet|sqft)/)
  if (sqftMatch) {
    criteria.minSqft = parseInt(sqftMatch[1].replace(/,/g, ''))
  }

  // City detection
  for (const city of GA_CITIES) {
    if (lower.includes(city.toLowerCase())) {
      criteria.city = city
      break
    }
  }

  // Feature keywords
  const featureKeywords = [
    'pool', 'garage', 'fireplace', 'hardwood', 'renovated', 'new construction',
    'open concept', 'smart home', 'walkable', 'condo', 'townhome', 'ranch',
    'basement', 'porch', 'deck', 'office',
  ]
  const foundFeatures = featureKeywords.filter((f) => lower.includes(f))
  if (foundFeatures.length > 0) {
    criteria.features = foundFeatures
  }

  return criteria
}

function filterListings(criteria: SearchCriteria): Listing[] {
  return listings.filter((listing) => {
    if (criteria.maxPrice && listing.price > criteria.maxPrice) return false
    if (criteria.minPrice && listing.price < criteria.minPrice) return false
    if (criteria.minBeds && listing.beds < criteria.minBeds) return false
    if (criteria.minBaths && listing.baths < criteria.minBaths) return false
    if (criteria.minSqft && listing.sqft < criteria.minSqft) return false
    if (criteria.maxSqft && listing.sqft > criteria.maxSqft) return false
    if (criteria.city && listing.city.toLowerCase() !== criteria.city.toLowerCase()) return false
    if (criteria.features) {
      const listingFeatures = listing.features.join(' ').toLowerCase() + ' ' + listing.description.toLowerCase()
      const hasAll = criteria.features.every((f) => listingFeatures.includes(f))
      if (!hasAll) return false
    }
    return true
  })
}

function formatPrice(price: number): string {
  return '$' + price.toLocaleString()
}

function buildResponse(criteria: SearchCriteria, results: Listing[]): string {
  const parts: string[] = []

  if (results.length === 0) {
    parts.push("I couldn't find any homes matching those criteria. Try adjusting your budget, location, or features.")
    parts.push('\nHere are some things you can ask me:')
    parts.push('- "Show me 3 bed homes under $400k"')
    parts.push('- "Homes in Roswell with a pool"')
    parts.push('- "What can I get for $2000/month?"')
    return parts.join('\n')
  }

  let intro = `I found ${results.length} home${results.length > 1 ? 's' : ''}`
  const details: string[] = []
  if (criteria.city) details.push(`in ${criteria.city}`)
  if (criteria.maxPrice && criteria.monthlyPayment) {
    details.push(`within a ~${formatPrice(criteria.monthlyPayment)}/mo budget (up to ${formatPrice(criteria.maxPrice)})`)
  } else if (criteria.maxPrice) {
    details.push(`under ${formatPrice(criteria.maxPrice)}`)
  }
  if (criteria.minBeds) details.push(`with ${criteria.minBeds}+ bedrooms`)
  if (criteria.features?.length) details.push(`featuring ${criteria.features.join(', ')}`)

  if (details.length > 0) {
    intro += ' ' + details.join(' ')
  }
  intro += '.'

  if (results.length > 5) {
    intro += ` Showing the top ${Math.min(results.length, 8)} matches.`
  }

  return intro
}

const GREETINGS = ['hi', 'hello', 'hey', 'howdy', 'good morning', 'good afternoon', 'good evening']

export function processMessage(userMessage: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  const lower = userMessage.trim().toLowerCase()

  // Handle greetings
  if (GREETINGS.some((g) => lower === g || lower === g + '!')) {
    return {
      role: 'assistant',
      text: "Hello! I'm your AI Home Finder assistant for Mark Spain Real Estate. I can help you find your perfect home in the Atlanta metro area.\n\nTry asking me something like:\n- \"Show me 4 bedroom homes under $500k\"\n- \"What can I get for $2,000 a month?\"\n- \"Homes in Alpharetta with a pool\"\n- \"3 bed 2 bath in Roswell\"",
    }
  }

  // Handle help
  if (lower === 'help' || lower.includes('what can you do') || lower.includes('how do')) {
    return {
      role: 'assistant',
      text: "I can help you search for homes based on:\n\n- **Budget**: \"under $400k\" or \"$2,000/month\"\n- **Size**: \"3 bed 2 bath\" or \"2000 sqft\"\n- **Location**: Any city like Roswell, Alpharetta, Atlanta, etc.\n- **Features**: pool, garage, new construction, hardwood floors, etc.\n\nYou can combine these: \"4 bed home under $600k in Sandy Springs with a pool\"",
    }
  }

  const criteria = extractCriteria(userMessage)

  // If no criteria extracted
  if (Object.keys(criteria).length === 0) {
    return {
      role: 'assistant',
      text: "I'm not sure what you're looking for. Could you tell me more about your ideal home?\n\nFor example:\n- Your budget (price or monthly payment)\n- Number of bedrooms/bathrooms\n- Preferred city or area\n- Must-have features (pool, garage, etc.)",
    }
  }

  const results = filterListings(criteria)
  const text = buildResponse(criteria, results)

  return {
    role: 'assistant',
    text,
    listings: results.slice(0, 8),
  }
}

export { filterListings, extractCriteria }
export type { SearchCriteria as FilterCriteria }
