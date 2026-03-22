export function generateNumberRegex(number, optimize) {
  const numbers = number.match(/\d/g);
  if (numbers === null) {
    return "";
  }
  const quant = optimize
    ? Math.floor(Number(numbers.join("")) / 10) * 10
    : Number(numbers.join(""));
  if (isNaN(quant) || quant === 0) {
    if (optimize && numbers.length === 1) {
      return ".";
    }
    return "";
  }
  if (quant >= 200) {
    const v = truncateLastDigit(truncateLastDigit(quant));
    return `[${v}-9]..`;
  }
  if (quant >= 150) {
    const str = quant.toString();
    const d0 = str[0];
    const d1 = str[1];
    const d2 = str[2];
    if (str[1] === "0" && str[2] === "0") {
      return `([2-9]..|${d0}..)`;
    } else if (str[2] === "0") {
      return `([2-9]..|1[${d1}-9].)`;
    } else if (str[1] === "0") {
      return `([2-9]..|\\d0[${d2}-9]|\\d[1-9].)`;
    } else if (str[1] === "9" && str[2] === "9") {
      return `([2-9]..|199)`;
    } else {
      if (d1 === "9") {
        return `([2-9]..|19[${d2}-9])`;
      }
      return `[12]([${d1}-9][${d2}-9]|[${Number(d1) + 1}-9].)`;
    }
  }
  if (quant > 100) {
    const str = quant.toString();
    const d0 = str[0];
    const d1 = str[1];
    const d2 = str[2];
    if (str[1] === "0" && str[2] === "0") {
      return `${d0}..`;
    } else if (str[2] === "0") {
      return `(1[${d1}-9].|[2-9]..)`;
    } else if (str[1] === "0") {
      return `(\\d0[${d2}-9]|\\d[1-9].)`;
    } else if (str[1] === "9" && str[2] === "9") {
      return `(199|[2-9]..)`;
    } else {
      if (d1 === "9") {
        return `19[${d2}-9]`;
      }
      return `(1([${d1}-9][${d2}-9]|[${Number(d1) + 1}-9].)|[2-9]..)`;
    }
  }
  if (quant === 100) {
    return `\\d..`;
  }
  if (quant > 9) {
    const str = quant.toString();
    const d0 = str[0];
    const d1 = str[1];
    if (str[1] === "0") {
      return `([${d0}-9].|\\d..)`;
    } else if (str[0] === "9") {
      return `(${d0}[${d1}-9]|\\d..)`;
    } else {
      return `(${d0}[${d1}-9]|[${Number(d0) + 1}-9].|\\d..)`;
    }
  }
  if (quant <= 9) {
    return `([${quant}-9]|\\d..?)`;
  }
  return number;
}

function truncateLastDigit(n) {
  return Math.floor(n / 10);
}

function distinct(arr) {
  return [...new Set(arr)];
}

export function idToRegex(id, regex) {
  const token = regex.tokens.find((t) => id === t.id);
  return token ? token.regex : undefined;
}

export function optimizeRegexFromIds(selectedIds, regex) {
  const regexTokenIds = regex.tokens.map((t) => t.id);
  const existingSelectedIds = selectedIds.filter((id) => regexTokenIds.includes(id));
  return optimizedRegexTokens(existingSelectedIds, regex);
}

function optimizedRegexTokens(selectedIds, regex) {
  const numberOfIds = selectedIds.length;
  const optimizationTable = regex.optimizationTable;
  const maxLength = optimizationSize(numberOfIds);
  const optimizationKeys = generateOptimizationKeys(selectedIds, maxLength);

  let optimizedRegex = [];
  const unoptimizedIds = optimizationKeys.reduce((ids, key) => {
    const optimizationResult = optimizationTable[key];
    if (optimizationResult === undefined || !optimizationResult.ids.every(id => ids.includes(id))) {
      return ids;
    } else {
      optimizedRegex = optimizedRegex.concat(optimizationResult.regex);
      const idsToRemove = optimizationResult.ids;
      return ids.filter(id => !idsToRemove.some((toRemove) => toRemove === id));
    }
  }, selectedIds);

  const unoptimizedTokens = unoptimizedIds
    .map((tokenId) => regex.tokens.find((t) => t.id === tokenId))
    .filter((t) => t !== undefined);

  const result = optimizedRegex.concat(unoptimizedTokens.map((t) => t.regex));
  return distinct(result);
}

function optimizationSize(numberOfElements) {
  if (numberOfElements < 15) return 8;
  if (numberOfElements < 18) return 7;
  if (numberOfElements < 21) return 6;
  if (numberOfElements < 28) return 5;
  return 4;
}

