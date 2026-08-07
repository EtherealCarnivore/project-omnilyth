/*
 * scarabData.js — Every scarab in PoE with hand-picked regex fragments.
 *
 * REGENERATED 2026-08-07 for patch 3.29.2 (Allflame). Source: https://poedb.tw/us/Scarab
 * 118 entries (was 109): 22 added, 13 removed, and most descriptions rewritten,
 * because 3.29 reworded a lot of core mod text. The 3.29 Abyss and Legion
 * reworks retired scarabs without renaming the families, and Mercenaries going
 * core added the Trarthan family — so this was not an additive refresh.
 *
 * Each regex field is the shortest fragment that selects exactly this scarab and
 * nothing else. QUIRK: uniqueness is computed over the scarab's WHOLE searchable
 * text — the name line plus every mod line — not just the name, because PoE's
 * stash search matches mod text too. A fragment that is unique among the 118
 * names can still light up a dozen other scarabs via their mods. Search is
 * per-line, so ^ and $ anchor to a line; 27 entries need an anchor. Base scarabs
 * must be end-anchored (e.g. "ry scarab$") because their names are prefixes of
 * their own variants, and the family-less "Scarab of X" entries need a start
 * anchor because they are suffixes of e.g. "Ritual Scarab of Wisps".
 *
 * DO NOT hand-patch a single row. Adding or removing one scarab can invalidate
 * fragments for scarabs you did not touch — regenerate the whole set and
 * re-verify that every fragment resolves to exactly one entry.
 *
 * Icons: 96 entries keep their existing web.poecdn.com gen/image URLs. The 22 new
 * ones use the raw web.poecdn.com/image/Art/... path — the gen/image form embeds
 * a content hash that cannot be derived, and poedb has no art yet for the four
 * Trarthan scarabs (their tier art resolves as *ScarabMercenaries).
 *
 * Worst case, selecting all 118 emits 471 chars — 2 chunks under PoE's 250-char
 * cap, which src/calculators/scarabRegex.js bin-packs.
 */
