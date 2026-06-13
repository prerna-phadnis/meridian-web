import { useEffect, useRef, useState } from 'react'
import { useChat } from '../../hooks/useChat'

type Source = {
  page_number: number
  text: string
  score: number
}

export const ChatWindow = ({ paperId }: { paperId: string }) => {
  const { messages, sendMessage, sending, historyLoading } = useChat(paperId)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const q = input.trim()
    if (!q || sending) return
    setInput('')
    sendMessage(q)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (historyLoading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading chat...
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border">
      {/* Header */}
      <div className="px-5 py-4 border-b">
        <h3 className="font-semibold text-gray-800">
          Chat with Paper
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          Ask anything about this paper
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-10">
            <div className="text-4xl mb-3">💬</div>

            <p className="text-gray-500 font-medium">
              Ask a question
            </p>

            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              Try: "What is the main contribution of this paper?"
            </p>

            {/* Suggested questions */}
            <div className="mt-6 space-y-2 w-full max-w-sm">
              {[
                'What problem does this paper solve?',
                'What methodology was used?',
                'What are the key findings?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="
                    w-full text-left text-sm px-4 py-2.5
                    border border-gray-200 rounded-xl
                    text-gray-600 hover:border-blue-300
                    hover:bg-blue-50 transition-colors
                  "
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <div key={msg.id}>

            {/* User message */}
            {msg.role === 'user' && (
              <div className="flex justify-end">
                <div
                  className="
                    bg-blue-600 text-white rounded-2xl
                    rounded-tr-sm px-4 py-3 max-w-[80%]
                  "
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            )}

            {/* Assistant message */}
            {msg.role === 'assistant' && (
              <div className="flex justify-start">
                <div className="max-w-[90%] space-y-2">

                  {/* Answer bubble */}
                  <div
                    className="
                      bg-gray-100 rounded-2xl rounded-tl-sm
                      px-4 py-3
                    "
                  >
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <SourcesList sources={msg.sources} />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2 items-end">

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this paper..."
            rows={1}
            className="
              flex-1 border border-gray-200 rounded-xl px-4 py-3
              text-sm resize-none focus:outline-none
              focus:ring-2 focus:ring-blue-500
              max-h-32 overflow-y-auto
            "
            style={{
              height: 'auto',
              minHeight: '44px',
            }}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="
              bg-blue-600 text-white p-3 rounded-xl
              hover:bg-blue-700 disabled:opacity-50
              disabled:cursor-not-allowed transition-colors
              shrink-0
            "
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

// Sources component
const SourcesList = ({ sources }: { sources: Source[] }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="
          flex items-center gap-1 text-gray-400
          hover:text-gray-600 transition-colors
        "
      >
        <span>📄</span>
        <span>
          {sources.length} source{sources.length > 1 ? 's' : ''} found
        </span>
        <span>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="mt-2 space-y-2">
          {sources.map((source, i) => (
            <div
              key={i}
              className="
                bg-gray-50 border border-gray-200
                rounded-xl px-3 py-2
              "
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-600">
                  Page {source.page_number}
                </span>

                <span className="text-gray-400">
                  {Math.round(source.score * 100)}% match
                </span>
              </div>

              <p className="text-gray-500 leading-relaxed">
                {source.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}