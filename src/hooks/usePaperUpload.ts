// meridian-web/src/hooks/usePaperUpload.ts
// Make sure this matches exactly

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import axios from 'axios'

export const usePaperUpload = () => {
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Not authenticated')
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/papers/upload`,
        formData,
        {
          headers: {
            // Let browser set Content-Type with boundary
            // Don't manually set multipart/form-data
            'Authorization': `Bearer ${session.access_token}`,
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round(
                (event.loaded * 100) / event.total
              )
              setProgress(percent)
            }
          }
        }
      )

      return response.data
    },

    onSuccess: () => {
      // Refresh papers list
      queryClient.invalidateQueries({ queryKey: ['papers'] })
      setProgress(0)
    },

    onError: (err) => {
      console.error('Upload error:', err)
      setProgress(0)
    }
  })

  return {
    upload: mutation.mutate,
    uploading: mutation.isPending,
    progress,
    error: mutation.error,
    success: mutation.isSuccess,
    reset: mutation.reset,
  }
}