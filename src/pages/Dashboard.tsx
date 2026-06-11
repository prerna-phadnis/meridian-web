// meridian-web/src/pages/Dashboard.tsx
// Update to fetch and show papers

import { useAuth } from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { papersApi } from '../lib/api'

export const Dashboard = () => {
  const { user, signOut } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['papers'],
    queryFn: () => papersApi.getAll(),
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
              <img
                src={user.avatar_url}
                className="w-8 h-8 rounded-full"
                alt=""
              />
            )}

            <span className="text-sm text-gray-600">{user?.full_name}</span>

            <button
              onClick={signOut}
              className="text-sm border rounded-lg px-3 py-1.5 text-gray-500 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.full_name?.split(' ')[0]} 👋
            </h2>

            <p className="text-gray-500 mt-1">
              {papers.length} paper{papers.length !== 1 ? 's' : ''} in your library
            </p>
          </div>

          {/* Upload button - wires up in Phase 4 */}
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            + Upload Paper
          </button>
        </div>

        {/* Papers list or empty state */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            Loading papers...
          </div>
        ) : papers.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-20 text-center">
            <div className="text-5xl mb-4">📄</div>

            <h3 className="text-lg font-medium text-gray-700">
              No papers yet
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              Upload your first research paper to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {papers.map((paper: any) => (
              <div
                key={paper.id}
                className="bg-white border rounded-xl p-5 hover:border-blue-200 transition-colors"
              >
                <h3 className="font-medium text-gray-900">
                  {paper.title || 'Untitled Paper'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Status: {paper.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}