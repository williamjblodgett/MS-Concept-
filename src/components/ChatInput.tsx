import { useState, FormEvent } from 'react'

interface Props {
  onSend: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 bg-white border-t border-gray-200">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Try "3 bed under $400k in Roswell"'
        className="flex-1 px-4 py-2.5 bg-ms-gray rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ms-red/30"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="w-10 h-10 bg-ms-red text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-ms-red-dark transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </form>
  )
}
