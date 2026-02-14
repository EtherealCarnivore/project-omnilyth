/**
 * Cluster Jewel Calculator — Pure functions
 * Determines compatible "middle" notables for Large Cluster Jewels
 * and generates PoE Trade search URLs.
 */

/* ── Data initialization ── */

export function initClusterData(megaStruct) {
  const sortOrderMap = {};
  const largeNotables = megaStruct.Notables.Large || {};
  for (const name in largeNotables) {
    sortOrderMap[name] = largeNotables[name];
  }

  const enchantMap = {};
  for (const name in largeNotables) {
    const nObj = largeNotables[name];
    for (let i = 0; i < nObj.Enchantments.length; i++) {
      const ench = nObj.Enchantments[i];
      const key = getEnchantKey(ench);
      const value = determineEnchantValue(ench, megaStruct);
      enchantMap[key] = value;
    }
  }

  return { sortOrderMap, enchantMap, tradeStats: megaStruct.TradeStats };
}

/* ── Enchant helpers ── */

export function getEnchantKey(enchantment) {
  return enchantment
    .map((line) => line.Description.replace('%', line.Value + '%'))
    .join('/');
}

function enchLineEquals(l1, l2) {
  return l1.Description === l2.Description && l1.Value === l2.Value;
}

function enchantEquals(e1, e2) {
  if (e1.length !== e2.length) return false;
  return e1.every((line, i) => enchLineEquals(line, e2[i]));
}

export function includesEnchant(list, ench) {
  return list.some((e) => enchantEquals(e, ench));
}

function getValidEnchants(notable1, notable3) {
  return notable1.Enchantments.filter((ench) =>
    includesEnchant(notable3.Enchantments, ench)
  );
}

function isEnchantsValid(allowed, enchs) {
  return enchs.some((ench) => includesEnchant(allowed, ench));
}

/**
 * Check if a candidate notable can be paired with the already-selected notables.
 * Filters out: same mod group, no shared enchantments.
 */
export function isNotableSelectable(candidateName, selectedNames, sortOrderMap) {
  if (!selectedNames.length) return true;
  const candidate = sortOrderMap[candidateName];
  if (!candidate) return false;

  for (const selName of selectedNames) {
    const sel = sortOrderMap[selName];
    if (!sel) continue;
    // Same group = always invalid pair
    if (candidate.Mod.CorrectGroup === sel.Mod.CorrectGroup) return false;
    // No shared enchantments = can't roll on same jewel type
    const shared = candidate.Enchantments.some((ench) =>
      includesEnchant(sel.Enchantments, ench)
    );
    if (!shared) return false;
  }
  return true;
}

/* ── Notable compatibility ── */

function isSuffix(notable) {
  return notable.Mod.CorrectGroup.includes('Suffix');
}

function isBetween(val1, val3, between) {
  return val1 < val3
    ? val1 < between && val3 > between
    : val3 < between && val1 > between;
}

function isNotableBetween(not1, not3, candidate) {
  return isBetween(not1.Stat._rid, not3.Stat._rid, candidate.Stat._rid);
}

function areNotablesCompatible(not1, not3, not2, validEnchants) {
  let numPrefixes = 0;
  if (!isSuffix(not1)) numPrefixes++;
  if (!isSuffix(not2)) numPrefixes++;
  if (!isSuffix(not3)) numPrefixes++;

  return (
    numPrefixes < 3 &&
    isNotableBetween(not1, not3, not2) &&
    isEnchantsValid(validEnchants, not2.Enchantments) &&
    not2.Mod.CorrectGroup !== not1.Mod.CorrectGroup &&
    not2.Mod.CorrectGroup !== not3.Mod.CorrectGroup
  );
}

/* ── Main calculation ── */

export function calculateAllPairs(selectedNotables, sortOrderMap, megaStruct) {
  const results = [];
  for (let i = 0; i < selectedNotables.length; i++) {
    for (let j = i + 1; j < selectedNotables.length; j++) {
      results.push(
        calculatePairCompatibility(
          selectedNotables[i],
          selectedNotables[j],
          sortOrderMap,
          megaStruct
        )
      );
    }
  }
  return results;
}

