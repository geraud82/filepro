import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import FileUploader from '../components/FileUploader';
import ProgressBar from '../components/ProgressBar';
import { fileApi } from '../lib/api';
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  XMarkIcon,
  DocumentIcon,
  CheckCircleIcon,
  CheckIcon,
  ArrowRightIcon,
  ArchiveBoxIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline';

function formatBytes(bytes) {
  return (bytes / 1048576).toFixed(2) + ' MB';
}

const relatedTools = [
  {
    Icon: DocumentTextIcon,
    name: 'Word to PDF',
    href: '/word-to-pdf',
    description: 'Convert DOCX back to PDF',
  },
  {
    Icon: ArchiveBoxIcon,
    name: 'Compress PDF',
    href: '/compress-pdf',
    description: 'Reduce PDF file size',
  },
  {
    Icon: MusicalNoteIcon,
    name: 'MP4 to MP3',
    href: '/mp4-to-mp3',
    description: 'Extract audio from video',
  },
];

const whyItems = [
  'Edit text and images directly in Word',
  'Reformat layouts, fonts, and styles',
  'Extract and reuse text from PDFs',
  'Share editable versions with your team',
];

const featureItems = [
  '100% free — no hidden costs',
  'Converts in seconds',
  'Preserves formatting, images, and layout',
  'Auto-deleted after 1 hour for privacy',
  'No registration required',
  'Works on any device',
];

export default function PdfToWord() {
  const [file, setFile]               = useState(null);
  const [jobId, setJobId]             = useState(null);
  const [status, setStatus]           = useState(null);
  const [progress, setProgress]       = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError]             = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (selected) => {
    setFile(selected);
    setError('');
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setDownloadUrl(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setJobId(null);
    setStatus(null);
    setProgress(0);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setError('');

      const result = await fileApi.createJob(file, 'convert', { outputFormat: 'docx' });
      setJobId(result.jobId);
      setStatus('queued');
    } catch (err) {
      setError(err.response?.data?.error || 'Conversion failed. Please try again.');
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

  return (
    <>
      <Head>
        <title>PDF to Word Converter Online Free – No Signup, No Email | FilePro</title>
        <meta name="description" content="Convert PDF to Word (.docx) online in seconds. Free, no signup required, no email. Preserves formatting, images, and layout. Files auto-deleted for privacy." />
        <meta name="keywords" content="pdf to word converter, pdf to docx, convert pdf to word online free no signup, pdf to word free, convert pdf to editable word" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://filepro.neobize.com/pdf-to-word" />
        <meta property="og:title" content="PDF to Word Converter Online Free – No Signup | FilePro" />
        <meta property="og:description" content="Convert PDF to editable Word (DOCX) online in seconds. Free, no registration, preserves formatting." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://filepro.neobize.com/pdf-to-word" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF to Word Converter Free – No Signup | FilePro" />
        <meta name="twitter:description" content="Convert PDF to editable Word (.docx) online for free. No signup, no email. Works on any device." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'HowTo',
          name: 'How to Convert PDF to Word Online Free',
          description: 'Convert PDF documents to editable Word (DOCX) files online in seconds, no registration required.',
          step: [
            { '@type': 'HowToStep', position: 1, name: 'Upload your PDF', text: 'Click the upload area or drag and drop your PDF file (up to 20MB on free plan).' },
            { '@type': 'HowToStep', position: 2, name: 'Click Convert to Word', text: 'Click the Convert to Word button. FilePro processes your PDF using LibreOffice for accurate conversion.' },
            { '@type': 'HowToStep', position: 3, name: 'Download your DOCX', text: 'Your Word file is ready in seconds. Click Download Word Document to save the DOCX file.' },
          ],
          tool: [{ '@type': 'HowToTool', name: 'FilePro PDF to Word converter' }],
        }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'Is the PDF to Word converter really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. FilePro PDF to Word converter is 100% free with no signup or email required. Convert PDF files up to 20MB at no cost.' } },
            { '@type': 'Question', name: 'Does the converter preserve formatting?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. FilePro uses LibreOffice to preserve text, images, tables, and layout from your PDF when converting to DOCX.' } },
            { '@type': 'Question', name: 'How long are my files kept after conversion?', acceptedAnswer: { '@type': 'Answer', text: 'Files are automatically deleted from our servers after 1 hour. Download your converted Word file within that window.' } },
          ],
        }) }} />
      </Head>

      <div className="min-h-screen bg-primary-50/30 py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600">
              <DocumentTextIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold text-primary-900">PDF to Word Converter</h1>
            <p className="mt-2 text-slate-500">
              Convert PDF documents to editable Word files (DOCX) in seconds
            </p>
          </div>

          {/* Converter card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            {!file ? (
              <FileUploader
                onFileSelect={handleFileSelect}
                accept={{ 'application/pdf': ['.pdf'] }}
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

                {/* Progress */}
                {isProcessing && jobId && (
                  <ProgressBar progress={progress} status={status} />
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
                    <div className="flex items-center justify-center gap-2 rounded-xl bg-primary-50 py-3 text-sm text-primary-700">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      Conversion complete!
                    </div>
                    <a
                      href={fileApi.getDownloadUrl(downloadUrl.split('/').pop())}
                      download
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                      Download Word Document
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
                    disabled={isProcessing}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Converting to Word…
                      </>
                    ) : (
                      <>
                        <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
                        Convert to Word
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

          {/* Why convert section */}
          <div className="mt-14 rounded-2xl border border-gray-100 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-primary-900">
              How to Convert PDF to Word Online
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-gray-500">
              Converting PDF documents to editable Word files has never been easier.
              Our free converter uses{' '}
              <a href="https://www.libreoffice.org/" target="_blank" rel="noopener noreferrer"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                LibreOffice
              </a>
              {' '}— the open-source office suite trusted by millions worldwide — to transform your PDFs
              into fully editable{' '}
              <a href="https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-docx/b839fe1f-e1ca-4fa6-8c26-5954d0abbccd" target="_blank" rel="noopener noreferrer"
                className="text-primary-600 underline underline-offset-2 hover:text-primary-700">
                DOCX files
              </a>
              {' '}in seconds — no software installation, no registration.
            </p>

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Why convert PDF to Word?
            </h3>
            <ul className="mb-8 space-y-2.5">
              {whyItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Features of our PDF to Word converter
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {featureItems.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Related tools */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Other Popular Tools</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedTools.map(({ Icon, name, href, description }) => (
                <Link
                  key={name}
                  href={href}
                  className="group flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50/40 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 transition-colors group-hover:bg-primary-200">
                    <Icon className="h-4 w-4 text-primary-600" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary-700">
                      {name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">{description}</p>
                  </div>
                  <ArrowRightIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300 transition-colors group-hover:text-primary-400" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
