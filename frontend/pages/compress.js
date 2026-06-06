import { useState, useEffect } from 'react';
import Head from 'next/head';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import { fileApi } from '../lib/api';
import {
  ArrowDownTrayIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  DocumentIcon,
  CheckCircleIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';

const LEVELS = [
  { value: 'low',    label: 'Low',    detail: 'Best quality'   },
  { value: 'medium', label: 'Medium', detail: 'Balanced'       },
  { value: 'high',   label: 'High',   detail: 'Smallest size'  },
];

function formatBytes(bytes) {
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export default function Compress() {
  const [file, setFile]                   = useState(null);
  const [compressionLevel, setLevel]      = useState('medium');
  const [jobId, setJobId]                 = useState(null);
  const [status, setStatus]               = useState(null);
  const [progress, setProgress]           = useState(0);
  const [downloadUrl, setDownloadUrl]     = useState(null);
  const [stats, setStats]                 = useState(null);
  const [error, setError]                 = useState('');
  const [isProcessing, setIsProcessing]   = useState(false);

  const handleFileSelect = (selected) => {
    setFile(selected);
    setError('');
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setDownloadUrl(null);
    setStats(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setDownloadUrl(null);
    setStats(null);
  };

  const handleCompress = async () => {
    if (!file || !compressionLevel) {
      setError('Please select a file and compression level.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      const result = await fileApi.createJob(file, 'compress', { compressionLevel });
      setJobId(result.jobId);
      setStatus('queued');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start compression. Please try again.');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const poll = setInterval(async () => {
      try {
        const result = await fileApi.getJobStatus(jobId);
        setStatus(result.status);
        setProgress(result.progress || 0);

        if (result.status === 'completed') {
          setDownloadUrl(result.downloadUrl);
          if (result.compressionStats) setStats(result.compressionStats);
          setIsProcessing(false);
          clearInterval(poll);
        } else if (result.status === 'failed') {
          setError(result.error || 'Compression failed. Please try again.');
          setIsProcessing(false);
          clearInterval(poll);
        }
      } catch {
        setError('Could not reach the server. Please refresh and try again.');
        setIsProcessing(false);
        clearInterval(poll);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [jobId]);

  return (
    <>
      <Head>
        <title>Compress PDF, Images & Video Online Free | FilePro</title>
        <meta name="description" content="Compress PDF, JPG, PNG and MP4 files online free. Reduce file size without losing quality. See exact savings percentage. No signup required." />
        <meta name="keywords" content="compress pdf online free, compress image online, reduce pdf file size, pdf compressor, compress video online, reduce image size free" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://filepro.neobize.com/compress" />
        <meta property="og:title" content="Compress PDF, Images & Video Online Free | FilePro" />
        <meta property="og:description" content="Compress PDF, images, and video online. Reduce file size without losing quality. Free, no signup." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filepro.neobize.com/compress" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compress PDF, Images & Video Free – FilePro" />
        <meta name="twitter:description" content="Compress PDF, JPG, PNG and MP4 online. See exact size savings. Free, no registration." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Compress Files Online Free',
              description: 'Compress PDF, images (JPG, PNG), and MP4 video online without losing quality. Free, no signup required.',
              step: [
                { '@type': 'HowToStep', position: 1, name: 'Upload your file', text: 'Upload a PDF, JPG, PNG, or MP4 file by dragging and dropping or clicking to select.' },
                { '@type': 'HowToStep', position: 2, name: 'Choose compression level', text: 'Select Low for best quality, Medium for a balance, or High for the smallest file size.' },
                { '@type': 'HowToStep', position: 3, name: 'Download compressed file', text: 'Click Start Compression. See the exact file size savings, then download your compressed file.' },
              ],
              tool: [{ '@type': 'HowToTool', name: 'FilePro online file compressor' }],
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-primary-50/30 py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
              <ArchiveBoxIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-primary-900">File Compressor</h1>
            <p className="mt-2 text-slate-500">
              PDF, Images, Video — reduce file size without sacrificing quality.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            {!file ? (
              <FileUploader
                onFileSelect={handleFileSelect}
                accept={{
                  'application/pdf': ['.pdf'],
                  'image/jpeg': ['.jpg', '.jpeg'],
                  'image/png': ['.png'],
                  'video/mp4': ['.mp4'],
                }}
              />
            ) : (
              <div className="space-y-5">

                {/* File info */}
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100">
                    <DocumentIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    disabled={isProcessing}
                    aria-label="Remove file"
                    className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors duration-150 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none"
                  >
                    <XMarkIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Compression level */}
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-700">Compression level</p>
                  <div className="grid grid-cols-3 gap-3">
                    {LEVELS.map(({ value, label, detail }) => (
                      <button
                        key={value}
                        onClick={() => setLevel(value)}
                        disabled={isProcessing}
                        className={`cursor-pointer rounded-xl border-2 p-3.5 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 ${
                          compressionLevel === value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${compressionLevel === value ? 'text-primary-700' : 'text-gray-700'}`}>
                          {label}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">{detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress */}
                {isProcessing && jobId && (
                  <ProgressBar progress={progress} status={status} />
                )}

                {/* Compression stats */}
                {stats && (
                  <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      <p className="text-sm font-semibold text-primary-800">Compression complete</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Original</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {formatBytes(stats.originalSize)}
                        </p>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <ArrowTrendingDownIcon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Compressed</p>
                        <p className="text-sm font-semibold text-gray-700">
                          {formatBytes(stats.compressedSize)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg bg-primary-100 py-2 text-center">
                      <span className="text-sm font-bold text-primary-700">{stats.savings} saved</span>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0 text-red-500">⚠</span>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Action */}
                {downloadUrl ? (
                  <div className="space-y-3">
                    <a
                      href={fileApi.getDownloadUrl(downloadUrl.split('/').pop())}
                      download
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                      Download Compressed File
                    </a>
                    <button
                      onClick={handleRemoveFile}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 transition-colors duration-150 hover:border-gray-300 hover:bg-gray-50"
                    >
                      Compress another file
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing || !compressionLevel}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Compressing…
                      </>
                    ) : (
                      <>
                        <ArchiveBoxIcon className="h-5 w-5" aria-hidden="true" />
                        Start Compression
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Files are automatically deleted after 1 hour &middot; Max 20MB on Free plan
          </p>
        </div>
      </div>
    </>
  );
}
