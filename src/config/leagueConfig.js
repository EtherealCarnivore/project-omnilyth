/*
 * leagueConfig.js — Central configuration for the current/upcoming league.
 *
 * Update this file each league to change the countdown timer everywhere.
 * The countdown appears on the beta gate page and the dashboard.
 *
 * After league launches, set SHOW_COUNTDOWN to false to hide the timer
 * (the component auto-switches to "League Live Now" but you may want to
 * remove it entirely after a few days).
 */

const LEAGUE_CONFIG = {
  // League name shown in the countdown header
  name: 'Mirage',

  // ISO 8601 UTC timestamp for league launch
  // Mirage launch: Friday 19:00 UTC / 21:00 EET
  // Update this each league!
  launchTimestamp: '2026-03-06T19:00:00Z',

  // Optional league icon URL (set null if none available)
  iconUrl: null,

  // Toggle to show/hide the countdown across the app
  // Set false after launch + a few days when no longer relevant
  showCountdown: true,
};

export default LEAGUE_CONFIG;
