import { useRef, useState, useEffect } from 'react';

const TIMELESS_URL = import.meta.env.DEV
  ? 'http://localhost:5179/timeless-jewels/tree?embedded'
  : 'https://vilsol.github.io/timeless-jewels/tree?embedded';

export default function TimelessJewelPage() {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }

  return (
    <div ref={containerRef} className="relative -mx-4 sm:-mx-6 -my-6 sm:-my-8 bg-zinc-950" style={{ height: 'calc(100vh - 3.5rem)' }}>
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
            <span className="text-sm text-zinc-400">Loading Timeless Jewel Calculator...</span>
          </div>
        </div>
      )}

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors backdrop-blur-sm"
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4H4m0 0l5 5M9 15v5H4m0 0l5-5m6-6V4h5m0 0l-5 5m5 6v5h-5m0 0l5-5" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
          </svg>
        )}
      </button>

      <iframe
        src={TIMELESS_URL}
        onLoad={() => setLoading(false)}
        className="w-full h-full border-0"
        allow="fullscreen"
        title="Timeless Jewel Calculator"
      />
    </div>
  );
}
