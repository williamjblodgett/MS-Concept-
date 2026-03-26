import { Link } from 'react-router-dom'
import { ChatMessage as ChatMessageType } from '../types/listing'

interface Props {
  message: ChatMessageType
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-ms-red flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500">AI Assistant</span>
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-ms-red text-white rounded-br-sm'
              : 'bg-white text-ms-navy shadow-sm rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>

        {message.listings && message.listings.length > 0 && (
          <div className="mt-2 flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {message.listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className="flex-shrink-0 w-56 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-28 bg-gray-200 overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={listing.address}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-2">
                  <p className="font-bold text-ms-navy text-sm">${listing.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 truncate">{listing.address}</p>
                  <p className="text-xs text-gray-400">{listing.city}, GA</p>
                  <div className="flex gap-2 mt-1 text-xs text-ms-navy">
                    <span>{listing.beds}bd</span>
                    <span>{listing.baths}ba</span>
                    <span>{listing.sqft.toLocaleString()}sf</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
