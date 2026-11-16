// Neutral placeholder for gems that have no icon on record yet (e.g. gems
// added from datamined sources before poe.ninja icon data was refreshed).
export const GEM_ICON_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="4" fill="#27272a"/><path d="M16 7l7 9-7 9-7-9z" fill="none" stroke="#71717a" stroke-width="2"/></svg>'
  );
