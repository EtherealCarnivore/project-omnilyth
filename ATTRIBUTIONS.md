# Attributions & Credits

Project Omnilyth is built with data and inspiration from various Path of Exile community resources. We are deeply grateful to these projects and their maintainers.

---

## 📦 Data Sources

### Leveling Data
**Source:** [exile-leveling](https://github.com/HeartofPhos/exile-leveling) by HeartofPhos
**License:** Check original repository
**Used For:** Act progression data, zone information, quest objectives
**Files:** `src/data/leveling/acts*.js`
**Modifications:** Transformed to match our data structure, added tips and recipes from other sources

**Source:** [poe-leveling.com](https://poe-leveling.com)
**Used For:** Leveling tips, racing strategies, zone guidance
**Files:** `src/data/leveling/acts*.js`
**Modifications:** Adapted and integrated with our act-based system

### Gem Data
**Source:** [Path of Exile Wiki](https://www.poewiki.net)
**License:** CC BY-NC-SA 3.0
**Used For:** Gem quest rewards, vendor availability, gem requirements
**Files:** `src/data/leveling/gemAvailability.js`
**Specific Pages:**
- [Quest Rewards](https://www.poewiki.net/wiki/Quest_Rewards)
- [Skill Gem](https://www.poewiki.net/wiki/Skill_gem)

### Gem Icons
**Source:** [web.poecdn.com](https://web.poecdn.com) (Official Path of Exile CDN)
**Owner:** Grinding Gear Games
**Used For:** Gem icons displayed throughout the application
**Usage:** Hotlinked from official CDN, not redistributed

### Price Data
**Source:** [poe.ninja API](https://poe.ninja)
**Used For:** Real-time item and currency prices
**Files:** `src/hooks/usePrices.js`, calculator components
**Usage:** Public API with 24-hour caching

### Game Data
**Source:** Path of Exile game files (via community resources)
**Owner:** Grinding Gear Games
**Used For:**
- Item modifications (`src/data/itemMods.js`)
- Cluster jewel notables (`src/data/clusterJewelData.json`)
- Map modifiers (`src/data/mapModsRegular.js`, `src/data/mapModsT17.js`)
- Item bases (`src/data/itemBases.js`)
- Scarab types (`src/data/scarabData.js`)

**Note:** This data is publicly available game information compiled from various community resources. We do not redistribute game assets.

---

## 💡 Inspiration & Concepts

### UI/UX Patterns
While all code is originally written, UI patterns were inspired by:
- **Path of Building** - Character planning concepts
- **Awakened PoE Trade** - Overlay interaction patterns
- **poe.ninja** - Price display and league selection patterns

### Calculators
Calculator logic and formulas reference:
- **PoE Wiki** - Crafting mechanics, probability calculations
- **Community guides** - Best practices for socket coloring, fusing strategies
- **Reddit discussions** - User-tested strategies and tips

---

## 🔧 Open Source Libraries

### Frontend Dependencies
- **React 19** - [MIT License](https://github.com/facebook/react/blob/main/LICENSE)
- **Vite 7** - [MIT License](https://github.com/vitejs/vite/blob/main/LICENSE)
- **Tailwind CSS 4** - [MIT License](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE)
- **React Router v7** - [MIT License](https://github.com/remix-run/react-router/blob/main/LICENSE.md)
- **Fuse.js** - [Apache 2.0 License](https://github.com/krisk/Fuse/blob/master/LICENSE)

### Build & Deploy
- **GitHub Actions** - CI/CD automation
- **Netlify** - Hosting and serverless functions
- **Cloudflare Workers** - API proxy alternative

See `package.json` for complete dependency list.

---

## 🙏 Community Contributors

Special thanks to:
- **HeartofPhos** - For exile-leveling data structure and comprehensive act information
- **PoE Wiki Maintainers** - For meticulously documenting game mechanics
- **poe.ninja Team** - For providing free API access to price data
- **poe-leveling.com** - For racing tips and optimization strategies
- **Path of Exile Community** - For countless guides, discussions, and shared knowledge

---

## 📄 Our Contributions

**What we created originally:**
- All React components and UI implementation
- Calculator logic and algorithms
- Regex generation systems
- Data transformation and merging pipelines
- Serverless function implementations
- Design system and visual styling
- User feedback system
- Gem progression tracking system
- Act-by-act quest tracking interface

**Original Features:**
- Design variant system (v1/v2 layouts)
- Module pinning functionality
- Integrated feedback submission
- Multi-output regex patterns (for 250-char limit)
- Chromatic calculator with all strategies
- Cluster jewel compatibility checker
- Timeless jewel seed search
- Scarab price-based filtering

---

## 📋 License Compliance

### CC BY-NC-SA 3.0 Content (PoE Wiki)
Content from Path of Exile Wiki is used under Creative Commons Attribution-NonCommercial-ShareAlike 3.0:
- ✅ **Attribution** - Credited in this file and in-app
- ✅ **NonCommercial** - Omnilyth is free with no monetization
- ✅ **ShareAlike** - This project uses MIT license (compatible for our original work)

### Fair Use (Game Data)
Path of Exile game data (item mods, skill gems, etc.):
- Used for informational/educational purposes
- No game assets redistributed
- Icons hotlinked from official CDN (not stored locally)
- Enhances player experience without replacing official tools

---

## 🔄 How to Contribute Attribution

If you use Omnilyth's code:
1. Keep this ATTRIBUTIONS.md file
2. Maintain license headers in data files
3. Credit upstream sources (HeartofPhos, PoE Wiki, etc.)
4. Add your own modifications to "Community Contributors"

If we missed crediting your work:
- Open an issue on GitHub
- We'll add proper attribution immediately
- We respect intellectual property and community effort

---

## 📞 Contact

For attribution questions or concerns:
- GitHub Issues: https://github.com/EtherealCarnivore/project-omnilyth/issues
- Reddit: r/pathofexile (mention Omnilyth)

**We believe in giving credit where credit is due.** If you contributed to any of the sources we use, thank you for making the PoE community better.

---

*Last Updated: 2026-02-21*
