/*
 * threadData.js: every PoE 1 Thread (3.30 Covens of Umbra replacement for Scarabs).
 *
 * GENERATED 2026-11-15 by scripts/atlas-data/scrape-threads.js for patch 3.30.0b.
 * Do not hand-edit; re-run the script.
 *
 * Sources: poedb.tw/us/<Thread name> (item text, stack size, drop level),
 * poedb.tw/us/Random_<Mechanic>_Thread_Modifiers (random-effect keyword text),
 * poe.ninja type=Thread for league "Covens" (icons, ids).
 * Patch notes: https://www.pathofexile.com/forum/view-thread/4013680
 * "Scarabs have been removed from the game. A new item type, Threads, have
 * been added in their place."
 *
 * 10 Threads + Frayed Thread. Threads have no tiers. randomEffects are
 * the in-game keyword-popup lines (verbatim); at least one applies per map and
 * more Threads of one type raise the chance of several applying.
 *
 * No regex fields yet: fragments are owned by regex-smith and must be unique
 * across each item's whole searchable text (name + description line).
 */

export const THREAD_PATCH = "3.30.0b";

export const THREAD_RANDOM_EFFECT_RULE = "At least one Modifier will always apply when spending Threads. Spending more Threads improves the chances of multiple Modifiers applying.";

export const THREAD_USAGE = "Can be used in a personal Map Device to add content to a Map.";

