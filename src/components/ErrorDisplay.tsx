import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | string;
  fullScreen?: boolean;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, fullScreen = false, onRetry }: ErrorDisplayProps) {
  const message = error instanceof Error ? error.message : error;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-6 bg-red-50 rounded-lg">
      <AlertTriangle className="w-12 h-12 text-red-600" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Ocorreu um erro</h3>
        <p className="text-red-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Tentar novamente</span>
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
        {content}
      </div>
    );
  }

  return content;
}