export const scarabs = {
 "Breach Scarab of the Hive": {
   name: "Breach Scarab of the Hive",
   regex: "ive$",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/LesserScarabBreach.png",
   description: "Area contains a Breach Hive",
 },
 "Breach Scarab of Instability": {
   name: "Breach Scarab of Instability",
   regex: "insta",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltLesserScarabBreach.png",
   description: "Area contains 2 additional Unstable Breaches",
 },
 "Breach Scarab of the Marshal": {
   name: "Breach Scarab of the Marshal",
   regex: "hal",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltNormalScarabBreach.png",
   description: "Unstable Breaches in Area contain a Boss; Breach Hives in Area lead to a Hive Fortress",
 },
 "Breach Scarab of the Incensed Swarm": {
   name: "Breach Scarab of the Incensed Swarm",
   regex: "sw",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabBreach.png",
   description: "Ailith's skills in Area instead enrage the Hive, increasing the Difficulty and Reward of subsequent waves",
 },
 "Breach Scarab of Resonant Cascade": {
   name: "Breach Scarab of Resonant Cascade",
   regex: "lr",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkJyZWFjaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/aa58715219/AltTier4ScarabBreach.png",
   description: "Unstable Breaches in Areas are 10% faster for each Unstable Breach already opened; Monsters from Unstable Breaches in Areas have increased Difficulty and Reward for each Unstable Breach already opened",
 },
 "Cartography Scarab of Escalation": {
   name: "Cartography Scarab of Escalation",
   regex: "ala",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJNYXBzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/c982c28d52/LesserScarabMaps.png",
   description: "10% increased Maps found in Area for each Map Modifier affecting Area",
 },
 "Cartography Scarab of Risk": {
   name: "Cartography Scarab of Risk",
   regex: "sk$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJNYXBzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/0baaf413d0/NormalScarabMaps.png",
   description: "Area has 2 additional random Modifiers",
 },
 "Cartography Scarab of Corruption": {
   name: "Cartography Scarab of Corruption",
   regex: "-u",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWFwcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2567494a92/GreaterScarabMaps.png",
   description: "Non-Unique Maps found in Area are Corrupted with 8 Modifiers",
 },
 "Cartography Scarab of the Multitude": {
   name: "Cartography Scarab of the Multitude",
   regex: "g m",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHROb3JtYWxTY2FyYWJNYXBzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/95a7a8097c/AltNormalScarabMaps.png",
   description: "Area contains 8 to 12 additional packs of Difficult and Rewarding Monsters which drop 300% increased Maps",
 },
 "Titanic Scarab": {
   name: "Titanic Scarab",
   regex: "s,",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJVbmlxdWUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/72516960f1/LesserScarabUnique.png",
   description: "Unique Monsters have 1% increased Toughness, Damage, Rarity and Quantity of items dropped per 1% increased Pack Size of Area",
 },
 "Titanic Scarab of Treasures": {
   name: "Titanic Scarab of Treasures",
   regex: "hness$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJVbmlxdWUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/774d92ac8e/NormalScarabUnique.png",
   description: "Unique Monsters in Area have an additional Reward; Unique Monsters in Area have 30% increased Toughness",
 },
 "Titanic Scarab of Legend": {
   name: "Titanic Scarab of Legend",
   regex: "nd$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiVW5pcXVlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6ec6815d00/GreaterScarabUnique.png",
   description: "Unique Monsters in Area have 4 additional Monster Modifiers",
 },
 "Bestiary Scarab": {
   name: "Bestiary Scarab",
   regex: "ry scarab$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZWFzdHMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ea23afd0ff/LesserScarabBeasts.png",
   description: "Area contains Einhar",
 },
 "Bestiary Scarab of the Herd": {
   name: "Bestiary Scarab of the Herd",
   regex: " he",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZWFzdHMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0f4dc83dc5/NormalScarabBeasts.png",
   description: "Area contains 5 additional Red Beasts if it contains Einhar",
 },
 "Bestiary Scarab of Duplicating": {
   name: "Bestiary Scarab of Duplicating",
   regex: "py",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmVhc3RzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7225b9e62b/GreaterScarabBeasts.png",
   description: "Create a copy of Beasts captured in Area",
 },
 "Influencing Scarab of the Shaper": {
   name: "Influencing Scarab of the Shaper",
   regex: "per$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTaGFwZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9e83e315c9/LesserScarabShaper.png",
   description: "Adds Shaper Influence outcome to Area",
 },
 "Influencing Scarab of the Elder": {
   name: "Influencing Scarab of the Elder",
   regex: "e el",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFbGRlciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/11cabe4d12/LesserScarabElder.png",
   description: "Adds Elder Influence outcome to Area",
 },
 "Influencing Scarab of Hordes": {
   name: "Influencing Scarab of Hordes",
   regex: " ho",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRWxkZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2bd3ed1eca/GreaterScarabElder.png",
   description: "Influenced Monster Packs in Area have 40% increased Pack Size",
 },
 "Influencing Scarab of Interference": {
   name: "Influencing Scarab of Interference",
   regex: "rf",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabShaper.png",
   description: "A Map Boss is accompanied by a random Shaper Guardian, Elder Guardian, Conqueror or Synthesis Boss; Can only be used with Tier 14+ Maps",
 },
 "Sulphite Scarab": {
   name: "Sulphite Scarab",
   regex: "ko",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTdWxwaGl0ZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1e18c30014/LesserScarabSulphite.png",
   description: "Area contains Niko",
 },
 "Sulphite Scarab of Fumes": {
   name: "Sulphite Scarab of Fumes",
   regex: "az",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiU3VscGhpdGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2a3855535e/GreaterScarabSulphite.png",
   description: "Sulphite found in Map Area releases Enraging Fumes; Monsters affected by Enraging Fumes have 50% increased Item Quantity; Sulphite in your maps is guarded by Monsters from the Azurite Mine",
 },
 "Divination Scarab of The Cloister": {
   name: "Divination Scarab of The Cloister",
   regex: "oe",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEaXZpbmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ac84db8246/LesserScarabDivination.png",
   description: "Area contains 8 to 12 additional packs of Doedre's Devoted; Doedre's Devoted have 1% additional chance to drop a Stacked Deck",
 },
 "Divination Scarab of Plenty": {
   name: "Divination Scarab of Plenty",
   regex: " 6",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJEaXZpbmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7fb7abf05a/NormalScarabDivination.png",
   description: "Area contains 6 to 10 additional Packs of Divination Touched Magic Monsters that have 1000% increased chance to drop Divination Cards",
 },
 "Divination Scarab of Pilfering": {
   name: "Divination Scarab of Pilfering",
   regex: "^th",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGl2aW5hdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/8101d1a6e1/GreaterScarabDivination.png",
   description: "Divination Cards which drop in Area are stolen by a Final Map Boss; That Final Map Boss becomes more Difficult and deals increased Damage the more Divination Cards they have stolen; That Final Map Boss duplicates all stolen Divination Cards when defeated",
 },
 "Torment Scarab": {
   name: "Torment Scarab",
   regex: "au",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJUb3JtZW50IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b4e843a49b/LesserScarabTorment.png",
   description: "Area is haunted by 4 additional Tormented Spirits; Tormented Spirits in Area have a 10% chance to be set free when Possessed Monsters are slain and dig up a Possessed Monster",
 },
 "Torment Scarab of Peculiarity": {
   name: "Torment Scarab of Peculiarity",
   regex: "pec",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJUb3JtZW50IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b93daed118/NormalScarabTorment.png",
   description: "Tormented Spirits in Area are replaced with unusual variants",
 },
 "Torment Scarab of Possession": {
   name: "Torment Scarab of Possession",
   regex: "a q",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlRvcm1lbnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b809b07f2b/Tier4ScarabTorment.png",
   description: "Rare Monsters in Area have a quarter chance to be Possessed by up to 3 Tormented Spirits",
 },
 "Ambush Scarab": {
   name: "Ambush Scarab",
   regex: "h scarab$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTdHJvbmdib3hlcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/5600ee7971/LesserScarabStrongboxes.png",
   description: "Area contains 4 additional Strongboxes",
 },
 "Ambush Scarab of Hidden Compartments": {
   name: "Ambush Scarab of Hidden Compartments",
   regex: "id",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJTdHJvbmdib3hlcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/46451362bc/NormalScarabStrongboxes.png",
   description: "15% Chance for Strongboxes in Area to be openable again",
 },
 "Ambush Scarab of Potency": {
   name: "Ambush Scarab of Potency",
   regex: "pot",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiU3Ryb25nYm94ZXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8b46f6270a/GreaterScarabStrongboxes.png",
   description: "75% Increased effect of Explicit Modifiers on Strongboxes in Area",
 },
 "Ambush Scarab of Containment": {
   name: "Ambush Scarab of Containment",
   regex: "ny",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlN0cm9uZ2JveGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/dd7b8bd53f/Tier4ScarabStrongboxes.png",
   description: "Area contains many additional Strongboxes; Area's inhabitants are lying in ambush",
 },
 "Ambush Scarab of Discernment": {
   name: "Ambush Scarab of Discernment",
   regex: "^st",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYlN0cm9uZ2JveGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/74111052f4/AltTier4ScarabStrongboxes.png",
   description: "Strongboxes in Area are more likely to be rarer varieties",
 },
 "Expedition Scarab": {
   name: "Expedition Scarab",
   regex: "an ex",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFeHBlZGl0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e9bb9fa480/LesserScarabExpedition.png",
   description: "Area contains an Expedition Encounter",
 },
 "Expedition Scarab of Runefinding": {
   name: "Expedition Scarab of Runefinding",
   regex: " ru",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJFeHBlZGl0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a1f5997c7d/NormalScarabExpedition.png",
   description: "Expedition Encounters in Area have 100% increased number of Runic Monster Markers",
 },
 "Expedition Scarab of Verisium Powder": {
   name: "Expedition Scarab of Verisium Powder",
   regex: "wd",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRXhwZWRpdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/19a2dff87d/GreaterScarabExpedition.png",
   description: "Expedition Encounters in Area have 50% increased number of Explosives 80% increased Explosive Radius",
 },
 "Expedition Scarab of Infusion": {
   name: "Expedition Scarab of Infusion",
   regex: "^lo",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltGreaterScarabExpedition.png",
   description: "Logbooks found in Area always have 4 Implicits; Expedition Monsters gain increased Difficulty and Reward for each Remnant detonated",
 },
 "Expedition Scarab of Archaeology": {
   name: "Expedition Scarab of Archaeology",
   regex: "gy",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkV4cGVkaXRpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b4dd63608b/Tier4ScarabExpedition.png",
   description: "Remnants in Expedition Encounters in Area have 2 additional Suffixes and Prefixes",
 },
 "Legion Scarab": {
   name: "Legion Scarab",
   regex: "l l",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJMZWdpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0006525c3c/LesserScarabLegion.png",
   description: "Area contains an additional Legion Encounter",
 },
 "Legion Scarab of Officers": {
   name: "Legion Scarab of Officers",
   regex: "ice",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJMZWdpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0edb9242f1/NormalScarabLegion.png",
   description: "Legion Factions in Area have 5 additional Sergeants",
 },
 "Legion Scarab of Treasures": {
   name: "Legion Scarab of Treasures",
   regex: "a 2",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltNormalScarabLegion.png",
   description: "Legion Chests in Area have a 20% chance to spread their Rewards to Legion Monsters they release from stasis when they are broken out; Legion Monsters that have gained Rewards have increased Difficulty",
 },
 "Legion Scarab of Eternal Conflict": {
   name: "Legion Scarab of Eternal Conflict",
   regex: " et",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkxlZ2lvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/05b623a2a7/Tier4ScarabLegion.png",
   description: "Legion Monsters in Area can be broken out of Stasis multiple times; Legion Monsters in Area gain increased Difficulty and Reward for each time they are broken out",
 },
 "Abyss Scarab": {
   name: "Abyss Scarab",
   regex: "yss$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJBYnlzcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/5afc346c84/LesserScarabAbyss.png",
   description: "Area contains an additional Abyss",
 },
 "Abyss Scarab of Multitudes": {
   name: "Abyss Scarab of Multitudes",
   regex: "ul$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJBYnlzcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/c78d645398/NormalScarabAbyss.png",
   description: "Abyss Chasms in Area spawn 100% increased Monsters per fed soul",
 },
 "Abyss Scarab of Crystals": {
   name: "Abyss Scarab of Crystals",
   regex: "cry",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/GreaterScarabAbyss.png",
   description: "Abyss Pits in Area that do not contain a reward instead create an Abyssal Crystal",
 },
 "Abyss Scarab of Descending": {
   name: "Abyss Scarab of Descending",
   regex: "hs",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabAbyss.png",
   description: "Area contains an Abyssal Depths",
 },
 "Abyss Scarab of the Consort": {
   name: "Abyss Scarab of the Consort",
   regex: "nso",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltTier4ScarabAbyss.png",
   description: "An Abyss Pit in Area will spawn an Abyssal Consort",
 },
 "Anarchy Scarab": {
   name: "Anarchy Scarab",
   regex: "les$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJBbmFyY2h5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/89174f2e33/LesserScarabAnarchy.png",
   description: "Area contains 5 additional Rogue Exiles",
 },
 "Anarchy Scarab of Gigantification": {
   name: "Anarchy Scarab of Gigantification",
   regex: " gi",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJBbmFyY2h5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/4165090d5d/NormalScarabAnarchy.png",
   description: "Wild Rogue Exiles in Area have a 30% chance to be replaced with a Rogue Giant",
 },
 "Anarchy Scarab of Partnership": {
   name: "Anarchy Scarab of Partnership",
   regex: "tn",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQW5hcmNoeSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/08125ce822/GreaterScarabAnarchy.png",
   description: "Wild Rogue Exiles in Area have a 50% chance to appear in pairs",
 },
 "Anarchy Scarab of the Exceptional": {
   name: "Anarchy Scarab of the Exceptional",
   regex: "xc",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabAnarchy.png",
   description: "Area contains an additional Exceptional Rogue Exile",
 },
 "Essence Scarab": {
   name: "Essence Scarab",
   regex: "l im",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFc3NlbmNlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/c9f153a8cf/LesserScarabEssence.png",
   description: "Area contains 3 additional Imprisoned Monsters",
 },
 "Essence Scarab of Ascent": {
   name: "Essence Scarab of Ascent",
   regex: "r h",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJFc3NlbmNlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3f918a4115/NormalScarabEssence.png",
   description: "Essences found in Area are a tier higher",
 },
 "Essence Scarab of Stability": {
   name: "Essence Scarab of Stability",
   regex: "^co",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRXNzZW5jZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f476efd29d/GreaterScarabEssence.png",
   description: "Corrupting an Essence in Area can only result in upgrading or transforming Essences",
 },
 "Essence Scarab of Calcification": {
   name: "Essence Scarab of Calcification",
   regex: "lc",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkVzc2VuY2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c12e415ec2/Tier4ScarabEssence.png",
   description: "Rare monsters that are natural inhabitants of the Area are imprisoned by Essences",
 },
 "Essence Scarab of Adaptation": {
   name: "Essence Scarab of Adaptation",
   regex: "ada",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkVzc2VuY2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8dbe247549/AltTier4ScarabEssence.png",
   description: "Imprisoned Monsters released in Areas grant a random Essence Modifier to another Imprisoned Monster in the Area; Imprisoned Monsters in Areas have increased Difficulty and Reward for each Essence Modifier",
 },
 "Domination Scarab": {
   name: "Domination Scarab",
   regex: "l sh",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEb21pbmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/56e13db37d/LesserScarabDomination.png",
   description: "Area contains 3 additional Shrines",
 },
 "Domination Scarab of Apparitions": {
   name: "Domination Scarab of Apparitions",
   regex: "f ap",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJEb21pbmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/9ef9fd8595/NormalScarabDomination.png",
   description: "Area contains 2 additional Apparition Shrines",
 },
 "Domination Scarab of Evolution": {
   name: "Domination Scarab of Evolution",
   regex: "olv",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRG9taW5hdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/88bb71ff95/GreaterScarabDomination.png",
   description: "Area contains an additional Evolving Shrine",
 },
 "Domination Scarab of Terrors": {
   name: "Domination Scarab of Terrors",
   regex: "^sh",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkRvbWluYXRpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2e56a6e5dc/Tier4ScarabDomination.png",
   description: "Shrines in Area are guarded by an Atlas Boss; Modifiers to the Final Map Boss also apply to these Atlas Bosses",
 },
 "Ritual Scarab of Selectiveness": {
   name: "Ritual Scarab of Selectiveness",
   regex: "sel",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJSaXR1YWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/744a25b9f9/LesserScarabRitual.png",
   description: "Rerolling Favours at Ritual Altars in Area has no cost the first 2 times; Ritual Altars in Area allow rerolling Favours 2 additional times",
 },
 "Ritual Scarab of Wisps": {
   name: "Ritual Scarab of Wisps",
   regex: "rb",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJSaXR1YWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/45dba85b5a/NormalScarabRitual.png",
   description: "Ritual Altars in Area spawn a Wildwood Wisp; Wildwood Wisps grant 100% increased Tribute Gained to nearby Players",
 },
 "Ritual Scarab of Abundance": {
   name: "Ritual Scarab of Abundance",
   regex: "abu",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiUml0dWFsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/2e76a61fb9/GreaterScarabRitual.png",
   description: "Rituals in Area offer 100% increased Favours",
 },
 "Ritual Scarab of Corpses": {
   name: "Ritual Scarab of Corpses",
   regex: "orp",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabRitual.png",
   description: "Rituals in Area contain an additional Rare Itemised Corpse Monster",
 },
 "Harvest Scarab": {
   name: "Harvest Scarab",
   regex: "ove$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJIYXJ2ZXN0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/0951fed47e/LesserScarabHarvest.png",
   description: "Area contains the Sacred Grove",
 },
 "Harvest Scarab of Doubling": {
   name: "Harvest Scarab of Doubling",
   regex: "^li",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiSGFydmVzdCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/67ebfc1b1f/GreaterScarabHarvest.png",
   description: "Lifeforce dropped by Harvest Monsters in Area is duplicated; Harvest Monsters in Area have 100% more Life",
 },
 "Harvest Scarab of Cornucopia": {
   name: "Harvest Scarab of Cornucopia",
   regex: "^if",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkhhcnZlc3QiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a32654b789/Tier4ScarabHarvest.png",
   description: "If Area contains the Sacred Grove, it will contain up to 1 additional Tier 4 seed of each type, if possible",
 },
 "Incursion Scarab": {
   name: "Incursion Scarab",
   regex: "va$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJJbmN1cnNpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/44cc3c3c34/LesserScarabIncursion.png",
   description: "Area contains Alva",
 },
 "Incursion Scarab of Invasion": {
   name: "Incursion Scarab of Invasion",
   regex: "16 ",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJJbmN1cnNpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/992c5f7548/NormalScarabIncursion.png",
   description: "Area contains 12 to 16 additional packs of Incursion Monsters",
 },
 "Incursion Scarab of Champions": {
   name: "Incursion Scarab of Champions",
   regex: "35",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiSW5jdXJzaW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/f6b60e9be1/GreaterScarabIncursion.png",
   description: "Incursions in Area have a 35% chance for all Monsters to be at least Magic; Incursions in Area have 15% increased Pack Size",
 },
 "Incursion Scarab of Timelines": {
   name: "Incursion Scarab of Timelines",
   regex: "t,",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkluY3Vyc2lvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/c651660186/Tier4ScarabIncursion.png",
   description: "Final Architect slain in Area will drop an Itemised Temple; Itemised Temples dropped in Area are generated based on current Temple layout, but with randomised room tiers",
 },
 "Betrayal Scarab": {
   name: "Betrayal Scarab",
   regex: " j",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZXRyYXlhbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/26d3ff70f1/LesserScarabBetrayal.png",
   description: "Area contains Jun",
 },
 "Betrayal Scarab of the Allflame": {
   name: "Betrayal Scarab of the Allflame",
   regex: "llf",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZXRyYXlhbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/01b158342c/NormalScarabBetrayal.png",
   description: "75% Increased number of Monster Packs Substituted by Allflame Embers in Area",
 },
 "Betrayal Scarab of Reinforcements": {
   name: "Betrayal Scarab of Reinforcements",
   regex: "rei",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmV0cmF5YWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/85f51a19b8/GreaterScarabBetrayal.png",
   description: "Immortal Syndicate Members in Area have 50% increased chance to be accompanied by reinforcements",
 },
 "Betrayal Scarab of Unbreaking": {
   name: "Betrayal Scarab of Unbreaking",
   regex: "nb",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabBetrayal.png",
   description: "Interrogated Immortal Syndicate targets in Area have a 50% chance to not lose Rank upon completing Interrogation",
 },
 "Beyond Scarab": {
   name: "Beyond Scarab",
   regex: "lm",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZXlvbmQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ff67da07b4/LesserScarabBeyond.png",
   description: "Slaying enemies close together in Area can attract monsters from Beyond this realm",
 },
 "Beyond Scarab of Haemophilia": {
   name: "Beyond Scarab of Haemophilia",
   regex: "^ch",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZXlvbmQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/66114ee2e9/NormalScarabBeyond.png",
   description: "Beyond Portals in Area have 50% increased Merging Radius; Characters that Kill Beyond Rare Monsters in Area have a 30% chance to gain their Modifiers for 20 seconds",
 },
 "Beyond Scarab of Resurgence": {
   name: "Beyond Scarab of Resurgence",
   regex: "urg",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiQmV5b25kIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d007f87e7b/AltGreaterScarabBeyond.png",
   description: "Beyond Bosses Spawned in Area are accompanied by Beyond Bosses of other Factions; Beyond Bosses in Area drop 20% increased Tainted Currency; Beyond Portals in Area have 30% increased chance to spawn a Unique Boss",
 },
 "Beyond Scarab of the Invasion": {
   name: "Beyond Scarab of the Invasion",
   regex: "e 8",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJleW9uZCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f3d0278af1/Tier4ScarabBeyond.png",
   description: "Rare and Unique Monsters slain in Area create 8 to 12 additional Beyond Portals",
 },
 "Ultimatum Scarab": {
   name: "Ultimatum Scarab",
   regex: "an u",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJVbHRpbWF0dW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e0bf2875db/LesserScarabUltimatum.png",
   description: "Area contains an Ultimatum Encounter",
 },
 "Ultimatum Scarab of Bribing": {
   name: "Ultimatum Scarab of Bribing",
   regex: "u ",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJVbHRpbWF0dW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f7845be27d/NormalScarabUltimatum.png",
   description: "Ultimatum Monsters grant 150% increased Experience; Ultimatum Encounters grant rewards as though you completed 2 additional Rounds",
 },
 "Ultimatum Scarab of Dueling": {
   name: "Ultimatum Scarab of Dueling",
   regex: "due",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiVWx0aW1hdHVtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/42d067c281/GreaterScarabUltimatum.png",
   description: "Ultimatum Encounters in Area will always lead to a Unique Boss if possible",
 },
 "Ultimatum Scarab of Catalysing": {
   name: "Ultimatum Scarab of Catalysing",
   regex: "ysi",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlVsdGltYXR1bSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/67b8b8b39c/Tier4ScarabUltimatum.png",
   description: "Ultimatum Encounters in Area will only offer Catalysts as Rewards to the Map Owner",
 },
 "Ultimatum Scarab of Inscription": {
   name: "Ultimatum Scarab of Inscription",
   regex: "nsc",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYlVsdGltYXR1bSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6c6731cf8d/AltTier4ScarabUltimatum.png",
   description: "Ultimatum Encounter rewards in Area offering Catalysts will offer Inscribed Ultimatums to the Map Owner instead",
 },
 "Delirium Scarab": {
   name: "Delirium Scarab",
   regex: "a mi",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEZWxpcml1bSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ccb0e23ff2/LesserScarabDelirium.png",
   description: "Area contains a Mirror of Delirium",
 },
 "Delirium Scarab of Mania": {
   name: "Delirium Scarab of Mania",
   regex: "or$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJEZWxpcml1bSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/9f8ae4cdb7/NormalScarabDelirium.png",
   description: "Delirium Reward Meters fill 100% faster in Area; Delirium in Area increases 50% faster with distance from the mirror",
 },
 "Delirium Scarab of Paranoia": {
   name: "Delirium Scarab of Paranoia",
   regex: "noi",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGVsaXJpdW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c723c51ba6/GreaterScarabDelirium.png",
   description: "Delirium Encounters in Area generate 2 additional Reward types",
 },
 "Delirium Scarab of Neuroses": {
   name: "Delirium Scarab of Neuroses",
   regex: "eu",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiRGVsaXJpdW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e311aea0b6/AltGreaterScarabDelirium.png",
   description: "Delirium Encounters in Area contain all Unique Delirium Bosses; Delirium Reward Types in Area gain +1 to count on defeating a Unique Delirium Boss; Can only be used with Tier 11+ Maps",
 },
 "Delirium Scarab of Delusions": {
   name: "Delirium Scarab of Delusions",
   regex: "elu",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkRlbGlyaXVtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6416ee8493/Tier4ScarabDelirium.png",
   description: "Maps found in Area have layers of Delirium",
 },
 "Blight Scarab": {
   name: "Blight Scarab",
   regex: "a bl",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCbGlnaHQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c35814598b/LesserScarabBlight.png",
   description: "Area contains a Blight Encounter",
 },
 "Blight Scarab of the Blightheart": {
   name: "Blight Scarab of the Blightheart",
   regex: "hth",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmxpZ2h0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/cf36f28d45/GreaterScarabBlight.png",
   description: "Blight Encounters in Area have one Blighted Chest; Blight Encounters in Area spawn additional waves of Enemies; Blighted Chests in Area grow larger and more rewarding the more Blighted Enemies are slain",
 },
 "Blight Scarab of Blooming": {
   name: "Blight Scarab of Blooming",
   regex: "t-",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJsaWdodCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6dde3a6e88/Tier4ScarabBlight.png",
   description: "Blight Encounters in Area have up to 3 additional Unique Bosses; Unique enemies in Blight Encounters have 100% increased life; Tier 14+ Blighted Maps found in Area drop as Blight-Ravaged Maps instead",
 },
 "Blight Scarab of Invigoration": {
   name: "Blight Scarab of Invigoration",
   regex: "go",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkJsaWdodCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/e74a0932bd/AltTier4ScarabBlight.png",
   description: "Each Empowering Tower in Areas grants Blighted Monsters in range increased Difficulty and Reward",
 },
 "Kalguuran Scarab": {
   name: "Kalguuran Scarab",
   regex: "al o",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTZXR0bGVycyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/c14c3a7ef3/LesserScarabSettlers.png",
   description: "Area contains 2 additional Ore Deposits",
 },
 "Kalguuran Scarab of Guarded Riches": {
   name: "Kalguuran Scarab of Guarded Riches",
   regex: "f gu",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJTZXR0bGVycyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/0907b7281e/NormalScarabSettlers.png",
   description: "Monsters guarding Ore Deposits in Area are at least Magic",
 },
 "Kalguuran Scarab of Refinement": {
   name: "Kalguuran Scarab of Refinement",
   regex: "^or",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiU2V0dGxlcnMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9b76c1fb39/GreaterScarabSettlers.png",
   description: "Ore Deposits in Area grant Smelted Bars instead of Marking Ore",
 },
 "Kalguuran Scarab of Enriching": {
   name: "Kalguuran Scarab of Enriching",
   regex: "nri",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabSettlers.png",
   description: "Monsters guarding Ore Deposits have increased Difficulty and Reward and Ore Deposits contain 15% increased Ore for each Ore Deposit completed in Area",
 },
 "Trarthan Scarab": {
   name: "Trarthan Scarab",
   regex: "is i",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/LesserScarabMercenaries.png",
   description: "Area is inhabited by a Mercenary",
 },
 "Trarthan Scarab of Infamy": {
   name: "Trarthan Scarab of Infamy",
   regex: "my",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/NormalScarabMercenaries.png",
   description: "Mercenaries found in Area are Infamous; Mercenaries found in Area are accompanied by two Wild Mercenaries",
 },
 "Trarthan Scarab of Renown": {
   name: "Trarthan Scarab of Renown",
   regex: "ui",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/GreaterScarabMercenaries.png",
   description: "All Equipment Items on Mercenaries found in Area are Unique",
 },
 "Trarthan Scarab of Surprising Alliances": {
   name: "Trarthan Scarab of Surprising Alliances",
   regex: "urp",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/Tier4ScarabMercenaries.png",
   description: "Wild Rogue Exiles in Area have 50% chance to be accompanied by a Wild Mercenary; Wild Mercenaries have increased Difficulty for each Wild Mercenary in Area",
 },
 "Scarab of Monstrous Lineage": {
   name: "Scarab of Monstrous Lineage",
   regex: "^40",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJNaXNjIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d89cac7adf/LesserScarabMisc.png",
   description: "40% increased Magic Pack Size",
 },
 "Scarab of Adversaries": {
   name: "Scarab of Adversaries",
   regex: "dv",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRMZXNzZXJTY2FyYWJNaXNjIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b51199868c/AltLesserScarabMisc.png",
   description: "Area contains 4 additional Packs with Mirrored Rare Monsters",
 },
 "Scarab of Divinity": {
   name: "Scarab of Divinity",
   regex: "-t",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJNaXNjIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a4e827f718/NormalScarabMisc.png",
   description: "Up to 3 additional Rare Monsters in Area will be Pantheon-Touched; Apparitions spawned by Pantheon-Touched Monsters deal 100% increased damage",
 },
 "Scarab of Hunted Traitors": {
   name: "Scarab of Hunted Traitors",
   regex: "hu",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWlzYyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/dfed2f59a3/GreaterScarabMisc.png",
   description: "Area contains Hunted Traitors",
 },
 "Scarab of Stability": {
   name: "Scarab of Stability",
   regex: "^po",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYk1pc2MiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/42e3a0fccd/Tier4ScarabMisc.png",
   description: "Portals to Area have a 50% chance to not be consumed on use",
 },
 "Scarab of the Commander": {
   name: "Scarab of the Commander",
   regex: "^gr",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/LesserScarabMisc1.png",
   description: "Grants an additional Kirac Mission on Map Completion",
 },
 "Scarab of Evolution": {
   name: "Scarab of Evolution",
   regex: "0 m",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/LesserScarabMisc2.png",
   description: "10 Monster Packs in Area are upgraded to Magic",
 },
 "Scarab of Wisps": {
   name: "Scarab of Wisps",
   regex: "y 2",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWlzYzEiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b96cb43b23/GreaterScarabMisc1.png",
   description: "Monsters in Area have a chance to be Empowered by 2000 Wildwood Wisps",
 },
 "Scarab of the Sinistral": {
   name: "Scarab of the Sinistral",
   regex: "nis",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/GreaterScarabMisc2.png",
   description: "100% increased effect of Area Prefix Modifiers; Area Suffix Modifiers have no effect",
 },
 "Scarab of the Dextral": {
   name: "Scarab of the Dextral",
   regex: "xt",
   icon: "https://web.poecdn.com/image/Art/2DItems/Currency/Scarabs/AltGreaterScarabMisc.png",
   description: "100% increased effect of Area Suffix Modifiers; Area Prefix Modifiers have no effect",
 },
 "Scarab of Radiant Storms": {
   name: "Scarab of Radiant Storms",
   regex: "ms$",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYk1pc2MyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a1a6f9261c/Tier4ScarabMisc2.png",
   description: "Area contains a Resplendent Tempest",
 },
 "Horned Scarab of Bloodlines": {
   name: "Horned Scarab of Bloodlines",
   regex: "dl",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjEiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8f232821fa/SuperScarab1.png",
   description: "Area has 150% increased Magic Monsters; Magic Monsters in area have an additional Modifier",
 },
 "Horned Scarab of Nemeses": {
   name: "Horned Scarab of Nemeses",
   regex: " nem",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f4c8c526ba/SuperScarab2.png",
   description: "Rare Monsters in Area have 2 additional Modifiers",
 },
 "Horned Scarab of Preservation": {
   name: "Horned Scarab of Preservation",
   regex: "^ot",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ce4ee43474/SuperScarab3.png",
   description: "Other Scarabs are not consumed on use",
 },
 "Horned Scarab of Awakening": {
   name: "Horned Scarab of Awakening",
   regex: " aw",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/10856e6528/SuperScarab4.png",
   description: "Tier 16+ Areas contain the Bosses from a random Maven Invitation",
 },
 "Horned Scarab of Tradition": {
   name: "Horned Scarab of Tradition",
   regex: "trad",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c96bd21955/SuperScarab5.png",
   description: "All Rare and Unique Monsters in Area have dropped items transformed by a Reward Modifier",
 },
 "Horned Scarab of Glittering": {
   name: "Horned Scarab of Glittering",
   regex: "gl",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjYiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0f282b3a1e/SuperScarab6.png",
   description: "Players in Area gain increased Item Rarity for each Monster slain, up to 400%, decaying over time",
 },
 "Horned Scarab of Pandemonium": {
   name: "Horned Scarab of Pandemonium",
   regex: "dem",
   icon: "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjciLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/dd523e523b/SuperScarab7.png",
   description: "Monster packs in Area have a 15% chance to be replaced by a random Atlas Boss; Modifiers to the Final Map Boss also apply to these Atlas Bosses",
 },
};

export const scarabList = Object.values(scarabs);
