/**
 * Guide Search - Search across all guides
 */

import { useState } from 'react';

const GuideSearch = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    // TODO: Implement search across all guide data
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search guides... (Ctrl+F)"
        className="w-full px-4 py-2 bg-black/40 border border-amber-500/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-colors"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">
        🔍
      </div>
    </div>
  );
};

export default GuideSearch;
