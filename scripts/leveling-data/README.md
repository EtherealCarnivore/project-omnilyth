# Leveling Data Scripts

Scripts for collecting, parsing, and merging leveling data from multiple sources.

## Data Sources

1. **exile-leveling** (GitHub) - Structured data for areas, quests, and gems
   - Repository: https://github.com/HeartofPhos/exile-leveling
   - Format: JSON files (areas.json, quests.json, gems.json)
   - License: Check repository

2. **poe-leveling.com** - Leveling guides and tips
   - URL: https://www.poe-leveling.com
   - Method: Web scraping (respects robots.txt, rate limited)
   - Content: Zone guides, tips, racing advice

3. **PoE Wiki** - Gem vendor availability
   - URL: https://www.poewiki.net
   - Method: Web scraping (respects robots.txt, rate limited)
   - License: CC BY-NC-SA 3.0
   - Content: Which classes can buy/receive which gems

## Usage

### Quick Start (Mock Data)

For testing and development without scraping:

```bash
npm run leveling-data:mock
```

This generates realistic mock data instantly.

### Full Pipeline (Live Data)

To fetch real data from all sources (takes 10-15 minutes):

```bash
npm run leveling-data:live
```

This will:
1. Parse exile-leveling from GitHub (~5 seconds)
2. Scrape poe-leveling.com (~5 minutes with rate limiting)
3. Scrape PoE Wiki for gem data (~8 minutes with rate limiting)
4. Merge all sources into unified format (~5 seconds)
5. Generate act-based chunks for code splitting

### Individual Scripts

Run individual steps if needed:

```bash
# Step 1: Parse exile-leveling
node scripts/leveling-data/parse-exile-leveling.js

# Step 2: Scrape poe-leveling.com
node scripts/leveling-data/scrape-poe-leveling.js

# Step 3: Scrape PoE Wiki
node scripts/leveling-data/scrape-poe-wiki.js

# Step 4: Merge all data
node scripts/leveling-data/merge-data-sources.js

# Generate mock data
node scripts/leveling-data/generate-mock-data.js
```

## Output

### Raw Data (Intermediate)

Located in `scripts/leveling-data/raw/`:
- `exile-leveling-transformed.json` - Parsed GitHub data
- `poe-leveling-scraped.json` - Scraped leveling guides
- `poe-wiki-gems.json` - Scraped gem availability

### Final Output (Used by App)

Located in `src/data/leveling/`:
- `acts123-data.js` - Acts 1-3 (areas, quests, gems)
- `acts456-data.js` - Acts 4-6
- `acts789-data.js` - Acts 7-9
- `act10-data.js` - Act 10

These files are lazy-loaded by the frontend for optimal performance.

## Data Schema

### Area Object
```javascript
{
  id: 'area-1',
  name: 'The Coast',
  act: 1,
  level: 1,
  hasWaypoint: false,
  isOptional: false,
  connections: ['area-2', 'area-3'],
  objectives: [
    { type: 'quest', description: '...', reward: '...' }
  ],
  tips: [
    { content: '...', category: 'combat', freshOnly: false }
  ],
  craftingRecipes: []
}
```

### Quest Object
```javascript
{
  id: 'quest-1',
  name: 'Enemy at the Gate',
  act: 1,
  required: true,
  objectives: ['Kill Hillock'],
  rewards: {
    skillPoints: 0,
    passive: false,
    items: []
  },
  zones: ['area-1']
}
```

### Gem Object
```javascript
{
  id: 'gem-1',
  name: 'Cleave',
  level: 1,
  act: 1,
  source: 'vendor',
  classes: ['Marauder', 'Duelist'],
  color: 'str',
  quest: null,
  vendor: 'Nessa',
  questRewards: { Marauder: true, Duelist: true },
  vendorAvailability: { Marauder: true, Duelist: true, Templar: true }
}
```

## Rate Limiting

To be respectful to external websites:
- **poe-leveling.com**: 2 seconds between requests
- **PoE Wiki**: 3 seconds between requests

Total time for full pipeline: ~10-15 minutes

## Caching

The merge script (`merge-data-sources.js`) checks for cached data first:
- If raw data exists, uses cached version
- If not found, fetches fresh data
- Delete files in `scripts/leveling-data/raw/` to force refresh

## Attribution

All generated files include source attribution:

```javascript
{
  credits: {
    sources: [
      { name: 'exile-leveling', author: 'HeartofPhos', url: '...' },
      { name: 'poe-leveling.com', url: '...' },
      { name: 'Path of Exile Wiki', license: 'CC BY-NC-SA 3.0', url: '...' }
    ],
    generatedAt: '2026-02-19T...',
    disclaimer: 'Data compiled for educational purposes...'
  }
}
```

## Troubleshooting

### Scraping Fails

If scraping fails:
1. Check internet connection
2. Verify sites are accessible
3. Check if site structure changed
4. Use `--mock` mode for development

### Rate Limit Errors

If you hit rate limits:
- Wait a few minutes before retrying
- Use cached data (don't delete raw files)
- Use mock data for development

### Site Structure Changed

If poe-leveling.com or wiki changed structure:
1. Update extraction logic in scraper files
2. Test with small sample first
3. Consider using mock data until fixed

## Development

When developing UI:
1. Use mock data initially (`npm run leveling-data:mock`)
2. Test with real data before final release
3. Verify all credits and attributions are displayed

## License Compliance

- **exile-leveling**: Check repository license
- **poe-leveling.com**: Educational/personal use
- **PoE Wiki**: CC BY-NC-SA 3.0 (attribution required)

Always display proper attribution in the app UI.
