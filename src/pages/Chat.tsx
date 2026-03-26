import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ChatMessage as ChatMessageType } from '../types/listing'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import { processMessage } from '../utils/search'

const WELCOME_MESSAGE: ChatMessageType = {
  id: 'welcome',
  role: 'assistant',
  text: "Welcome to Mark Spain AI Home Finder! I can help you discover your perfect home in the Atlanta metro area.\n\nTell me what you're looking for:\n- Budget or monthly payment\n- Bedrooms & bathrooms\n- City or neighborhood\n- Must-have features\n\nFor example: \"3 bed house under $400k in Roswell with a garage\"",
  timestamp: new Date(),
}

export default function Chat() {
  const location = useLocation()
  const initialQuery = (location.state as { initialQuery?: string })?.initialQuery
  const [messages, setMessages] = useState<ChatMessageType[]>([WELCOME_MESSAGE])
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasProcessedInitial = useRef(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (initialQuery && !hasProcessedInitial.current) {
      hasProcessedInitial.current = true
      // Small delay so user sees the welcome message first
      setTimeout(() => handleSend(initialQuery), 500)
    }
  }, [initialQuery])

  const handleSend = (text: string) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    // Simulate typing delay
    setTimeout(() => {
      const response = processMessage(text)
      const assistantMsg: ChatMessageType = {
        ...response,
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    }, 400)
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-ms-navy text-white px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-ms-red rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-sm">AI Home Finder</p>
          <p className="text-xs text-gray-300">Mark Spain Real Estate</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-2 bg-ms-gray">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestion chips */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 bg-ms-gray flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            'Homes under $400k',
            '3 bed 2 bath',
            'Pool in Alpharetta',
            '$2000/month',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSend(suggestion)}
              className="flex-shrink-0 text-xs bg-white text-ms-navy px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input - positioned above bottom nav */}
      <div className="mb-16">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
