// meridian-web/src/components/upload/UploadZone.tsx
// Click or drag to upload - no separate upload button

import { useCallback, useRef, useState } from 'react'
import { usePaperUpload } from '../../hooks/usePaperUpload'

export const UploadZone = () => {
  const { upload, uploading, progress, error, success, reset } =
    usePaperUpload()

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed'
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File is too large. Maximum size is 20MB'
    }
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    setSelectedFile(file)
    upload(file)

    e.target.value = ''
  }

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      alert(validationError)
      return
    }

    setSelectedFile(file)
    upload(file)
  }, [upload])

  const openFilePicker = () => {
    inputRef.current?.click()
  }

  const handleReset = () => {
    setSelectedFile(null)
    reset()
  }

  const FileInput = (
    <input
      ref={inputRef}
      type="file"
      accept=".pdf,application/pdf"
      className="hidden"
      onChange={handleFileChange}
    />
  )

  // ── Success ──
  if (success) {
    return (
      <div className="rounded-2xl border-2 border-green-200 
                      bg-green-50 p-10 text-center">
        {FileInput}
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-lg font-semibold text-green-800">
          Uploaded Successfully!
        </h3>
        <p className="text-green-600 text-sm mt-1">
          Your paper is being processed in the background.
        </p>
        <button
          onClick={handleReset}
          className="mt-5 text-sm text-green-700 
                     underline hover:no-underline"
        >
          Upload another paper
        </button>
      </div>
    )
  }

  // ── Uploading ──
  if (uploading) {
    return (
      <div className="rounded-2xl border-2 border-blue-200 
                      bg-blue-50 p-10 text-center">
        {FileInput}
        <div className="text-5xl mb-4">📤</div>
        <h3 className="text-lg font-semibold text-blue-800">
          Uploading...
        </h3>
        <p className="text-blue-500 text-sm mt-1">
          {selectedFile?.name}
        </p>

        <div className="mt-5 w-full max-w-sm mx-auto">
          <div className="flex justify-between text-xs 
                          text-blue-500 mb-1">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-blue-600 rounded-full 
                         transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Error (upload failed, file still selected) ──
  if (selectedFile && error) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 
                      bg-white p-10 text-center">
        {FileInput}

        <div className="text-5xl mb-3">📄</div>

        <h3 className="text-lg font-semibold text-gray-800">
          Upload failed
        </h3>

        <div className="mt-3 inline-flex items-center gap-2 
                        bg-gray-100 rounded-xl px-4 py-2">
          <span className="text-sm text-gray-700 font-medium">
            {selectedFile.name}
          </span>
          <span className="text-xs text-gray-400">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>

        <div className="mt-4 bg-red-50 border border-red-200 
                        rounded-xl px-4 py-3">
          <p className="text-red-600 text-sm">
            Upload failed. Please try again.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="px-5 py-2.5 border border-gray-300 
                       rounded-xl text-sm text-gray-600 
                       hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => upload(selectedFile)}
            className="px-6 py-2.5 bg-blue-600 text-white 
                       rounded-xl text-sm font-medium 
                       hover:bg-blue-700 transition-colors"
          >
            Retry Upload
          </button>
        </div>
      </div>
    )
  }

  // ── Default: Drop zone (click or drag) ──
  return (
    <div
      onClick={openFilePicker}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        rounded-2xl border-2 border-dashed p-16
        text-center transition-all duration-200 cursor-pointer
        ${isDragging
          ? 'border-blue-400 bg-blue-50 scale-[1.01]'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      {FileInput}

      <div className="text-5xl mb-4 select-none">
        {isDragging ? '📂' : '📄'}
      </div>

      <h3 className="text-lg font-medium text-gray-700">
        {isDragging
          ? 'Drop your PDF here'
          : 'Upload a research paper'
        }
      </h3>

      <p className="text-gray-400 text-sm mt-2">
        Click or drag and drop your PDF here
      </p>

      <div className="my-5 flex items-center gap-3 
                      max-w-xs mx-auto">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div
        className="inline-flex items-center gap-2 
                   bg-blue-600 hover:bg-blue-700 
                   text-white px-6 py-2.5 rounded-xl 
                   text-sm font-medium transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        Browse Files
      </div>

      <p className="text-gray-300 text-xs mt-4">
        PDF only · Max 20MB
      </p>
    </div>
  )
}