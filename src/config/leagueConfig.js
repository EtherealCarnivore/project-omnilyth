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
  // League name shown in the countdown header.
  // NOTE: 'Covens' is the exact poe.ninja + GGG API league key. The expansion
  // is marketed as "Covens of Umbra" but that string is not an API key, and
  // GGG's category id 'Coven' (singular) isn't one either. Never send either.
  name: 'Covens',

  // ISO 8601 UTC timestamp for league launch
  // Covens (3.30.0) launch: Friday 19:00 UTC / 11:00 AM PST
  // Update this each league!
  launchTimestamp: '2026-11-13T19:00:00Z',

  // Optional league icon URL (set null if none available)
  iconUrl: null,

  // Toggle to show/hide the countdown across the app
  // Set false after launch + a few days when no longer relevant
  showCountdown: false,
};

export default LEAGUE_CONFIG;
