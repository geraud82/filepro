import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function FileUploader({ onFileSelect, accept, maxSize = 20971520 }) {
  const [error, setError] = useState('');

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError('');

      if (rejectedFiles.length > 0) {
        const code = rejectedFiles[0].errors[0]?.code;
        if (code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${maxSize / 1048576}MB.`);
        } else if (code === 'file-invalid-type') {
          setError('Unsupported file type. Please upload a supported format.');
        } else {
          setError('File upload failed. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-14 text-center cursor-pointer transition-all duration-200 outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 scale-[1.01]'
            : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50/40 bg-gray-50/50'
        }`}
      >
        <input {...getInputProps()} />

        {/* Animated ring when dragging */}
        {isDragActive && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-ping opacity-30 pointer-events-none"
          />
        )}

        <div className="flex flex-col items-center gap-4">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200 ${
              isDragActive ? 'bg-primary-100 scale-110' : 'bg-primary-50'
            }`}
          >
            <CloudArrowUpIcon
              className={`h-8 w-8 transition-colors duration-200 ${
                isDragActive ? 'text-primary-600' : 'text-primary-400'
              }`}
              aria-hidden="true"
            />
          </div>

          <div>
            <p className="text-base font-semibold text-gray-700">
              {isDragActive ? 'Release to upload' : 'Drag & drop your file here'}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              or{' '}
              <span className="text-primary-600 font-medium underline-offset-2 hover:underline">
                click to browse
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1">
            <span className="text-xs text-gray-400">Max size:</span>
            <span className="text-xs font-semibold text-gray-600">
              {maxSize / 1048576}MB
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 text-red-500 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}
