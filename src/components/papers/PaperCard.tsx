import { useNavigate } from 'react-router-dom'

type Paper = {
  id: string
  title: string
  status: 'pending' | 'processing' | 'ready' | 'failed'
  page_count: number | null
  created_at: string
}

const statusConfig = {
  pending: {
    label: 'Waiting',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '⏳'
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700',
    icon: '⚙️'
  },
  ready: {
    label: 'Ready',
    color: 'bg-green-100 text-green-700',
    icon: '✅'
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700',
    icon: '❌'
  }
}

export const PaperCard = ({ paper }: { paper: Paper }) => {
  const navigate = useNavigate()
  const status = statusConfig[paper.status] || statusConfig.pending

  const formattedDate = new Date(paper.created_at).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  )

  return (
    <div onClick={() => navigate(`/paper/${paper.id}`)} 
    className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between gap-4">
        {/* Left: icon + title */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="text-2xl mt-0.5">📄</div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {paper.title || 'Untitled Paper'}
            </h3>

            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-gray-400">
                {formattedDate}
              </span>

              {paper.page_count && (
                <span className="text-xs text-gray-400">
                  {paper.page_count} pages
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: status badge */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${status.color}`}
        >
          <span>{status.icon}</span>
          <span>{status.label}</span>
        </div>
      </div>
    </div>
  )
}