export const threads = [
  {
    "name": "Abyss Thread",
    "mechanic": "Abyss",
    "description": "Threads Abysses into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "abyss-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9BYnlzc1RocmVhZCIsInNjYWxlIjoxfV0/fa2302d9d4/AbyssThread.png",
    "randomEffects": [
      "An Abyssal Pit in the area will spawn an Abyssal Consort.",
      "Area will contain additional Abyssal Pits. This Modifier can occur up to three times.",
      "Rare Monsters spawned by Abyssal Pits will spawn in pairs.",
      "Abyssal Pits will fire Mortars which spawn Bone Hoarders on impact.",
      "Rare Monsters spawned by Abyssal Pits will have an additional Abyssal Modifier."
    ],
    "source": "https://poedb.tw/us/Abyss_Thread"
  },
  {
    "name": "Bestiary Thread",
    "mechanic": "Bestiary",
    "description": "Threads capturable Beasts into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "bestiary-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9CZXN0aWFyeVRocmVhZCIsInNjYWxlIjoxfV0/7fd44c21e8/BestiaryThread.png",
    "randomEffects": [
      "Area contains additional Red Beasts.",
      "Area is invaded a large number of Red Beasts.",
      "Area contains the Black Mórrigan.",
      "Area contains additional Sacred Fauna Red Beasts.",
      "Yellow and Red Beasts are empowered by Wildwood Wisps of all types.",
      "Enemies near Einhar explode on death, dealing 25% of their maximum Life as Physical Damage.",
      "Yellow Beasts in area are Nameless Beasts."
    ],
    "source": "https://poedb.tw/us/Bestiary_Thread"
  },
  {
    "name": "Betrayal Thread",
    "mechanic": "Betrayal",
    "description": "Threads the Immortal Syndicate into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "betrayal-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9CZXRyYXlhbFRocmVhZCIsInNjYWxlIjoxfV0/fa10b037f1/BetrayalThread.png",
    "randomEffects": [
      "Catarina will accompany a Syndicate Encounter in the Area.",
      "Dealing with downed Syndicate members will apply powerful Buffs to all Players and Mercenaries in the Area.",
      "Catarina's Corpse Sculpture will appear somewhere in the Area.",
      "Syndicate Members will have an additional Rare Monster modifier.",
      "Veiled Items dropped in Area will have their Veiled Modifier Fractured.",
      "Area will contain many additional clusters of barrels and chests from Syndicate Safehouses."
    ],
    "source": "https://poedb.tw/us/Betrayal_Thread"
  },
  {
    "name": "Blight Thread",
    "mechanic": "Blight",
    "description": "Threads a Blight Encounter into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "blight-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9CbGlnaHRUaHJlYWQiLCJzY2FsZSI6MX1d/add7a8099e/BlightThread.png",
    "randomEffects": [
      "Blight Pump and Towers will spawn friendly Pustules which provide powerful Auras",
      "Up to 2 lanes will be Mycotic",
      "The Blight Pump will spawn a miniboss when successfully defended, with more and better rewards the more Blight enemies defeated in the encounter",
      "Blight towers will have no cost to construct and upgrade",
      "Monsters spawned by one lane of the Blight encounter will be replaced with rolling currency Monsters",
      "Monsters spawned by one lane of the Blight encounter will be replaced by Rogue Exiles, each of which will always drop a Unique item",
      "Blight Pump will be replaced by a slumbering Pantheon God, who will awaken when successfully defended. This God will have more and better drops the more Blight Enemies slain during the encounter, and at least one Rare monster in the Blight encounter will be Pantheon-Touched."
    ],
    "source": "https://poedb.tw/us/Blight_Thread"
  },
  {
    "name": "Breach Thread",
    "mechanic": "Breach",
    "description": "Threads Breaches into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "breach-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9CcmVhY2hUaHJlYWQiLCJzY2FsZSI6MX1d/d600d1d343/BreachThread.png",
    "randomEffects": [
      "Breach Hives in Area lead to a Hive Fortress.",
      "Unstable Breaches in Area contain a Boss.",
      "Area contains an additional Unstable Breach. This Modifier can occur up to three times.",
      "Rare Breach monsters will drop an additional Wombgift when killed.",
      "Area contains an additional Genesis Tree Sapling.",
      "Breach Hive and Fortress encounters will contain additional Breach Coffers.",
      "Rare Breach Monsters will have an additional Breach Modifier.",
      "Ailith's skills in area will be empowered."
    ],
    "source": "https://poedb.tw/us/Breach_Thread"
  },
  {
    "name": "Expedition Thread",
    "mechanic": "Expedition",
    "description": "Threads an Expedition Encounter into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "expedition-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9FeHBlZGl0aW9uVGhyZWFkIiwic2NhbGUiOjF9XQ/9541c89bf9/ExpeditionThread.png",
    "randomEffects": [
      "Expedition Encounter in area will be massively larger.",
      "All Runic Monsters in Expedition Encounter will be at least Rare",
      "A Runic Obelisk will spawn as part of the Expedition Encounter, which can revive all Rare and Magic Expedition Monsters when activated.",
      "Expedition Encounter will contain at least one unearthable chest which will drop a Logbook.",
      "Expedition Encounter will contain Runic markers for Runic Lieutenants, powerful monsters which drop extra reroll currencies when slain.",
      "Remnants in Expedition Encounter will have additional upside affixes."
    ],
    "source": "https://poedb.tw/us/Expedition_Thread"
  },
  {
    "name": "Incursion Thread",
    "mechanic": "Incursion",
    "description": "Threads Temporal Incursions into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "incursion-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9JbmN1cnNpb25UaHJlYWQiLCJzY2FsZSI6MX1d/c727d5bfc4/IncursionThread.png",
    "randomEffects": [
      "Doors can be golden, upgrading the tier of the connected room when opened.",
      "Rooms contain an object that opens all locked doors.",
      "Rooms contain Vaal Vessels.",
      "Rooms contain Gold Piles.",
      "Rooms contain Cursed Treasures which drop stacks of currency when claimed, but reduce remaining Incursion time.",
      "Rooms contain a Vaal Flesh Merchant."
    ],
    "source": "https://poedb.tw/us/Incursion_Thread"
  },
  {
    "name": "Legion Thread",
    "mechanic": "Legion",
    "description": "Threads Legion Encounters into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "legion-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9MZWdpb25UaHJlYWQiLCJzY2FsZSI6MX1d/819bd1a22b/LegionThread.png",
    "randomEffects": [
      "Area contains additional Legion Encounters.",
      "Both Legions have Generals.",
      "All Chests are replaced with War Hoards.",
      "Legion battlefield is carpeted with purple crystals. When high ranking Legion monsters die they will shatter nearby crystals, dropping items.",
      "Lower rank Legion monsters are upgraded to a higher rank.",
      "High ranking Legion monsters are placed close to the Monolith.",
      "Legion Monsters can be broken out of Stasis multiple times, increasing their Difficulty and Reward for each time they are broken out."
    ],
    "source": "https://poedb.tw/us/Legion_Thread"
  },
  {
    "name": "Ritual Thread",
    "mechanic": "Ritual",
    "description": "Threads Ritual Altars into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "ritual-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9SaXR1YWxUaHJlYWQiLCJzY2FsZSI6MX1d/ec35a48af4/RitualThread.png",
    "randomEffects": [
      "Rituals in area will be Nameless.",
      "Rituals in area will spawn a friendly wisp. Standing near the wisp will cause you to gain increased Tribute from slain Enemies.",
      "The final Ritual will transform into a Bodach's Ritual on completion, which can then be run again for further Tribute.",
      "Completing a Ritual encounter in area will grant all players a Blood Shrine buff.",
      "The final Ritual encounter in area will allow you to sacrifice your Tribute to call forth a champion of the King."
    ],
    "source": "https://poedb.tw/us/Ritual_Thread"
  },
  {
    "name": "Ultimatum Thread",
    "mechanic": "Ultimatum",
    "description": "Threads an Ultimatum Encounter into an Area",
    "stackSize": 100,
    "dropLevel": 68,
    "ninjaId": "ultimatum-thread",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvVGhyZWFkcy9VbHRpbWF0dW1UaHJlYWQiLCJzY2FsZSI6MX1d/74155b9b4e/UltimatumThread.png",
    "randomEffects": [
      "All rewards offered by the Ultimatum Encounter will be Inscribed Ultimatums.",
      "All rewards offered by the Ultimatum Encounter will be Catalysts.",
      "The Ultimatum Encounter will lead to the Trialmaster.",
      "The Ultimatum Encounter will spawn a beating heart every round. Defeating this heart will grant Adrenaline to all players and mercenaries in the area for a duration.",
      "The Ultimatum Encounter will allow you to Double Down at round 7 or 8.",
      "The Ultimatum Encounter will spawn Cursed Currency every round, which can be claimed. Claiming it will add random Currency rewards to your collected rewards so far.",
      "The Ultimatum Encounter will spawn with a nearby Soul Core. Claiming the Soul Core will cause all Ultimatum Encounter types to complete more quickly, but can empower Ultimatum Enemies.",
      "The Ultimatum Encounter will offer secondary upsides for each round alongside the usual difficulty Modifiers."
    ],
    "source": "https://poedb.tw/us/Ultimatum_Thread"
  }
];

export const frayedThread = {
  "name": "Frayed Thread",
  "description": "A collection of unknown Threads",
  "usage": "Right click to reveal a random Thread.",
  "stackSize": 20,
  "dropLevel": 1,
  "ninjaId": "frayed-thread",
  "icon": "https://web.poecdn.com/image/Art/2DItems/Currency/Threads/FrayedThread.png",
  "source": "https://poedb.tw/us/Frayed_Thread"
};
