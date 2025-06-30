import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FilePlus, UploadCloud, Play } from 'lucide-react'
import { getDocuments, uploadDocument, processDocuments } from '../utils/api'
import { DocumentFile } from '../types'
import toast from 'react-hot-toast'

const DocumentUploads: React.FC = () => {
  const [docs, setDocs] = useState<DocumentFile[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocs()
  }, [])

  const loadDocs = async () => {
    try {
      setLoading(true)
      const data = await getDocuments()
      setDocs(data)
    } catch (err) {
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    try {
      setUploading(true)
      await uploadDocument(file)
      toast.success('File uploaded')
      setFile(null)
      await loadDocs()
    } catch (err) {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleProcess = async () => {
    try {
      setProcessing(true)
      const result = await processDocuments()
      toast.success(`Processed ${result.processed} files, added ${result.businesses_added} businesses`)
      await loadDocs()
    } catch (err) {
      toast.error('Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FilePlus className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Uploads</h1>
              <p className="text-gray-600">Upload files for the document crawler</p>
            </div>
          </div>
        </div>
        <button onClick={handleProcess} disabled={processing} className="btn btn-primary flex items-center space-x-2">
          <Play className={`h-4 w-4 ${processing ? 'animate-spin' : ''}`} />
          <span>{processing ? 'Processing...' : 'Process Files'}</span>
        </button>
      </div>

      <form onSubmit={handleUpload} className="flex items-center space-x-4">
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="input" />
        <button type="submit" disabled={!file || uploading} className="btn btn-secondary flex items-center space-x-2">
          <UploadCloud className="h-4 w-4" />
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </form>

      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          docs.map(doc => (
            <div key={doc.id} className="card p-4 flex items-center justify-between">
              <span>{doc.filename}</span>
              <span className="text-sm text-gray-600">{doc.processed ? 'Processed' : 'Pending'}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DocumentUploads
