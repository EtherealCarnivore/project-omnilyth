/*
 * LeagueCountdown.jsx — Countdown timer for upcoming league launches.
 *
 * Two variants:
 *   - 'gate'      — Large, prominent display for the beta gate / login page
 *   - 'dashboard' — Compact display for the main dashboard above patch notes
 *
 * Configure the current league in src/config/leagueConfig.js.
 * Automatically converts launch time to the user's local timezone.
 * Switches to "League Live Now" when the countdown reaches zero.
 */

import { useState, useEffect } from 'react';
import LEAGUE_CONFIG from '../config/leagueConfig';

const LeagueCountdown = ({
  leagueName = LEAGUE_CONFIG.name,
  launchTimestamp = LEAGUE_CONFIG.launchTimestamp,
  variant = 'dashboard',
  leagueIconUrl = LEAGUE_CONFIG.iconUrl,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [localLaunchTime, setLocalLaunchTime] = useState('');

  useEffect(() => {
    const launchDate = new Date(launchTimestamp);
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    };
    setLocalLaunchTime(launchDate.toLocaleString(undefined, options));
  }, [launchTimestamp]);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const launch = new Date(launchTimestamp).getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setIsLive(true);
        setTimeRemaining(null);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      setIsLive(false);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [launchTimestamp]);

  const TimeUnit = ({ value, label, isGate }) => (
    <div className={`flex flex-col items-center ${isGate ? 'gap-2' : 'gap-1'}`}>
      <div className={`
        relative bg-gradient-to-b from-zinc-800 to-zinc-900
        border border-teal-500/20 rounded-lg
        flex items-center justify-center
        font-mono font-bold
        ${isGate
          ? 'w-20 h-24 sm:w-24 sm:h-28 text-4xl sm:text-5xl'
          : 'w-14 h-16 sm:w-16 sm:h-18 text-2xl sm:text-3xl'
        }
        text-teal-400
        shadow-lg shadow-teal-500/10
        before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-teal-500/5 before:rounded-lg
      `}>
        <span className="relative z-10 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
        <div className="absolute inset-0 bg-teal-500/5 blur-xl rounded-lg" />
      </div>
      <span className={`
        uppercase tracking-wider font-medium
        ${isGate
          ? 'text-zinc-400 text-xs sm:text-sm'
          : 'text-zinc-500 text-[10px] sm:text-xs'
        }
      `}>
        {label}
      </span>
    </div>
  );

  const LiveState = ({ isGate }) => (
    <div className={`
      flex items-center justify-center gap-3
      ${isGate ? 'py-8' : 'py-4'}
    `}>
      <div className="relative">
        <div className={`
          ${isGate ? 'w-3 h-3' : 'w-2 h-2'}
          bg-teal-400 rounded-full
          animate-pulse
        `} />
        <div className={`
          absolute inset-0
          ${isGate ? 'w-3 h-3' : 'w-2 h-2'}
          bg-teal-400 rounded-full
          animate-ping
        `} />
      </div>
      <span className={`
        font-bold uppercase tracking-wider
        bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent
        ${isGate ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl'}
      `}>
        League Live Now
      </span>
    </div>
  );

  // Gate variant (larger, prominent)
  if (variant === 'gate') {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="
          bg-zinc-900/90 backdrop-blur-sm
          border border-white/10
          rounded-xl p-6 sm:p-8
          shadow-2xl shadow-teal-500/5
        ">
          <div className="flex items-center justify-center gap-4 mb-6">
            {leagueIconUrl && (
              <img
                src={leagueIconUrl}
                alt={`${leagueName} League`}
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-lg"
              />
            )}
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-1">
                {leagueName} League
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Launches {localLaunchTime}
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent mb-8" />

          {isLive ? (
            <LiveState isGate={true} />
          ) : timeRemaining ? (
            <div className="flex justify-center gap-3 sm:gap-6">
              <TimeUnit value={timeRemaining.days} label="Days" isGate={true} />
              <TimeUnit value={timeRemaining.hours} label="Hours" isGate={true} />
              <TimeUnit value={timeRemaining.minutes} label="Minutes" isGate={true} />
              <TimeUnit value={timeRemaining.seconds} label="Seconds" isGate={true} />
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-500 border-t-transparent" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Dashboard variant (compact)
  return (
    <div className="w-full">
      <div className="
        bg-zinc-900/90 backdrop-blur-sm
        border border-white/10
        rounded-lg p-4
        shadow-lg shadow-teal-500/5
      ">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {leagueIconUrl && (
              <img
                src={leagueIconUrl}
                alt={`${leagueName} League`}
                className="w-6 h-6 object-contain drop-shadow-md"
              />
            )}
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {leagueName} League Launch
              </h3>
              <p className="text-xs text-zinc-500">
                {localLaunchTime}
              </p>
            </div>
          </div>
        </div>

        {isLive ? (
          <LiveState isGate={false} />
        ) : timeRemaining ? (
          <div className="flex justify-center gap-2 sm:gap-4">
            <TimeUnit value={timeRemaining.days} label="Days" isGate={false} />
            <TimeUnit value={timeRemaining.hours} label="Hours" isGate={false} />
            <TimeUnit value={timeRemaining.minutes} label="Mins" isGate={false} />
            <TimeUnit value={timeRemaining.seconds} label="Secs" isGate={false} />
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-teal-500 border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueCountdown;
