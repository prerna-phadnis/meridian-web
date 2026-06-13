import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { papersApi } from '../lib/api'
import { ChatWindow } from '../components/chat/ChatWindow'

export const PaperView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['paper', id],
    queryFn: () => papersApi.getOne(id!),
    enabled: !!id,
  })

  const paper = data?.data?.paper

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!paper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Paper not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← Back
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">
              {paper.title || 'Untitled Paper'}
            </h1>

            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs text-gray-400">
                {paper.page_count} pages
              </span>

              <span className="text-xs text-gray-400">
                {paper.chunk_count} chunks indexed
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  paper.status === 'ready'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {paper.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Paper info */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-gray-800 mb-1">
              {paper.title || 'Untitled Paper'}
            </h2>

            {paper.authors?.length > 0 && (
              <p className="text-sm text-gray-500">
                {paper.authors.join(', ')}
              </p>
            )}
          </div>

          {/* Extracted text preview */}
          {paper.extracted_text && (
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-medium text-gray-700 mb-3">
                Paper Content Preview
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed max-h-96 overflow-y-auto">
                {paper.extracted_text.slice(0, 1000)}...
              </p>
            </div>
          )}

          {/* Not ready yet */}
          {paper.status !== 'ready' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">⚙️</div>

              <p className="text-yellow-800 font-medium">
                Paper is still processing
              </p>

              <p className="text-yellow-600 text-sm mt-1">
                Please wait a moment then refresh
              </p>
            </div>
          )}
        </div>

        {/* Right: Chat */}
        <div className="h-[calc(100vh-140px)] sticky top-6">
          {paper.status === 'ready' ? (
            <ChatWindow paperId={paper.id} />
          ) : (
            <div className="h-full bg-white rounded-2xl border flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-3">⏳</div>
                <p>Chat available once processing is complete</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}