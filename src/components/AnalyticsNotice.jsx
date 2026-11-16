/*
 * AnalyticsNotice — one-time homepage notice that anonymous page statistics
 * were added (PRIVACY.md commits to announcing any analytics change on the
 * homepage). Dismissal is remembered in localStorage; hidden for visitors
 * whose browser already blocks the beacon or who opted out.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { browserBlocksAnalytics, isOptedOut } from '../hooks/usePageAnalytics';

const DISMISS_KEY = 'omnilyth_analytics_notice_dismissed_v1';

function initiallyVisible() {
  if (browserBlocksAnalytics || isOptedOut()) return false;
  try {
    return localStorage.getItem(DISMISS_KEY) !== '1';
  } catch {
    return false;
  }
}

export default function AnalyticsNotice() {
  const [visible, setVisible] = useState(initiallyVisible);
  if (!visible) return null;

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* storage blocked */ }
    setVisible(false);
  };

  return (
    <div
      role="note"
      className="flex flex-wrap items-center gap-3 bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-zinc-400"
    >
      <p className="flex-1 min-w-[200px]">
        <strong className="text-zinc-200">New:</strong> Omnilyth now counts which pages get
        used and for how long, anonymously and without cookies, so we know which tools to
        improve.{' '}
        <Link to="/privacy#analytics-opt-out" className="text-amber-400/80 hover:text-amber-300 transition-colors">
          What's sent, and how to opt out
        </Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="min-h-[44px] px-3 rounded-lg text-zinc-400 hover:text-zinc-200 bg-zinc-800/40 border border-white/[0.04] transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
