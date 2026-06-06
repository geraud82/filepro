import { useState, useEffect } from 'react';
import Head from 'next/head';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import { fileApi } from '../lib/api';
import {
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
  DocumentIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const conversions = {
  pdf:  [{ value: 'docx', label: 'Word (.docx)' }],
  docx: [{ value: 'pdf',  label: 'PDF (.pdf)'  }],
  jpg:  [{ value: 'png',  label: 'PNG (.png)'  }],
  jpeg: [{ value: 'png',  label: 'PNG (.png)'  }],
  png:  [{ value: 'jpg',  label: 'JPG (.jpg)'  }],
  mp4:  [{ value: 'mp3',  label: 'MP3 (.mp3)'  }],
};

function getExt(filename) {
  return filename.split('.').pop().trim().toLowerCase();
}

function formatBytes(bytes) {
  return (bytes / 1048576).toFixed(2) + ' MB';
}

export default function Convert() {
  const [file, setFile]                     = useState(null);
  const [outputFormat, setOutputFormat]     = useState('');
  const [jobId, setJobId]                   = useState(null);
  const [downloadFileName, setDownloadFileName] = useState(null);
  const [error, setError]                   = useState('');
  const [isProcessing, setIsProcessing]     = useState(false);
  const [progress, setProgress]             = useState(0);
  const [status, setStatus]                 = useState(null);

  const handleFileSelect = (selected) => {
    setFile(selected);
    setError('');
    setJobId(null);
    setDownloadFileName(null);
    setProgress(0);
    setStatus(null);

    const ext = getExt(selected.name);
    if (conversions[ext]) {
      setOutputFormat(conversions[ext][0].value);
    } else {
      setError('Unsupported file format. Supported: PDF, DOCX, JPG, PNG, MP4.');
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setJobId(null);
    setDownloadFileName(null);
    setProgress(0);
    setStatus(null);
  };

  const handleConvert = async () => {
    if (!file || !outputFormat) {
      setError('Please select a file and output format.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      setProgress(0);

      const result = await fileApi.createConvertJob(file, getExt(file.name), outputFormat);
      setJobId(result.jobId);
      setStatus(result.status);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Conversion failed. Please try again.');
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
          const filename =
            result.downloadUrl?.split('/').pop() ||
            result.result?.outputFileName ||
            null;
          setDownloadFileName(filename);
          setIsProcessing(false);
          clearInterval(poll);
        } else if (result.status === 'failed') {
          setError(result.error || 'Conversion failed. Please try again.');
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

  const fileExt = file ? getExt(file.name) : null;
  const availableFormats = fileExt ? (conversions[fileExt] ?? []) : [];

  return (
    <>
      <Head>
        <title>Free Online File Converter – PDF, Word, JPG, MP4 | FilePro</title>
        <meta name="description" content="Convert PDF to Word, Word to PDF, JPG to PNG, PNG to JPG, and MP4 to MP3 online free. No signup, no email required. Instant conversion in seconds." />
        <meta name="keywords" content="online file converter free, convert pdf to word online free, word to pdf converter, jpg to png converter, mp4 to mp3 converter, free file conversion no registration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://filepro.neobize.com/convert" />
        <meta property="og:title" content="Free Online File Converter – PDF, Word, JPG, MP4 | FilePro" />
        <meta property="og:description" content="Convert PDF to Word, Word to PDF, JPG to PNG, MP4 to MP3 online free. No signup, instant results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filepro.neobize.com/convert" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online File Converter – No Signup | FilePro" />
        <meta name="twitter:description" content="Convert PDF to Word, JPG to PNG, MP4 to MP3 online for free. No registration required." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: 'How to Convert Files Online Free',
              description: 'Convert PDF to Word, Word to PDF, JPG to PNG, or MP4 to MP3 online without any software. Free, no signup required.',
              step: [
                { '@type': 'HowToStep', position: 1, name: 'Upload your file', text: 'Click or drag and drop your file. Supported formats: PDF, DOCX, JPG, PNG, MP4.' },
                { '@type': 'HowToStep', position: 2, name: 'Choose output format', text: 'Select the output format from the dropdown. Options appear based on your file type.' },
                { '@type': 'HowToStep', position: 3, name: 'Convert and download', text: 'Click Start Conversion. Your converted file is ready to download in seconds.' },
              ],
              tool: [{ '@type': 'HowToTool', name: 'FilePro online file converter' }],
            }),
          }}
        />
      </Head>

      <div className="min-h-screen bg-primary-50/30 py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
              <ArrowsRightLeftIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-primary-900">File Converter</h1>
            <p className="mt-2 text-slate-500">
              PDF, DOCX, JPG, PNG, MP4 — convert in seconds, no signup needed.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* Step 1: Upload */}
            {!file ? (
              <FileUploader onFileSelect={handleFileSelect} />
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

                {/* Format selector */}
                {availableFormats.length > 0 && (
                  <div>
                    <label
                      htmlFor="output-format"
                      className="mb-1.5 block text-sm font-medium text-gray-700"
                    >
                      Convert to
                    </label>
                    <select
                      id="output-format"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      disabled={isProcessing}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors duration-150 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                    >
                      {availableFormats.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Progress */}
                {isProcessing && jobId && (
                  <ProgressBar progress={progress} status={status} />
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <span className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500">⚠</span>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Action button */}
                {downloadFileName ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 py-3 text-sm text-primary-700">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      Conversion complete!
                    </div>
                    <a
                      href={fileApi.getDownloadUrl(downloadFileName)}
                      download
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                      Download Converted File
                    </a>
                    <button
                      onClick={handleRemoveFile}
                      className="w-full cursor-pointer rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 transition-colors duration-150 hover:border-gray-300 hover:bg-gray-50"
                    >
                      Convert another file
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleConvert}
                    disabled={isProcessing || !outputFormat}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="h-5 w-5 animate-spin"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Converting…
                      </>
                    ) : (
                      <>
                        <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden="true" />
                        Start Conversion
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