function calculatePairCompatibility(name1, name3, sortOrderMap, megaStruct) {
  const notable1 = sortOrderMap[name1];
  const notable3 = sortOrderMap[name3];

  const out = {
    notableName1: name1,
    notableName3: name3,
    notable1,
    notable3,
    success: false,
  };

  if (notable1.Mod.CorrectGroup === notable3.Mod.CorrectGroup) {
    out.error = 'Notables cannot be in the same group.';
    return out;
  }

  const validEnchants = getValidEnchants(notable1, notable3);
  if (validEnchants.length === 0) {
    out.error = 'Those notables cannot roll on any of the same cluster jewel types.';
    return out;
  }

  const largeNotables = megaStruct.Notables.Large || {};
  const notablesBetween = [];
  const betweenNames = [];
  let minLvl = Math.min(notable1.Mod.Level, notable3.Mod.Level);
  let maxLvl = Math.max(notable1.Mod.Level, notable3.Mod.Level);

  for (const notableName in largeNotables) {
    const nObj = largeNotables[notableName];
    if (areNotablesCompatible(notable1, notable3, nObj, validEnchants)) {
      notablesBetween.push(nObj);
      betweenNames.push(notableName);
      const lvl = nObj.Mod.Level;
      if (lvl > maxLvl) maxLvl = lvl;
      if (lvl < minLvl) minLvl = lvl;
    }
  }

  if (notablesBetween.length === 0) {
    out.error = 'No notables can appear in position 2 with this selection.';
    return out;
  }

  out.success = true;
  out.betweenNames = betweenNames;
  out.notablesBetween = notablesBetween;
  out.validEnchants = validEnchants;
  out.minLvl = minLvl;
  out.maxLvl = maxLvl;

  return out;
}

/* ── Trade URL generation ── */

function getNotableTradeId(name, tradeStats) {
  return tradeStats.Explicit[name];
}

export function buildTradeUrl(league, desired, middleNotables, enchant, clusterData) {
  const { enchantMap, tradeStats } = clusterData;

  const andBody = { type: 'and', filters: [], disabled: false };
  const countBody = { type: 'count', value: { min: 1 }, filters: [], disabled: false };

  // 8 passives
  andBody.filters.push({
    id: tradeStats.Enchant['Adds # Passive Skills'].id,
    value: { min: 8, max: 8 },
    disabled: false,
  });

  // Enchant filter
  if (enchant) {
    const key = getEnchantKey(enchant);
    const enchantValue = enchantMap[key];
    if (enchantValue) {
      andBody.filters.push({
        id: tradeStats.Enchant['Added Small Passive Skills grant: #'].id,
        value: { option: enchantValue.id },
        disabled: false,
      });
    }
  }

  // Desired notables
  for (const name of desired) {
    const id = getNotableTradeId(name, tradeStats);
    if (id) andBody.filters.push({ id, disabled: false });
  }

  // Middle notables (any 1)
  for (const name of middleNotables) {
    const id = getNotableTradeId(name, tradeStats);
    if (id) countBody.filters.push({ id, disabled: false });
  }

  const body = {
    query: {
      status: { option: 'securable' },
      stats: [andBody, countBody],
    },
    sort: { price: 'asc' },
  };

  const encoded = encodeURIComponent(JSON.stringify(body));
  const leagueSlug = encodeURIComponent(league);
  return `https://www.pathofexile.com/trade/search/${leagueSlug}?q=${encoded}`;
}

/* ── Enchant value determination (ported from original) ── */

function harvestKeywords(lineDescr) {
  return lineDescr
    .replace('+', 'increased_')
    .replace('physical_damage_reduction_rating', 'armour')
    .replace('channelled', 'channel')
    .replace('suppression', 'suppress')
    .replace('sigil', 'brand')
    .replace('empowered', 'exert')
    .toLowerCase()
    .split('_')
    .filter((w) => !['%', 'and', 'a', 'base', 'damage', 'to', 'rating', 'additional'].includes(w));
}

function determineEnchantValue(enchantment, megaStruct) {
  let tradeOptions = [
    ...megaStruct.TradeStats.Enchant['Added Small Passive Skills grant: #'].option.options,
  ];

  for (let i = 0; i < enchantment.length; i++) {
    const enchantLine = enchantment[i];
    const lineValue = enchantLine.Value;
    const lineDescr = enchantLine.Description;
    const keywords = harvestKeywords(lineDescr);

    tradeOptions = tradeOptions.filter((opt) => {
      const text = opt.text.toLowerCase();
      if (!text.includes(lineValue)) return false;
      for (const kword of keywords) {
        if (!text.includes(kword)) return false;
      }
      if (text.includes('legacy')) return false;
      if (text.startsWith('minion') && !keywords.includes('minion')) return false;
      if (text.includes('herald') && !keywords.includes('herald')) return false;
      if (text.includes('time') && !keywords.includes('time')) {
        const found = enchantment.some(
          (line, l) => l !== i && harvestKeywords(line.Description).includes('time')
        );
        if (!found) return false;
      }
      return true;
    });

    if (tradeOptions.length === 1) return tradeOptions[0];
  }

  return null;
}
