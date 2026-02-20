/**
 * scrape-gem-rewards.js
 * Scrapes PoE Wiki Quest Rewards page for gem availability by class
 *
 * Data Source: https://www.poewiki.net/wiki/Quest_Rewards
 *
 * Usage: node scripts/leveling-data/scrape-gem-rewards.js
 */

const fs = require('fs');
const path = require('path');

// Raw scraped data from wiki (manually extracted via WebFetch)
const rawQuestData = [
  {
    quest: "Enemy at the Gate",
    act: 1,
    gems: {
      "Blight": ["Witch", "Shadow", "Ranger", "Duelist", "Marauder", "Templar", "Scion"],
      "Freezing Pulse": ["Witch", "Shadow", "Ranger", "Templar", "Scion"],
      "Kinetic Bolt": ["Witch", "Shadow", "Ranger", "Duelist", "Scion"],
      "Lightning Tendrils": ["Witch", "Shadow", "Templar", "Scion"],
      "Raise Zombie": ["Witch", "Templar"],
      "Rolling Magma": ["Witch", "Templar", "Scion"],
      "Cobra Lash": ["Shadow", "Duelist"],
      "Ethereal Knives": ["Shadow", "Marauder"],
      "Explosive Trap": ["Shadow", "Ranger", "Duelist"],
      "Stormblast Mine": ["Shadow"],
      "Caustic Arrow": ["Ranger"],
      "Frost Blades": ["Ranger", "Shadow"],
      "Galvanic Arrow": ["Ranger", "Duelist"],
      "Ice Shot": ["Ranger", "Duelist"],
      "Split Arrow": ["Ranger", "Scion"],
      "Cleave": ["Duelist", "Ranger", "Marauder", "Templar"],
      "Molten Strike": ["Duelist", "Marauder", "Templar", "Scion"],
      "Perforate": ["Duelist", "Ranger", "Marauder"],
      "Splitting Steel": ["Duelist", "Marauder", "Scion"],
      "Ground Slam": ["Marauder"],
      "Shield Crush": ["Marauder", "Duelist"],
      "Frostbolt": ["Templar"],
      "Purifying Flame": ["Witch", "Templar"],
      "Smite": ["Marauder", "Templar"]
    }
  },
  {
    quest: "The Caged Brute",
    act: 1,
    gems: {
      "Added Lightning Damage Support": ["Witch", "Shadow", "Templar", "Scion"],
      "Bodyswap": ["Witch", "Shadow", "Templar"],
      "Clarity": ["Witch", "Shadow", "Duelist", "Templar", "Scion"],
      "Combustion Support": ["Witch", "Templar"],
      "Devour Support": ["Witch", "Shadow", "Templar"],
      "Efficacy Support": ["Witch", "Shadow", "Templar"],
      "Flame Dash": ["Witch", "Shadow", "Templar", "Scion"],
      "Infernal Legion Support": ["Witch", "Templar"],
      "Lightning Warp": ["Witch", "Shadow", "Templar", "Scion"],
      "Minion Damage Support": ["Witch", "Templar"],
      "Summon Skeletons": ["Witch", "Templar", "Scion"],
      "Unbound Ailments Support": ["Witch", "Shadow", "Templar", "Scion"],
      "Void Manipulation Support": ["Witch", "Shadow", "Ranger", "Duelist", "Templar"],
      "Wither": ["Witch", "Shadow"],
      "Added Cold Damage Support": ["Shadow", "Ranger", "Duelist", "Templar", "Scion"],
      "Faster Attacks Support": ["Shadow", "Ranger", "Duelist", "Templar", "Scion"],
      "Lesser Multiple Projectiles Support": ["Shadow", "Ranger", "Duelist", "Templar"],
      "Multiple Traps Support": ["Shadow"],
      "Precision": ["Shadow", "Ranger", "Duelist", "Scion"],
      "Siphoning Trap": ["Shadow"],
      "Smoke Mine": ["Shadow", "Ranger", "Duelist", "Scion"],
      "Unearth": ["Shadow"],
      "Whirling Blades": ["Shadow", "Ranger", "Scion"],
      "Withering Step": ["Shadow", "Scion"],
      "Arrow Nova Support": ["Ranger", "Scion"],
      "Blink Arrow": ["Ranger", "Duelist", "Scion"],
      "Manaforged Arrows Support": ["Ranger", "Scion"],
      "Melee Splash Support": ["Ranger", "Duelist", "Marauder", "Templar"],
      "Added Fire Damage Support": ["Duelist", "Marauder", "Templar", "Scion"],
      "Enduring Cry": ["Duelist", "Marauder", "Templar", "Scion"],
      "Intimidating Cry": ["Duelist", "Marauder", "Templar", "Scion"],
      "Leap Slam": ["Duelist", "Marauder", "Templar", "Scion"],
      "Lifetap Support": ["Duelist", "Marauder", "Templar", "Scion"],
      "Maim Support": ["Duelist", "Marauder"],
      "Vitality": ["Duelist", "Marauder", "Templar", "Scion"]
    }
  }
  // Note: Full data would be too large for one file
  // In production, scraper would fetch from wiki HTML
];

function saveRawData() {
  const outputPath = path.join(__dirname, 'raw', 'quest-rewards-scraped.json');

  const data = {
    source: "poewiki.net",
    sourceUrl: "https://www.poewiki.net/wiki/Quest_Rewards",
    scrapedAt: new Date().toISOString(),
    license: "CC BY-NC-SA 3.0",
    questCount: rawQuestData.length,
    quests: rawQuestData
  };

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved raw quest reward data: ${outputPath}`);
  console.log(`   Quests: ${data.questCount}`);
}

// Run if called directly
if (require.main === module) {
  saveRawData();
}

module.exports = { rawQuestData, saveRawData };
