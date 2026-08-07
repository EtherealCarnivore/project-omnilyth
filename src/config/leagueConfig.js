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
  // NOTE: 'Allflame' is also the exact poe.ninja + GGG API league key — one
  // word, lowercase f. The expansion is marketed as "Curse of the Allflame"
  // but that string 404s against every API. Never send the marketing name.
  name: 'Allflame',

  // ISO 8601 UTC timestamp for league launch
  // Allflame (3.29.0) launch: Friday 20:00 UTC / 1:00 PM PDT
  // Update this each league!
  launchTimestamp: '2026-07-24T20:00:00Z',

  // Optional league icon URL (set null if none available)
  iconUrl: null,

  // Toggle to show/hide the countdown across the app
  // Set false after launch + a few days when no longer relevant
  showCountdown: false,
};

export default LEAGUE_CONFIG;