function generateOptimizationKeys(arr, maxLength) {
  const result = [];
  const minLength = 2;

  function combine(start, combination) {
    if (combination.length >= minLength && combination.length <= maxLength) {
      result.push(combination.join(':'));
    }
    for (let i = start; i < arr.length; i++) {
      if (combination.length < maxLength) {
        combine(i + 1, [...combination, arr[i]]);
      }
    }
  }
  combine(0, []);
  return result.sort((a, b) => b.length - a.length);
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function addQuantifier(prefix, string) {
  if (string === "") {
    return "";
  }
  return `"${prefix}${string}%"`;
}

function addRarityRegex(normal, magic, rare, include) {
  if (normal && magic && rare) {
    return include ? "" : `"!y: (n|m|r)"`;
  }
  const normalRegex = normal ? "n" : "";
  const magicRegex = magic ? "m" : "";
  const rareRegex = rare ? "r" : "";
  const result = [normalRegex, magicRegex, rareRegex]
    .filter((e) => e.length > 0)
    .join("|");

  const excludePrefix = include ? "" : "!";
  if (result.length === 0) return "";
  if (result.length === 1) return `"${excludePrefix}y: ${result}"`;
  if (result.length > 1) return `"${excludePrefix}y: (${result})"`;
  return "";
}

function generateBadMods(settings, regex) {
  if (settings.badIds.length === 0) {
    return "";
  }
  const tokens = optimizeRegexFromIds(settings.badIds, regex);
  return `"!${tokens.join("|")}"`;
}

function generateGoodMods(settings, regex) {
  if (settings.goodIds.length === 0) {
    return "";
  }
  const tokens = settings.goodIds
    .map((id) => idToRegex(id, regex))
    .filter((e) => e !== undefined)
    .filter(onlyUnique);

  if (settings.allGoodMods) {
    return tokens
      .map((token) => token.includes(" ") ? `"${token}"` : token).join(" ");
  } else {
    return `"${tokens.join("|")}"`;
  }
}

function qualityQualifier(settings) {
  function qualityType(type) {
    if (type === "regular") return "lity:.*";
    if (type === "currency") return "urr.*";
    if (type === "divination") return "div.*";
    if (type === "rarity") return "ty\\).*";
    if (type === "pack size") return "ze\\).*";
    if (type === "scarab") return "sca.*";
    return "";
  }

  const result = [
    addQuantifier(qualityType("regular"), generateNumberRegex(settings.quality.regular, settings.optimizeQuality)),
    addQuantifier(qualityType("currency"), generateNumberRegex(settings.quality.currency, settings.optimizeQuality)),
    addQuantifier(qualityType("divination"), generateNumberRegex(settings.quality.divination, settings.optimizeQuality)),
    addQuantifier(qualityType("rarity"), generateNumberRegex(settings.quality.rarity, settings.optimizeQuality)),
    addQuantifier(qualityType("pack size"), generateNumberRegex(settings.quality.packSize, settings.optimizeQuality)),
    addQuantifier(qualityType("scarab"), generateNumberRegex(settings.quality.scarab, settings.optimizeQuality)),
  ].filter((e) => e !== "");

  if (settings.anyQuality) {
    if (result.length === 0) return "";
    const r = result.map((e) => e.slice(1, -1)).join("|");
    return `"${r}"`;
  } else {
    return result.join(" ");
  }
}

function corruptedMapCheck(settings) {
  if (settings.corrupted.enabled) {
    return settings.corrupted.include ? "pte" : "!pte";
  }
  return "";
}

function unidentifiedMap(settings) {
  if (settings.unidentified.enabled) {
    return settings.unidentified.include ? "tified" : "!tified";
  }
  return "";
}

function optimize(string) {
  return string
    .replaceAll(`"!"`, "")
    .replaceAll("[8-9]", "[89]")
    .replaceAll("[9-9]", "9");
}

export function generateMapModRegex(settings, regex) {
  const exclusions = generateBadMods(settings, regex);
  const inclusions = generateGoodMods(settings, regex);
  const quantity = addQuantifier("m q.*", generateNumberRegex(settings.quantity, settings.optimizeQuant));
  const packsize = addQuantifier("iz.*", generateNumberRegex(settings.packsize, settings.optimizePacksize));
  const mapDrop = addQuantifier("re maps.*", generateNumberRegex(settings.mapDropChance, false));
  const itemRarity = addQuantifier("m rar.*", generateNumberRegex(settings.itemRarity, false));
  const quality = qualityQualifier(settings);
  const rarity = addRarityRegex(settings.rarity.normal, settings.rarity.magic, settings.rarity.rare, settings.rarity.include);
  const corrupted = corruptedMapCheck(settings);
  const unidentified = unidentifiedMap(settings);

  const result = `${exclusions} ${inclusions} ${quantity} ${packsize} ${itemRarity} ${quality} ${rarity} ${mapDrop} ${corrupted} ${unidentified}`
    .trim().replaceAll(/\s{2,}/g, ' ');

  return optimize(result);
}

/* ── Regex Import (reverse-parse a generated regex back into settings) ── */

export function parseMapRegex(input, regexData) {
  const settings = {
    badIds: [], goodIds: [], allGoodMods: false,
    quantity: '', optimizeQuant: false,
    packsize: '', optimizePacksize: false,
    itemRarity: '', mapDropChance: '',
    quality: { regular: '', currency: '', divination: '', rarity: '', packSize: '', scarab: '' },
    optimizeQuality: false, anyQuality: false,
    rarity: { normal: false, magic: false, rare: false, include: true },
    corrupted: { enabled: false, include: true },
    unidentified: { enabled: false, include: true },
  };

  if (!input || !input.trim()) return settings;

  const terms = tokenizeRegex(input.trim());

  const numericPrefixes = [
    { prefix: 'm q.*', quantKey: 'quantity', optKey: 'optimizeQuant' },
    { prefix: 'iz.*', quantKey: 'packsize', optKey: 'optimizePacksize' },
    { prefix: 'm rar.*', quantKey: 'itemRarity', optKey: null },
    { prefix: 're maps.*', quantKey: 'mapDropChance', optKey: null },
  ];

  for (const term of terms) {
    const isQuoted = term.startsWith('"');
    const content = isQuoted ? term.slice(1, -1) : term;

    // Unquoted: corrupted / unidentified / bare include mods (allGoodMods mode)
    if (!isQuoted) {
      if (content === 'pte') { settings.corrupted = { enabled: true, include: true }; continue; }
      if (content === '!pte') { settings.corrupted = { enabled: true, include: false }; continue; }
      if (content === 'tified') { settings.unidentified = { enabled: true, include: true }; continue; }
      if (content === '!tified') { settings.unidentified = { enabled: true, include: false }; continue; }
      const matches = matchTokens(content, regexData.tokens);
      if (matches.length > 0) {
        settings.allGoodMods = true;
        for (const t of matches) if (!settings.goodIds.includes(t.id)) settings.goodIds.push(t.id);
      }
      continue;
    }

    // Quoted terms
    const isExclude = content.startsWith('!');
    const body = isExclude ? content.slice(1) : content;

    // Numeric filters (quantity, packsize, item rarity, map drop)
    let numMatch = false;
    for (const { prefix, quantKey, optKey } of numericPrefixes) {
      if (body.startsWith(prefix)) {
        const numPart = body.slice(prefix.length).replace(/%$/, '');
        const r = reverseNumber(numPart);
        if (r) {
          settings[quantKey] = String(r.value);
          if (optKey) settings[optKey] = r.optimized;
        }
        numMatch = true;
        break;
      }
    }
    if (numMatch) continue;

    // Rarity: "y: n", "y: (n|m)", "!y: r", etc.
    if (/^!?y:\s/.test(content)) {
      const excl = content.startsWith('!');
      const inner = content.replace(/^!?y:\s*/, '').replace(/[()]/g, '');
      const parts = inner.split('|').map(s => s.trim());
      settings.rarity = {
        normal: parts.includes('n'), magic: parts.includes('m'),
        rare: parts.includes('r'), include: !excl,
      };
      continue;
    }

    // Mod patterns (split by | and match against tokens)
    const patterns = body.split('|');
    for (const p of patterns) {
      const trimmed = p.trim();
      if (!trimmed) continue;
      const matches = matchTokens(trimmed, regexData.tokens);
      for (const t of matches) {
        const list = isExclude ? settings.badIds : settings.goodIds;
        if (!list.includes(t.id)) list.push(t.id);
      }
    }
  }

  return settings;
}

function tokenizeRegex(input) {
  const terms = [];
  let i = 0;
  while (i < input.length) {
    while (i < input.length && input[i] === ' ') i++;
    if (i >= input.length) break;
    if (input[i] === '"') {
      const end = input.indexOf('"', i + 1);
      if (end === -1) { terms.push(input.slice(i) + '"'); break; }
      terms.push(input.slice(i, end + 1));
      i = end + 1;
    } else {
      let end = i;
      while (end < input.length && input[end] !== ' ' && input[end] !== '"') end++;
      terms.push(input.slice(i, end));
      i = end;
    }
  }
  return terms;
}

function matchTokens(pattern, tokens) {
  // Exact match on token regex field first
  const exact = tokens.filter(t => t.regex === pattern);
  if (exact.length > 0) return exact;
  // Regex match on rawText (handles optimized patterns)
  try {
    const re = new RegExp(pattern, 'i');
    return tokens.filter(t => re.test(t.rawText));
  } catch {
    const lower = pattern.toLowerCase();
    return tokens.filter(t => t.rawText.toLowerCase().includes(lower));
  }
}

function reverseNumber(pattern) {
  function opt(s) {
    return s.replaceAll('[8-9]', '[89]').replaceAll('[9-9]', '9');
  }
  for (let n = 1; n <= 500; n++) {
    if (opt(generateNumberRegex(String(n), false)) === pattern) return { value: n, optimized: false };
  }
  for (let n = 1; n <= 500; n++) {
    if (opt(generateNumberRegex(String(n), true)) === pattern) return { value: n, optimized: true };
  }
  return null;
}
