import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const statusLabel = {
  queued: 'Waiting in queue…',
  active: 'Processing…',
  processing: 'Processing…',
  completed: 'Done!',
  failed: 'Failed',
};

export default function ProgressBar({ progress, status }) {
  const isDone = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDone && (
            <CheckCircleIcon className="h-4 w-4 text-primary-600" aria-hidden="true" />
          )}
          {isFailed && (
            <ExclamationCircleIcon className="h-4 w-4 text-red-500" aria-hidden="true" />
          )}
          <span
            className={`text-sm font-medium ${
              isDone ? 'text-primary-700' : isFailed ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            {statusLabel[status] ?? 'Processing…'}
          </span>
        </div>
        <span
          className={`text-sm font-semibold tabular-nums ${
            isDone ? 'text-primary-700' : isFailed ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {progress}%
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`relative h-full rounded-full transition-all duration-300 ease-out ${
            isDone
              ? 'bg-primary-500'
              : isFailed
              ? 'bg-red-400'
              : 'bg-primary-500'
          }`}
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer on active */}
          {!isDone && !isFailed && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
