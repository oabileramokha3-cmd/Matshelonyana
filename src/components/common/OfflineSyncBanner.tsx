import React from 'react';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  pendingCount: number;
  onSyncNow: () => void;
  isSyncing: boolean;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  pendingCount,
  onSyncNow,
  isSyncing,
}) => {
  if (isOnline && pendingCount === 0) return null;

  return (
    <div className={`w-full px-4 py-2 text-xs flex items-center justify-between transition-colors ${
      !isOnline 
        ? 'bg-amber-950/90 border-b border-amber-800 text-amber-200' 
        : 'bg-sky-950/90 border-b border-sky-800 text-sky-200'
    }`}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>
            {!isOnline ? (
              <>
                <strong>Offline Mode Active:</strong> Field updates & GPS logs stored safely locally in browser. ({pendingCount} pending queue item{pendingCount !== 1 ? 's' : ''})
              </>
            ) : (
              <>
                <strong>Connection Restored:</strong> {pendingCount} offline field update{pendingCount !== 1 ? 's' : ''} ready to sync with headquarters.
              </>
            )}
          </span>
        </div>

        {isOnline && pendingCount > 0 && (
          <button
            onClick={onSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Queue Now'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
