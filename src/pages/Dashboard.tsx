import { useAuth } from '../hooks/useAuth'

export const Dashboard = () => {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔬</span>
            <span className="font-bold text-gray-900 text-lg">Meridian</span>
          </div>

          {/* User info + signout */}
          <div className="flex items-center gap-4">
            {user?.avatar_url && (
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.full_name || user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-gray-500 hover:text-gray-800 
                         border rounded-lg px-3 py-1.5 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.full_name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Upload a research paper to get started.
          </p>
        </div>

        {/* Empty state placeholder */}
        <div className="border-2 border-dashed border-gray-200 
                        rounded-2xl p-20 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-700">
            No papers yet
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            PDF upload coming in the next step
          </p>
        </div>
      </main>
    </div>
  )
}