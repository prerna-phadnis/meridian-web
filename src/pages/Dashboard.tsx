// src/pages/Dashboard.tsx
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { papersApi } from '../lib/api'
import { UploadZone } from '../components/upload/UploadZone'
import { PaperCard } from '../components/papers/PaperCard'

export const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [showUpload, setShowUpload] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['papers'],
    queryFn: () => papersApi.getAll(),
    refetchInterval: 5000,
  })

  const papers = data?.data?.papers || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            <span className="font-bold text-gray-900 text-lg">Meridian</span>
          </div>
          <div className="flex items-center gap-4">
            {user?.avatar_url && (
              <img src={user.avatar_url} className="w-8 h-8 rounded-full" alt="avatar" />
            )}
            <span className="text-sm text-gray-600 hidden sm:block">{user?.full_name}</span>
            <button
              onClick={signOut}
              className="text-sm border rounded-lg px-3 py-1.5 text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Library</h2>
            <p className="text-gray-500 text-sm mt-1">
              {papers.length} paper{papers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowUpload(v => !v)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>Upload Paper</span>
          </button>
        </div>

        {showUpload && (
          <div className="mb-8">
            <UploadZone />
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            Loading papers...
          </div>
        ) : papers.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-700">Your library is empty</h3>
            <p className="text-gray-400 text-sm mt-2">Upload your first research paper to get started</p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Upload a Paper
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {papers.map((paper: any) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}