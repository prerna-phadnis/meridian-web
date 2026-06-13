import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

import api from '../lib/api'

type Source = {
  page_number: number
  text: string
  score: number
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

export const useChat = (paperId: string) => {
  const queryClient = useQueryClient()

  const [messages, setMessages] = useState<Message[]>([])

  // Load chat history
  const { isLoading: historyLoading } = useQuery({
    queryKey: ['chat-history', paperId],

    queryFn: async () => {
      const res = await api.get(
        `/api/chat/${paperId}/history`
      )

      const history = res.data.messages || []

      setMessages(
        history.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || []
        }))
      )

      return history
    },

    enabled: !!paperId
  })

  // Send message
  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const res = await api.post('/api/chat', {
        question,
        paper_id: paperId
      })

      return res.data
    },

    onMutate: (question) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: question
      }

      setMessages(prev => [
        ...prev,
        userMessage
      ])
    },

    onSuccess: (data) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + '_ai',
        role: 'assistant',
        content: data.answer,
        sources: data.sources
      }

      setMessages(prev => [
        ...prev,
        assistantMessage
      ])

      queryClient.invalidateQueries({
        queryKey: ['chat-history', paperId]
      })
    },

    onError: () => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '_err',
          role: 'assistant',
          content:
            'Sorry, something went wrong. Please try again.'
        }
      ])
    }
  })

  return {
    messages,
    sendMessage: mutation.mutate,
    sending: mutation.isPending,
    historyLoading
  }
}