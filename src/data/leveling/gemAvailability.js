/**
 * gemAvailability.js
 * Gem quest reward data merged with gem icons
 * Generated: 2026-02-20T18:47:36.075Z
 *
 * Data sources:
 * - Quest rewards: https://www.poewiki.net/wiki/Quest_Rewards
 * - Gem icons: src/data/gemData.js (web.poecdn.com)
 *
 * Special vendors:
 * - Siosa (Act 3): Removes class restrictions
 * - Lilly Roth (Act 6): All gems available
 */

export const gemAvailabilityData = {
  "Blight": {
    "gemId": "blight",
    "name": "Blight",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGlnaHRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0a44062dbd/BlightGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Freezing Pulse": {
    "gemId": "freezing_pulse",
    "name": "Freezing Pulse",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GcmVlemluZ1B1bHNlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d9aac05cb3/FreezingPulse.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Kinetic Bolt": {
    "gemId": "kinetic_bolt",
    "name": "Kinetic Bolt",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9aaWdaYWdXYW5kU2tpbGwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/1600c27b5e/ZigZagWandSkill.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Tendrils": {
    "gemId": "lightning_tendrils",
    "name": "Lightning Tendrils",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodGVuaW5nVG91Y2giLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7304d6b566/LighteningTouch.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Raise Zombie": {
    "gemId": "raise_zombie",
    "name": "Raise Zombie",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWlzZVpvbWJpZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d2ccaa0005/RaiseZombie.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rolling Magma": {
    "gemId": "rolling_magma",
    "name": "Rolling Magma",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlTW9ydGFyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/be522dcc70/FireMortar.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cobra Lash": {
    "gemId": "cobra_lash",
    "name": "Cobra Lash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db2JyYUxhc2giLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ea26a93e24/CobraLash.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Shadow",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ethereal Knives": {
    "gemId": "ethereal_knives",
    "name": "Ethereal Knives",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FdGhlcmVhbEtuaXZlcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b354023ac5/EtherealKnives.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Shadow",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Explosive Trap": {
    "gemId": "explosive_trap",
    "name": "Explosive Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaHJhcG5lbFRyYXAiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ffcb4ea378/ShrapnelTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Stormblast Mine": {
    "gemId": "stormblast_mine",
    "name": "Stormblast Mine",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdFeHBsb3Npb25NaW5lU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6a6ceb8e5e/LightningExplosionMineSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Caustic Arrow": {
    "gemId": "caustic_arrow",
    "name": "Caustic Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Qb2lzb25BcnJvdyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d9f7c19c93/PoisonArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frost Blades": {
    "gemId": "frost_blades",
    "name": "Frost Blades",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VTdHJpa2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/774fcc77d9/IceStrike.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Ranger",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Galvanic Arrow": {
    "gemId": "galvanic_arrow",
    "name": "Galvanic Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaHJhcG5lbFNob3QiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/55dac240a3/ShrapnelShot.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ice Shot": {
    "gemId": "ice_shot",
    "name": "Ice Shot",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VTaG90IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bab7c309db/IceShot.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Split Arrow": {
    "gemId": "split_arrow",
    "name": "Split Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TcGxpdEFycm93IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/dc5a7841eb/SplitArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cleave": {
    "gemId": "cleave",
    "name": "Cleave",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DbGVhdmUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/bde92a3edc/Cleave.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Duelist",
          "Ranger",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Molten Strike": {
    "gemId": "molten_strike",
    "name": "Molten Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Nb2x0ZW5TdHJpa2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/cf165ed041/MoltenStrike.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Perforate": {
    "gemId": "perforate",
    "name": "Perforate",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbG9vZFNhbmRTcGVhcnNTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/01afec4499/BloodSandSpearsSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Duelist",
          "Ranger",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Splitting Steel": {
    "gemId": "splitting_steel",
    "name": "Splitting Steel",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JbXBhY3RpbmdTdGVlbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1e9b9d92fc/ImpactingSteelGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ground Slam": {
    "gemId": "ground_slam",
    "name": "Ground Slam",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Hcm91bmRzbGFtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/2307ca240d/Groundslam.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shield Crush": {
    "gemId": "shield_crush",
    "name": "Shield Crush",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaGllbGRDcnVzaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6f73431f58/ShieldCrush.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Marauder",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frostbolt": {
    "gemId": "frostbolt",
    "name": "Frostbolt",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm9zdEJvbHQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/621b60db0f/FrostBolt.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Purifying Flame": {
    "gemId": "purifying_flame",
    "name": "Purifying Flame",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QdXJpZnlpbmdGbGFtZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/e933be7d7c/PurifyingFlame.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Smite": {
    "gemId": "smite",
    "name": "Smite",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TbWl0ZUdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/080c458cfe/SmiteGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Enemy at the Gate",
        "questId": "a1q1",
        "classes": [
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Added Lightning Damage Support": {
    "gemId": "added_lightning_damage_support",
    "name": "Added Lightning Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0FkZGVkTGlnaHRuaW5nRGFtYWdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/2d0e496d25/AddedLightningDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bodyswap": {
    "gemId": "bodyswap",
    "name": "Bodyswap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db3Jwc2VXYXJwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/41ea9146ad/CorpseWarp.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Clarity": {
    "gemId": "clarity",
    "name": "Clarity",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DbGFyaXR5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6a0df6b3db/Clarity.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Combustion Support": {
    "gemId": "combustion_support",
    "name": "Combustion Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NoYW5jZXRvSWduaXRlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b24521e59a/ChancetoIgnite.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Devour Support": {
    "gemId": "devour_support",
    "name": "Devour Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Rldm91ciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/3c8b4acc1b/Devour.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Efficacy Support": {
    "gemId": "efficacy_support",
    "name": "Efficacy Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0VmZmljYWN5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/90381ee91a/Efficacy.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flame Dash": {
    "gemId": "flame_dash",
    "name": "Flame Dash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGFtZURhc2giLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/09b5080831/FlameDash.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Infernal Legion Support": {
    "gemId": "infernal_legion_support",
    "name": "Infernal Legion Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0luZmVybmFsTGVnaW9uU3VwcG9ydEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/461a9b10aa/InfernalLegionSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Warp": {
    "gemId": "lightning_warp",
    "name": "Lightning Warp",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdXYXJwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ca350bc087/LightningWarp.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Minion Damage Support": {
    "gemId": "minion_damage_support",
    "name": "Minion Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01pbmlvbkRhbWFnZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/9bf4329029/MinionDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Skeletons": {
    "gemId": "summon_skeletons",
    "name": "Summon Skeletons",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdW1tb25Ta2VsZXRvbnMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/525a095090/SummonSkeletons.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Unbound Ailments Support": {
    "gemId": "unbound_ailments_support",
    "name": "Unbound Ailments Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1VuYm91bmRBaWxtZW50cyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/a5ce74c4dc/UnboundAilments.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Void Manipulation Support": {
    "gemId": "void_manipulation_support",
    "name": "Void Manipulation Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1ZvaWRNYW5pcHVsYXRpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/d43a79f597/VoidManipulation.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Wither": {
    "gemId": "wither",
    "name": "Wither",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XaXRoZXJHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/54682a18f1/WitherGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Added Cold Damage Support": {
    "gemId": "added_cold_damage_support",
    "name": "Added Cold Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0FkZGVkQ29sZERhbWFnZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2da648ff1b/AddedColdDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Faster Attacks Support": {
    "gemId": "faster_attacks_support",
    "name": "Faster Attacks Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Zhc3RlckF0dGFja3MiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c3e1544a95/FasterAttacks.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lesser Multiple Projectiles Support": {
    "gemId": "lesser_multiple_projectiles_support",
    "name": "Lesser Multiple Projectiles Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0xlc3Nlck11bHRpcGxlUHJvamVjdGlsZXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/db32a787d3/LesserMultipleProjectiles.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Multiple Traps Support": {
    "gemId": "multiple_traps_support",
    "name": "Multiple Traps Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L011bHRpVHJhcCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/40a7787dff/MultiTrap.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Precision": {
    "gemId": "precision",
    "name": "Precision",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BY2N1cmFjeWFuZENyaXRpY2FsQ2hhbmNlQXVyYSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/e8f00e99b6/AccuracyandCriticalChanceAura.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Siphoning Trap": {
    "gemId": "siphoning_trap",
    "name": "Siphoning Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VTaXBob24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/44fa5ecfdc/IceSiphon.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Smoke Mine": {
    "gemId": "smoke_mine",
    "name": "Smoke Mine",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TbW9rZUJvbWIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/d27417fe55/SmokeBomb.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Unearth": {
    "gemId": "unearth",
    "name": "Unearth",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Cb25lTGFuY2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a62305b654/BoneLance.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Whirling Blades": {
    "gemId": "whirling_blades",
    "name": "Whirling Blades",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XaGlybGluZ0JsYWRlcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f518fbded3/WhirlingBlades.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Withering Step": {
    "gemId": "withering_step",
    "name": "Withering Step",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XaXRoZXJpbmdTdGVwR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/9f7784c2fa/WitheringStepGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arrow Nova Support": {
    "gemId": "arrow_nova_support",
    "name": "Arrow Nova Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0dyZWVuUmFpblN1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/127eda6207/GreenRainSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blink Arrow": {
    "gemId": "blink_arrow",
    "name": "Blink Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGlua0Fycm93IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/3d3f2cbd98/BlinkArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Manaforged Arrows Support": {
    "gemId": "manaforged_arrows_support",
    "name": "Manaforged Arrows Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0FyY2FuZUFyY2hlclN1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/5258fad72b/ArcaneArcherSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Melee Splash Support": {
    "gemId": "melee_splash_support",
    "name": "Melee Splash Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NwbGFzaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/739d21a3fc/Splash.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Added Fire Damage Support": {
    "gemId": "added_fire_damage_support",
    "name": "Added Fire Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0FkZGVkRmlyZURhbWFnZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/021b8c80d0/AddedFireDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Enduring Cry": {
    "gemId": "enduring_cry",
    "name": "Enduring Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbmR1cmluZ0NyeSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/289ef19ddf/EnduringCry.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Intimidating Cry": {
    "gemId": "intimidating_cry",
    "name": "Intimidating Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JbnRpbWlkYXRpbmdDcnkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4a29f84dd1/IntimidatingCry.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Leap Slam": {
    "gemId": "leap_slam",
    "name": "Leap Slam",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MZWFwU2xhbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d19c385b00/LeapSlam.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lifetap Support": {
    "gemId": "lifetap_support",
    "name": "Lifetap Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0xpZmVUYXAiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9cef38ae47/LifeTap.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Maim Support": {
    "gemId": "maim_support",
    "name": "Maim Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01haW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/dc8062db46/Maim.png",
    "type": "support",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vitality": {
    "gemId": "vitality",
    "name": "Vitality",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9WaXRhbGl0eSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ce80bbd0af/Vitality.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Caged Brute",
        "questId": "a1q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arc": {
    "gemId": "arc",
    "name": "Arc",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BcmMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b906e66011/Arc.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blazing Salvo": {
    "gemId": "blazing_salvo",
    "name": "Blazing Salvo",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbWJlciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1c2a784fb0/Ember.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Creeping Frost": {
    "gemId": "creeping_frost",
    "name": "Creeping Frost",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BcmN0aWNCcmVhdGgiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7e13902453/ArcticBreath.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Essence Drain": {
    "gemId": "essence_drain",
    "name": "Essence Drain",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaXBob25HZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/1eb70dbdc2/SiphonGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flesh Offering": {
    "gemId": "flesh_offering",
    "name": "Flesh Offering",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGVzaE9mZmVyaW5nIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bfdcecf055/FleshOffering.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ice Nova": {
    "gemId": "ice_nova",
    "name": "Ice Nova",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VOb3ZhIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b54ea7d9b5/IceNova.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Manabond": {
    "gemId": "manabond",
    "name": "Manabond",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9NYW5hVm9pZEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6863b15772/ManaVoidGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Scorching Ray": {
    "gemId": "scorching_ray",
    "name": "Scorching Ray",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlQmVhbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/71cb83b533/FireBeam.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Volatile Dead": {
    "gemId": "volatile_dead",
    "name": "Volatile Dead",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Wb2xhdGlsZURlYWQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/91c658c9d2/VolatileDead.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blade Vortex": {
    "gemId": "blade_vortex",
    "name": "Blade Vortex",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TcGlubmluZ0V0aGVyZWFsQmxhZGVzR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b3a08a5b58/SpinningEtherealBladesGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fire Trap": {
    "gemId": "fire_trap",
    "name": "Fire Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlVHJhcCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/c120766d28/FireTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Icicle Mine": {
    "gemId": "icicle_mine",
    "name": "Icicle Mine",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db2xkUHJvamVjdGlsZU1pbmVTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4df6a42adc/ColdProjectileMineSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Trap": {
    "gemId": "lightning_trap",
    "name": "Lightning Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdUcmFwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/2cf1863851/LightningTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Reave": {
    "gemId": "reave",
    "name": "Reave",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SZWF2ZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f8a8d1820d/Reave.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Venom Gyre": {
    "gemId": "venom_gyre",
    "name": "Venom Gyre",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TbmFwcGluZ0FkZGVyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d27b7baa8a/SnappingAdder.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Voltaxic Burst": {
    "gemId": "voltaxic_burst",
    "name": "Voltaxic Burst",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Wb2lkYnVyc3RTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/fa12989faf/VoidburstSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Elemental Hit": {
    "gemId": "elemental_hit",
    "name": "Elemental Hit",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbGVtZW50YWxoaXQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0d2ee78c79/Elementalhit.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Arrow": {
    "gemId": "lightning_arrow",
    "name": "Lightning Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdBcnJvdyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/008dff6253/LightningArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Strike": {
    "gemId": "lightning_strike",
    "name": "Lightning Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdTdHJpa2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c48bce985e/LightningStrike.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Poisonous Concoction": {
    "gemId": "poisonous_concoction",
    "name": "Poisonous Concoction",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Qb2lzb25vdXNDb25jb2N0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b55affb0e3/PoisonousConcoction.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rain of Arrows": {
    "gemId": "rain_of_arrows",
    "name": "Rain of Arrows",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWlub2ZBcnJvd3MiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a405696639/RainofArrows.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Siege Ballista": {
    "gemId": "siege_ballista",
    "name": "Siege Ballista",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Dcm9zc0Jvd1RvdGVtR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ab7ce277f5/CrossBowTotemGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Toxic Rain": {
    "gemId": "toxic_rain",
    "name": "Toxic Rain",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWlub2ZTcG9yZXNHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/bed5edae82/RainofSporesGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Earthshatter": {
    "gemId": "earthshatter",
    "name": "Earthshatter",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TcGlrZVNsYW1HZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/121f69909a/SpikeSlamGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lacerate": {
    "gemId": "lacerate",
    "name": "Lacerate",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Eb3VibGVTbGFzaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f87e49aab5/DoubleSlash.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shattering Steel": {
    "gemId": "shattering_steel",
    "name": "Shattering Steel",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaGF0dGVyaW5nU3RlZWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/291dd53715/ShatteringSteel.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sweep": {
    "gemId": "sweep",
    "name": "Sweep",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Td2VlcCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1049a55451/Sweep.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Volcanic Fissure": {
    "gemId": "volcanic_fissure",
    "name": "Volcanic Fissure",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Wb2xjYW5pY0Zpc3N1cmVTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/7419b5de33/VolcanicFissureSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Chain Hook": {
    "gemId": "chain_hook",
    "name": "Chain Hook",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaGFpblN0cmlrZUdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/8be08490b0/ChainStrikeGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Infernal Blow": {
    "gemId": "infernal_blow",
    "name": "Infernal Blow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JbmZlcm5hbEJsb3ciLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/063e846474/InfernalBlow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Static Strike": {
    "gemId": "static_strike",
    "name": "Static Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdGF0aWNHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/bbf408d2d0/StaticGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sunder": {
    "gemId": "sunder",
    "name": "Sunder",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaG9ja3dhdmVTbGFtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/acaa01df06/ShockwaveSlam.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Absolution": {
    "gemId": "absolution",
    "name": "Absolution",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BYnNvbHV0aW9uQmxhc3RHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2332f7477e/AbsolutionBlastGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Armageddon Brand": {
    "gemId": "armageddon_brand",
    "name": "Armageddon Brand",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Bcm1hZ2VkZG9uQnJhbmQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2949aac373/ArmageddonBrand.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Consecrated Path": {
    "gemId": "consecrated_path",
    "name": "Consecrated Path",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Ib2x5UGF0aEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/02319ba7c4/HolyPathGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Divine Ire": {
    "gemId": "divine_ire",
    "name": "Divine Ire",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EaXZpbmVUZW1wZXN0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/fdb39b3013/DivineTempest.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Dominating Blow": {
    "gemId": "dominating_blow",
    "name": "Dominating Blow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Eb21pbmF0aW5nQmxvdyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/430c8d6403/DominatingBlow.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Firestorm": {
    "gemId": "firestorm",
    "name": "Firestorm",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlc3Rvcm0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/fc6447dde0/Firestorm.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flameblast": {
    "gemId": "flameblast",
    "name": "Flameblast",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaGFyZ2VkQmxhc3QiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/fd178bf46d/ChargedBlast.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Penance Brand": {
    "gemId": "penance_brand",
    "name": "Penance Brand",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QZW5hbmNlQnJhbmRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/644fc3d6eb/PenanceBrandGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shock Nova": {
    "gemId": "shock_nova",
    "name": "Shock Nova",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaG9ja05vdmEiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e070637129/ShockNova.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shockwave Totem": {
    "gemId": "shockwave_totem",
    "name": "Shockwave Totem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaG9ja3dhdmVUb3RlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b2e5b61135/ShockwaveTotem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Stormbind": {
    "gemId": "stormbind",
    "name": "Stormbind",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdG9ybWJpbmRTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/13428dbd43/StormbindSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "The Siren's Cadence",
        "questId": "a1q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Contagion": {
    "gemId": "contagion",
    "name": "Contagion",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db250YWdpb25HZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/5188412ca0/ContagionGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Detonate Dead": {
    "gemId": "detonate_dead",
    "name": "Detonate Dead",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZXRvbmF0ZURlYWQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e365aeda14/DetonateDead.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flame Wall": {
    "gemId": "flame_wall",
    "name": "Flame Wall",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJld2FsbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/93fe8f55b5/Firewall.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frost Bomb": {
    "gemId": "frost_bomb",
    "name": "Frost Bomb",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm9zdEJvbWIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/1faf60898d/FrostBomb.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frostblink": {
    "gemId": "frostblink",
    "name": "Frostblink",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm9zdGJsaW5rU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/03a84470ab/FrostblinkSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Orb of Storms": {
    "gemId": "orb_of_storms",
    "name": "Orb of Storms",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdG9ybUNsb3VkR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/31f1a50da2/StormCloudGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Raging Spirit": {
    "gemId": "summon_raging_spirit",
    "name": "Summon Raging Spirit",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdW1tb25FbGVtZW50YWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/862a0d0d1b/SummonElemental.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bear Trap": {
    "gemId": "bear_trap",
    "name": "Bear Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CZWFyVHJhcCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/fcffffae90/BearTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Dash": {
    "gemId": "dash",
    "name": "Dash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9RdWlja0Rhc2hHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4b70be74a0/QuickDashGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Puncture": {
    "gemId": "puncture",
    "name": "Puncture",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QdW5jdHVyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/58723693f4/Puncture.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shrapnel Ballista": {
    "gemId": "shrapnel_ballista",
    "name": "Shrapnel Ballista",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaG90Z3VuVG90ZW1Cb3dTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/0dbbf20a13/ShotgunTotemBowSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sniper's Mark": {
    "gemId": "sniper_s_mark",
    "name": "Sniper's Mark",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Qcm9qZWN0aWxlV2Vha25lc3MiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/92040afb2a/ProjectileWeakness.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blood and Sand": {
    "gemId": "blood_and_sand",
    "name": "Blood and Sand",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbG9vZFNhbmRTdGFuY2VHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/252f9a3a0b/BloodSandStanceGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Crushing Fist": {
    "gemId": "crushing_fist",
    "name": "Crushing Fist",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DcnVzaGluZ0Zpc3RTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f941a48bca/CrushingFistSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Decoy Totem": {
    "gemId": "decoy_totem",
    "name": "Decoy Totem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZWNveVRvdGVtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7b021afefc/DecoyTotem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shield Charge": {
    "gemId": "shield_charge",
    "name": "Shield Charge",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TaGllbGRDaGFyZ2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6d2723f822/ShieldCharge.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vigilant Strike": {
    "gemId": "vigilant_strike",
    "name": "Vigilant Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9WaWdpbGFudFN0cmlrZUdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/818895553d/VigilantStrikeGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "War Banner": {
    "gemId": "war_banner",
    "name": "War Banner",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XYXJiYW5uZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/97486403a5/Warbanner.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Steelskin": {
    "gemId": "steelskin",
    "name": "Steelskin",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9RdWlja0d1YXJkR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/098be34a5b/QuickGuardGem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Holy Flame Totem": {
    "gemId": "holy_flame_totem",
    "name": "Holy Flame Totem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGFtZVRvdGVtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e8cfc28b9a/FlameTotem.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Holy Relic": {
    "gemId": "summon_holy_relic",
    "name": "Summon Holy Relic",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Ib2x5UmVsaWMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/a697b9d95a/HolyRelic.png",
    "type": "active",
    "availability": [
      {
        "act": 1,
        "source": "quest",
        "questName": "Breaking Some Eggs",
        "questId": "a1q4",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Concentrated Effect Support": {
    "gemId": "concentrated_effect_support",
    "name": "Concentrated Effect Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NvbmNlbnRyYXRlZEFPRSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4db641d292/ConcentratedAOE.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Controlled Destruction Support": {
    "gemId": "controlled_destruction_support",
    "name": "Controlled Destruction Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NvbnRyb2xsZWREZXN0cnVjdGlvbkdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/0fca4292bb/ControlledDestructionGem.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cruelty Support": {
    "gemId": "cruelty_support",
    "name": "Cruelty Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZyYWdpbGl0eSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/85392d054c/Fragility.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Elemental Focus Support": {
    "gemId": "elemental_focus_support",
    "name": "Elemental Focus Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0VsZW1lbnRhbEZvY3VzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/89a3556bad/ElementalFocus.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Faster Casting Support": {
    "gemId": "faster_casting_support",
    "name": "Faster Casting Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Zhc3RlckNhc3QiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4a65f03270/FasterCast.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fresh Meat Support": {
    "gemId": "fresh_meat_support",
    "name": "Fresh Meat Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZyZXNoTWVhdCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/aad1cf4139/FreshMeat.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Kinetic Instability Support": {
    "gemId": "kinetic_instability_support",
    "name": "Kinetic Instability Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0tpbmV0aWNJbnN0YWJpbGl0eVN1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/c6d844a555/KineticInstabilitySupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Living Lightning Support": {
    "gemId": "living_lightning_support",
    "name": "Living Lightning Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0xpdmluZ0xpZ2h0bmluZ1N1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/91576fc0e7/LivingLightningSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Minion Speed Support": {
    "gemId": "minion_speed_support",
    "name": "Minion Speed Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01pbmlvblNwZWVkIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/83f397f71b/MinionSpeed.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Overcharge Support": {
    "gemId": "overcharge_support",
    "name": "Overcharge Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1B1cmVTaG9ja1N1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/161c06a8d4/PureShockSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Predator Support": {
    "gemId": "predator_support",
    "name": "Predator Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01pbmlvbkZvY3VzRmlyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/84babeb963/MinionFocusFire.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sacred Wisps Support": {
    "gemId": "sacred_wisps_support",
    "name": "Sacred Wisps Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1dhbmRXaXNwU3VwcG9ydCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/20976859e1/WandWispSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Trinity Support": {
    "gemId": "trinity_support",
    "name": "Trinity Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1RyaW5pdHlTdXBwb3J0R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/f547899752/TrinitySupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Deadly Ailments Support": {
    "gemId": "deadly_ailments_support",
    "name": "Deadly Ailments Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0RlYWRseUFpbG1lbnRzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/04acd7af7d/DeadlyAilments.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Melee Physical Damage Support": {
    "gemId": "melee_physical_damage_support",
    "name": "Melee Physical Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0luY3JlYXNlZFBoeXNpY2FsRGFtYWdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/99e02beaac/IncreasedPhysicalDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Shadow",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Nightblade Support": {
    "gemId": "nightblade_support",
    "name": "Nightblade Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L05pZ2h0YmxhZGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ffa3ac8f49/Nightblade.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Trap and Mine Damage Support": {
    "gemId": "trap_and_mine_damage_support",
    "name": "Trap and Mine Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1RyYXBBbmRNaW5lRGFtYWdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/83b5eac9be/TrapAndMineDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Close Combat Support": {
    "gemId": "close_combat_support",
    "name": "Close Combat Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Nsb3NlQ29tYmF0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/812599bf67/CloseCombat.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Elemental Damage with Attacks Support": {
    "gemId": "elemental_damage_with_attacks_support",
    "name": "Elemental Damage with Attacks Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1dlYXBvbkVsZW1lbnRhbERhbWFnZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2cfbdc80b2/WeaponElementalDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vicious Projectiles Support": {
    "gemId": "vicious_projectiles_support",
    "name": "Vicious Projectiles Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1JhbmdlZFBoeXNpY2FsQXR0YWNrRGFtYWdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ad10efb4f6/RangedPhysicalAttackDamage.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rage Support": {
    "gemId": "rage_support",
    "name": "Rage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1JhZ2VTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ed66060764/RageSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sadism Support": {
    "gemId": "sadism_support",
    "name": "Sadism Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NhZGlzbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/13cc734252/Sadism.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Shockwave Support": {
    "gemId": "shockwave_support",
    "name": "Shockwave Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1Nob2Nrd2F2ZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/891f9888bb/Shockwave.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Volatility Support": {
    "gemId": "volatility_support",
    "name": "Volatility Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1ZvbGF0aWxpdHkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/89efd990e3/Volatility.png",
    "type": "support",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Sharp and Cruel",
        "questId": "a2q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arcane Cloak": {
    "gemId": "arcane_cloak",
    "name": "Arcane Cloak",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BcmNhbmVDbG9hayIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1183c052ce/ArcaneCloak.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arctic Armour": {
    "gemId": "arctic_armour",
    "name": "Arctic Armour",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VTaGllbGQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2a0b695943/IceShield.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cold Snap": {
    "gemId": "cold_snap",
    "name": "Cold Snap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db2xkU25hcCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4fb5b10f79/ColdSnap.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Desecrate": {
    "gemId": "desecrate",
    "name": "Desecrate",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZXNlY3JhdGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7e2985eec3/Desecrate.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Galvanic Field": {
    "gemId": "galvanic_field",
    "name": "Galvanic Field",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9HYWx2YW5pY0ZpZWxkU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/62262e9d6c/GalvanicFieldSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Herald of Ice": {
    "gemId": "herald_of_ice",
    "name": "Herald of Ice",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXJhbGRvZkljZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/01e419f67c/HeraldofIce.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Herald of Thunder": {
    "gemId": "herald_of_thunder",
    "name": "Herald of Thunder",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXJhbGRvZlRodW5kZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/fcc8e7de1e/HeraldofThunder.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Wall of Force": {
    "gemId": "wall_of_force",
    "name": "Wall of Force",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XYWxsb2ZGb3JjZVNraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5e76666ba3/WallofForceSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Assassin's Mark": {
    "gemId": "assassin_s_mark",
    "name": "Assassin's Mark",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Bc3Nhc3NpbnNNYXJrIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/4d097e1260/AssassinsMark.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blade Blast": {
    "gemId": "blade_blast",
    "name": "Blade Blast",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGFkZUJ1cnN0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/1016cf1f6f/BladeBurst.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blood Rage": {
    "gemId": "blood_rage",
    "name": "Blood Rage",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbG9vZFJhZ2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/199f6b772e/BloodRage.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Herald of Agony": {
    "gemId": "herald_of_agony",
    "name": "Herald of Agony",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXJhbGRPZkFnb255R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b67d7e827e/HeraldOfAgonyGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Skitterbots": {
    "gemId": "summon_skitterbots",
    "name": "Summon Skitterbots",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Ta2l0dGVyYm90U2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/253a2d4154/SkitterbotSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ensnaring Arrow": {
    "gemId": "ensnaring_arrow",
    "name": "Ensnaring Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbnNuYXJpbmdBcnJvdyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/97bfa5c44a/EnsnaringArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frenzy": {
    "gemId": "frenzy",
    "name": "Frenzy",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GcmVuenkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6eaf6bf70d/Frenzy.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Poacher's Mark": {
    "gemId": "poacher_s_mark",
    "name": "Poacher's Mark",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Qb2FjaGVyc01hcmsiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ab05aa26e0/PoachersMark.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ancestral Cry": {
    "gemId": "ancestral_cry",
    "name": "Ancestral Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BbmNlc3RyYWxDcnkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b4adaa4a42/AncestralCry.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Corrupting Fever": {
    "gemId": "corrupting_fever",
    "name": "Corrupting Fever",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db3JydXB0ZWRCbG9vZFN0cmVhbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2976ac6ef2/CorruptedBloodStream.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Defiance Banner": {
    "gemId": "defiance_banner",
    "name": "Defiance Banner",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Bcm1vdXJhbmRFdmFzaW9uQmFubmVyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7550f4b5f2/ArmourandEvasionBanner.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Eviscerate": {
    "gemId": "eviscerate",
    "name": "Eviscerate",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy8xSGFuZFNoaWVsZENvdW50ZXJhdHRhY2tTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/18612cf0b3/1HandShieldCounterattackSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flesh and Stone": {
    "gemId": "flesh_and_stone",
    "name": "Flesh and Stone",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbG9vZFNhbmRBcm1vdXJHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4789b92480/BloodSandArmourGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Glacial Shield Swipe": {
    "gemId": "glacial_shield_swipe",
    "name": "Glacial Shield Swipe",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VXYXZlc1NraWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/37c0c2b118/IceWavesSkill.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Seismic Cry": {
    "gemId": "seismic_cry",
    "name": "Seismic Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TZWlzbWljQ3J5U2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/983677c1be/SeismicCrySkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Swordstorm": {
    "gemId": "swordstorm",
    "name": "Swordstorm",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XZWFwb25TdG9ybVNraWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/be6f64c9c5/WeaponStormSkill.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Warlord's Mark": {
    "gemId": "warlord_s_mark",
    "name": "Warlord's Mark",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XYXJsb3Jkc01hcmsiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/3903cae510/WarlordsMark.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Duelist",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Molten Shell": {
    "gemId": "molten_shell",
    "name": "Molten Shell",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Nb2x0ZW5TaGVsbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d7b86e4b76/MoltenShell.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Brand Recall": {
    "gemId": "brand_recall",
    "name": "Brand Recall",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SZWNhbGxTaWdpbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/1609e558f3/RecallSigil.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Divine Retribution": {
    "gemId": "divine_retribution",
    "name": "Divine Retribution",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SZXRhbGlhdGlvbkhvbHlTcGVsbFNraWxsIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/e0e8279ec8/RetaliationHolySpellSkill.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Herald of Purity": {
    "gemId": "herald_of_purity",
    "name": "Herald of Purity",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXJhbGRPZkxpZ2h0IEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/26b726b416/HeraldOfLight%20Gem.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Wave of Conviction": {
    "gemId": "wave_of_conviction",
    "name": "Wave of Conviction",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QdXJnZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/66ebce3861/Purge.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Herald of Ash": {
    "gemId": "herald_of_ash",
    "name": "Herald of Ash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXJhbGRvZkFzaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/62d34497c8/HeraldofAsh.png",
    "type": "active",
    "availability": [
      {
        "act": 2,
        "source": "quest",
        "questName": "Intruders in Black",
        "questId": "a2q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bane": {
    "gemId": "bane",
    "name": "Bane",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EYXJrUml0dWFsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/49b669a081/DarkRitualGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Conductivity": {
    "gemId": "conductivity",
    "name": "Conductivity",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db25kdWN0aXZpdHkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/076cd0472c/Conductivity.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Despair": {
    "gemId": "despair",
    "name": "Despair",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZXNwYWlyIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5f14a5848e/Despair.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Discipline": {
    "gemId": "discipline",
    "name": "Discipline",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EaXNjaXBsaW5lIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/d802479c30/Discipline.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Elemental Weakness": {
    "gemId": "elemental_weakness",
    "name": "Elemental Weakness",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbGVtZW50YWxXZWFrbmVzcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/5e159bd6f1/ElementalWeakness.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Enfeeble": {
    "gemId": "enfeeble",
    "name": "Enfeeble",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbmZlZWJsZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/9d76e0760a/Enfeeble.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flammability": {
    "gemId": "flammability",
    "name": "Flammability",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGFtbWFiaWxpdHkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9509f4c3a7/Flammability.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frostbite": {
    "gemId": "frostbite",
    "name": "Frostbite",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm9zdEJpdGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4cc71d2d31/FrostBite.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Malevolence": {
    "gemId": "malevolence",
    "name": "Malevolence",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZWxpcml1bUdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/86eaac1d34/DeliriumGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Purity of Elements": {
    "gemId": "purity_of_elements",
    "name": "Purity of Elements",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QdXJpdHkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0b82235250/Purity.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Spellslinger": {
    "gemId": "spellslinger",
    "name": "Spellslinger",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TcGVsbHNsaW5nZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/56a197623f/Spellslinger.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Temporal Chains": {
    "gemId": "temporal_chains",
    "name": "Temporal Chains",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9UZW1wb3JhbENoYWlucyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/5d0aef0dab/TemporalChains.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Zealotry": {
    "gemId": "zealotry",
    "name": "Zealotry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TcGVsbERhbWFnZUdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/42650bac1a/SpellDamageGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Hatred": {
    "gemId": "hatred",
    "name": "Hatred",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IYXRyZWQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/efc6c01618/Hatred.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Shadow",
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Plague Bearer": {
    "gemId": "plague_bearer",
    "name": "Plague Bearer",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QbGFndWVCZWFyZXJHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/4dfe0fb3ba/PlagueBearerGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Wrath": {
    "gemId": "wrath",
    "name": "Wrath",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XcmF0aCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6925b79eac/Wrath.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Alchemist's Mark": {
    "gemId": "alchemist_s_mark",
    "name": "Alchemist's Mark",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BbGNoZW1pc3RzTWFya1NraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/19be0ee97a/AlchemistsMarkSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Grace": {
    "gemId": "grace",
    "name": "Grace",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9HcmFjZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/0d4fbca4ae/Grace.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Dread Banner": {
    "gemId": "dread_banner",
    "name": "Dread Banner",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EcmVhZEJhbm5lciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b2153b8c9a/DreadBanner.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Petrified Blood": {
    "gemId": "petrified_blood",
    "name": "Petrified Blood",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QZXRyaWZpZWRCbG9vZEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/8d9f5e2529/PetrifiedBloodGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Pride": {
    "gemId": "pride",
    "name": "Pride",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QcmlkZUF1cmFHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2cbd388a8d/PrideAuraGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rallying Cry": {
    "gemId": "rallying_cry",
    "name": "Rallying Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWxseWluZ0NyeVNraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6495668d50/RallyingCrySkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Anger": {
    "gemId": "anger",
    "name": "Anger",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BbmdlciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/91603ddfc9/Anger.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Determination": {
    "gemId": "determination",
    "name": "Determination",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EZXRlcm1pbmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/9d35188568/Determination.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "General's Cry": {
    "gemId": "general_s_cry",
    "name": "General's Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9HZW5lcmFsc0NyeSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/cd520d244f/GeneralsCry.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Infernal Cry": {
    "gemId": "infernal_cry",
    "name": "Infernal Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JbmZlcm5hbENyeSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2d26c6eb2b/InfernalCry.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Punishment": {
    "gemId": "punishment",
    "name": "Punishment",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QdW5pc2htZW50IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/06feb2d185/Punishment.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vengeful Cry": {
    "gemId": "vengeful_cry",
    "name": "Vengeful Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SZXRhbGlhdGlvblJhZ2VXYXJlY3J5V2FyY3J5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/963303d35a/RetaliationRageWarecryWarcry.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vulnerability": {
    "gemId": "vulnerability",
    "name": "Vulnerability",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9WdWxuZXJhYmlsaXR5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ec1d389488/Vulnerability.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Battlemage's Cry": {
    "gemId": "battlemage_s_cry",
    "name": "Battlemage's Cry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EaXZpbmVDcnlHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/bdf919b785/DivineCryGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Lost in Love",
        "questId": "a3q1",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Archmage Support": {
    "gemId": "archmage_support",
    "name": "Archmage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01hbmF3ZWF2ZVN1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/26b9a98b33/ManaweaveSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blasphemy Support": {
    "gemId": "blasphemy_support",
    "name": "Blasphemy Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0F1cmlmeSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ac2d013ed8/Aurify.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Burning Damage Support": {
    "gemId": "burning_damage_support",
    "name": "Burning Damage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0luY3JlYXNlZEJ1cm5EdXJhdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/46900a1f5b/IncreasedBurnDuration.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cold Penetration Support": {
    "gemId": "cold_penetration_support",
    "name": "Cold Penetration Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NvbGRQZW5ldHJhdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/bf21e6828c/ColdPenetration.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Energy Leech Support": {
    "gemId": "energy_leech_support",
    "name": "Energy Leech Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0VuZXJneVNoaWVsZExlZWNoc3VwcG9ydCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/691b0c6570/EnergyShieldLeechsupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Feeding Frenzy Support": {
    "gemId": "feeding_frenzy_support",
    "name": "Feeding Frenzy Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L09mZmVuc2l2ZU1pbmlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f90cd05483/OffensiveMinion.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fire Penetration Support": {
    "gemId": "fire_penetration_support",
    "name": "Fire Penetration Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZpcmVQZW5ldHJhdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/191dcc704c/FirePenetration.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Focused Channelling Support": {
    "gemId": "focused_channelling_support",
    "name": "Focused Channelling Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZvY3VzZWRDaGFubmVsbGluZ1N1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/76629c3ce9/FocusedChannellingSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Impending Doom Support": {
    "gemId": "impending_doom_support",
    "name": "Impending Doom Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1ZpY2lvdXNIZXhTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ca0675bd9c/ViciousHexSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Intensify Support": {
    "gemId": "intensify_support",
    "name": "Intensify Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NwZWxsRm9jdXNTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/f1143120cd/SpellFocusSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Penetration Support": {
    "gemId": "lightning_penetration_support",
    "name": "Lightning Penetration Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0xpZ2h0bmluZ1BlbmV0cmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/4fcb8dce90/LightningPenetration.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Meat Shield Support": {
    "gemId": "meat_shield_support",
    "name": "Meat Shield Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0RlZmVuc2l2ZU1pbmlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/604a531a0b/DefensiveMinion.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Pinpoint Support": {
    "gemId": "pinpoint_support",
    "name": "Pinpoint Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1Byb2plY3RpbGVJbnRlbnNpdHkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ee6ee305b9/ProjectileIntensity.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sacrifice Support": {
    "gemId": "sacrifice_support",
    "name": "Sacrifice Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NhY3JpZmljZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/7797a594a9/Sacrifice.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Swift Affliction Support": {
    "gemId": "swift_affliction_support",
    "name": "Swift Affliction Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N1cHBvcnRSYXBpZERlY2F5R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bed2b2a224/SupportRapidDecayGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Charged Mines Support": {
    "gemId": "charged_mines_support",
    "name": "Charged Mines Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ludGVsbGlnZW5jZVBvd2VyRnJlbnp5Q2hhcmdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/af11e7653b/IntelligencePowerFrenzyCharge.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Charged Traps Support": {
    "gemId": "charged_traps_support",
    "name": "Charged Traps Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1Bvd2VyRnJlbnp5Q2hhcmdlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/50c4a0b8e0/PowerFrenzyCharge.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Critical Strike Affliction Support": {
    "gemId": "critical_strike_affliction_support",
    "name": "Critical Strike Affliction Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1BvaXNvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/93b5718773/Poison.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Faster Projectiles Support": {
    "gemId": "faster_projectiles_support",
    "name": "Faster Projectiles Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Zhc3RlclByb2plY3RpbGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a6517119dd/FasterProjectiles.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "High-Impact Mine Support": {
    "gemId": "high_impact_mine_support",
    "name": "High-Impact Mine Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0FsdFJlbW90ZU1pbmVTdXBwb3J0R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/22c3e66b67/AltRemoteMineSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ice Bite Support": {
    "gemId": "ice_bite_support",
    "name": "Ice Bite Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZyZW56eUNoYXJnZU9uU2hhdHRlciIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/d172bfc06a/FrenzyChargeOnShatter.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow",
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Innervate Support": {
    "gemId": "innervate_support",
    "name": "Innervate Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L09uc2xhdWdodE9uU2xheWluZ1Nob2NrZWQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0780d91964/OnslaughtOnSlayingShocked.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Second Wind Support": {
    "gemId": "second_wind_support",
    "name": "Second Wind Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NlY29uZFdpbmRTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/ccfc5c7b25/SecondWindSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Focused Ballista Support": {
    "gemId": "focused_ballista_support",
    "name": "Focused Ballista Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZvY3Vzc2VkQmFsbGlzdGFTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7fe5aa6d93/FocussedBallistaSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fork Support": {
    "gemId": "fork_support",
    "name": "Fork Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZvcmsiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9de72b6ab9/Fork.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fortify Support": {
    "gemId": "fortify_support",
    "name": "Fortify Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZvcnRpZnlHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/0f54034785/FortifyGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Hypothermia Support": {
    "gemId": "hypothermia_support",
    "name": "Hypothermia Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0RhbWFnZUFnYWluc3RDaGlsbGVkIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/97f8b88dfa/DamageAgainstChilled.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Impale Support": {
    "gemId": "impale_support",
    "name": "Impale Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L2ltcGFsZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/a974bd1dc1/impale.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Life Leech Support": {
    "gemId": "life_leech_support",
    "name": "Life Leech Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0xpZmVMZWVjaCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/56a5e21d58/LifeLeech.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Windburst Support": {
    "gemId": "windburst_support",
    "name": "Windburst Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1Rvcm5hZG9zU3VwcG9ydEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f662ca6a73/TornadosSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Ranger",
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arrogance Support": {
    "gemId": "arrogance_support",
    "name": "Arrogance Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Jsb29kTWFnaWMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f90e23f319/BloodMagic.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bloodthirst Support": {
    "gemId": "bloodthirst_support",
    "name": "Bloodthirst Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Jsb29kUHJpY2VTdXBwb3J0R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/4ea8419360/BloodPriceSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Expert Retaliation Support": {
    "gemId": "expert_retaliation_support",
    "name": "Expert Retaliation Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0V4cGVydFJldGFsaWF0aW9uU3VwcG9ydCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/7897b090f1/ExpertRetaliationSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Pulverise Support": {
    "gemId": "pulverise_support",
    "name": "Pulverise Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1B1bHZlcml6ZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f6e9b6cedb/Pulverize.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Urgent Orders Support": {
    "gemId": "urgent_orders_support",
    "name": "Urgent Orders Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1VyZ2VudE9yZGVyc1N1cHBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/dfa6ae426c/UrgentOrdersSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Controlled Blaze Support": {
    "gemId": "controlled_blaze_support",
    "name": "Controlled Blaze Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NvbnRyb2xsZWRCbGF6ZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/da0249157e/ControlledBlaze.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Corrupting Cry Support": {
    "gemId": "corrupting_cry_support",
    "name": "Corrupting Cry Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NvcnJ1cHRpbmdDcnkiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/27dd12964c/CorruptingCry.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "More Duration Support": {
    "gemId": "more_duration_support",
    "name": "More Duration Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0luY3JlYXNlZER1cmF0aW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a5db7ae0bd/IncreasedDuration.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Guardian's Blessing Support": {
    "gemId": "guardian_s_blessing_support",
    "name": "Guardian's Blessing Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0d1YXJkaWFuc0JsZXNzaW5nIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bd80e27bb7/GuardiansBlessing.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Swiftbrand Support": {
    "gemId": "swiftbrand_support",
    "name": "Swiftbrand Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1N3aWZ0YnJhbmRTdXBwb3J0R2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/18dcd7a075/SwiftbrandSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "A Fixture of Fate",
        "questId": "a3q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ball Lightning": {
    "gemId": "ball_lightning",
    "name": "Ball Lightning",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CYWxsTGlnaHRuaW5nIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/74fdc87429/BallLightning.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Crackling Lance": {
    "gemId": "crackling_lance",
    "name": "Crackling Lance",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9EaXNlbnRlZ3JhdGVHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/fb58b0b975/DisentegrateGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cremation": {
    "gemId": "cremation",
    "name": "Cremation",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db3Jwc2VFcnVwdGlvbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/42242be804/CorpseEruption.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Eye of Winter": {
    "gemId": "eye_of_winter",
    "name": "Eye of Winter",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm96ZW5TcGhlcmVTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/944702b2ee/FrozenSphereSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Glacial Cascade": {
    "gemId": "glacial_cascade",
    "name": "Glacial Cascade",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9VcGhlYXZhbCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/afcb5b5159/Upheaval.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Hexblast": {
    "gemId": "hexblast",
    "name": "Hexblast",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Eb29tQmxhc3RTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2de8630bc4/DoomBlastSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Kinetic Blast": {
    "gemId": "kinetic_blast",
    "name": "Kinetic Blast",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DbHVzdGVyQnVyc3QiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8c14610c8e/ClusterBurst.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Kinetic Rain": {
    "gemId": "kinetic_rain",
    "name": "Kinetic Rain",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9LaW5ldGljUmFpblNraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/568245b6d1/KineticRainSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Conduit": {
    "gemId": "lightning_conduit",
    "name": "Lightning Conduit",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbmVyZ3lSZWxlYXNlU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e294801b16/EnergyReleaseSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Raise Spectre": {
    "gemId": "raise_spectre",
    "name": "Raise Spectre",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWlzZVNwZWN0cmUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/581a69bc61/RaiseSpectre.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Somatic Shell": {
    "gemId": "somatic_shell",
    "name": "Somatic Shell",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9LaW5ldGljU2hlbGxTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/730028853b/KineticShellSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Soulrend": {
    "gemId": "soulrend",
    "name": "Soulrend",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Tb3VscmVuZCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/aa82ffc626/Soulrend.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Reaper": {
    "gemId": "summon_reaper",
    "name": "Summon Reaper",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdW1tb25SZWFwZXJTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/66e30c571e/SummonReaperSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blade Flurry": {
    "gemId": "blade_flurry",
    "name": "Blade Flurry",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaGFyZ2VkQXR0YWNrIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/dc5df68662/ChargedAttack.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow",
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bladefall": {
    "gemId": "bladefall",
    "name": "Bladefall",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWluT2ZCbGFkZXMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6a16dd382d/RainOfBlades.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Charged Dash": {
    "gemId": "charged_dash",
    "name": "Charged Dash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaGFyZ2VkRGFzaEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/c7fe858529/ChargedDashGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flamethrower Trap": {
    "gemId": "flamethrower_trap",
    "name": "Flamethrower Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGFtZXRocm93ZXJUcmFwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/1ab485e357/FlamethrowerTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lightning Spire Trap": {
    "gemId": "lightning_spire_trap",
    "name": "Lightning Spire Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdTcGlyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/749603c56d/LightningSpire.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Pestilent Strike": {
    "gemId": "pestilent_strike",
    "name": "Pestilent Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9NYW1iYVN0cmlrZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/64b7aaeb58/MambaStrike.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Pyroclast Mine": {
    "gemId": "pyroclast_mine",
    "name": "Pyroclast Mine",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlTW9ydGFyQmFycmFnZU1pbmVTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b12c5058d8/FireMortarBarrageMineSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Seismic Trap": {
    "gemId": "seismic_trap",
    "name": "Seismic Trap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdWJ0ZXJyYW5lYW5UcmFwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b9e8e8a4ca/SubterraneanTrap.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Artillery Ballista": {
    "gemId": "artillery_ballista",
    "name": "Artillery Ballista",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Nb3J0YXJUb3RlbUJvd1NraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/833609634b/MortarTotemBowSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Blast Rain": {
    "gemId": "blast_rain",
    "name": "Blast Rain",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGFzdFJhaW5HZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8ae8ea9b38/BlastRainGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger",
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Conflagration": {
    "gemId": "conflagration",
    "name": "Conflagration",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Db25mbGFncmF0aW9uU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/5fa013145a/ConflagrationSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Explosive Concoction": {
    "gemId": "explosive_concoction",
    "name": "Explosive Concoction",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FeHBsb3NpdmVGbGFza1NraWxsR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/7a8b38230f/ExplosiveFlaskSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Scourge Arrow": {
    "gemId": "scourge_arrow",
    "name": "Scourge Arrow",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9WaXJ1bGVudEFycm93IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5ba0718e13/VirulentArrow.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Storm Rain": {
    "gemId": "storm_rain",
    "name": "Storm Rain",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9QcmlzbWF0aWNSYWluIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6cc639e4ad/PrismaticRain.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Thunderstorm": {
    "gemId": "thunderstorm",
    "name": "Thunderstorm",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9XaW5kc3Rvcm1Ta2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/82d8cd1884/WindstormSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger",
          "Duelist",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Tornado Shot": {
    "gemId": "tornado_shot",
    "name": "Tornado Shot",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Ub3JuYWRvU2hvdCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/2e19ba168e/TornadoShot.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Wild Strike": {
    "gemId": "wild_strike",
    "name": "Wild Strike",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9FbGVtZW50YWxTdHJpa2UiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/70f4065c55/ElementalStrike.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bladestorm": {
    "gemId": "bladestorm",
    "name": "Bladestorm",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGFkZXN0b3JtR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5e3cb62fd3/BladestormGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cyclone": {
    "gemId": "cyclone",
    "name": "Cyclone",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DeWNsb25lIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/6969ed6a0d/Cyclone.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Duelist",
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ice Crash": {
    "gemId": "ice_crash",
    "name": "Ice Crash",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VDcmFzaEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/10c826a1fe/IceCrashGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Lancing Steel": {
    "gemId": "lancing_steel",
    "name": "Lancing Steel",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MYW5jaW5nU3RlZWwiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/757c31e02b/LancingSteel.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Spectral Shield Throw": {
    "gemId": "spectral_shield_throw",
    "name": "Spectral Shield Throw",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9UaHJvd25TaGllbGQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b5078f4fa6/ThrownShield.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Duelist"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Earthquake": {
    "gemId": "earthquake",
    "name": "Earthquake",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9RdWFrZVNsYW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/61680c0c9c/QuakeSlam.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rage Vortex": {
    "gemId": "rage_vortex",
    "name": "Rage Vortex",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9SYWdlVm9ydGV4IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/449733def4/RageVortex.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Tectonic Slam": {
    "gemId": "tectonic_slam",
    "name": "Tectonic Slam",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9UZWN0b25pY1NsYW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/aa55470672/TectonicSlam.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Marauder",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Reap": {
    "gemId": "reap",
    "name": "Reap",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbG9vZHJlYXBHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/b2a913da04/BloodreapGem.png",
    "type": "active",
    "availability": [
      {
        "act": 3,
        "source": "quest",
        "questName": "Sever the Right Hand",
        "questId": "a3q3",
        "classes": [
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Bonechill Support": {
    "gemId": "bonechill_support",
    "name": "Bonechill Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0JvbmVDaGlsbFN1cHBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9aa30460fd/BoneChillSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Chain Support": {
    "gemId": "chain_support",
    "name": "Chain Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L2NoYWluIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/812e47f631/chain.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Decay Support": {
    "gemId": "decay_support",
    "name": "Decay Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0RlY2F5IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/a88201c7c2/Decay.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Greater Multiple Projectiles Support": {
    "gemId": "greater_multiple_projectiles_support",
    "name": "Greater Multiple Projectiles Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0dyZWF0ZXJNdWx0aXBsZVByb2plY3RpbGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/c157c4f1e9/GreaterMultipleProjectiles.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Hex Bloom Support": {
    "gemId": "hex_bloom_support",
    "name": "Hex Bloom Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IZXhTcHJlYWRpbmdTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/873fa8ef65/HexSpreadingSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Immolate Support": {
    "gemId": "immolate_support",
    "name": "Immolate Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ltbW9sYXRlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/af3f7bc354/Immolate.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Increased Area of Effect Support": {
    "gemId": "increased_area_of_effect_support",
    "name": "Increased Area of Effect Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0luY3JlYXNlZEFPRSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/a4111d2154/IncreasedAOE.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Multistrike Support": {
    "gemId": "multistrike_support",
    "name": "Multistrike Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L211bHRpcGxlYXR0YWNrcyIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/49bb71ab5f/multipleattacks.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Spell Echo Support": {
    "gemId": "spell_echo_support",
    "name": "Spell Echo Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0VjaG8iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/1868afbf2e/Echo.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Unleash Support": {
    "gemId": "unleash_support",
    "name": "Unleash Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1VubGVhc2hTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/9c92c88f3e/UnleashSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Barrage Support": {
    "gemId": "barrage_support",
    "name": "Barrage Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0dyZWVuQmFycmFnZVN1cHBvcnRHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/9c04b6b337/GreenBarrageSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Cluster Traps Support": {
    "gemId": "cluster_traps_support",
    "name": "Cluster Traps Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0NsdXN0ZXJUcmFwIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/91000f9475/ClusterTrap.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Greater Volley Support": {
    "gemId": "greater_volley_support",
    "name": "Greater Volley Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0dyZWF0ZXJWb2xsZXlTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/bb821215f4/GreaterVolleySupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Minefield Support": {
    "gemId": "minefield_support",
    "name": "Minefield Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01pbmVmaWVsZCIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/04b0f0d1e0/Minefield.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Returning Projectiles Support": {
    "gemId": "returning_projectiles_support",
    "name": "Returning Projectiles Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1JldHVyblByb2plY3RpbGVzIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/76e59b7e35/ReturnProjectiles.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow",
          "Ranger",
          "Duelist",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Vile Toxins Support": {
    "gemId": "vile_toxins_support",
    "name": "Vile Toxins Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1ZpbGVUb3hpbnMiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f63c48d4b1/VileToxins.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Withering Touch Support": {
    "gemId": "withering_touch_support",
    "name": "Withering Touch Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1dpdGhlckdlbVN1cHBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/214e5fcb53/WitherGemSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Rupture Support": {
    "gemId": "rupture_support",
    "name": "Rupture Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1J1cHR1cmVTdXBwb3J0IiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/38a8e54b96/RuptureSupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Behead Support": {
    "gemId": "behead_support",
    "name": "Behead Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0V4ZWN1dGlvbmVyU3VwcG9ydEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/5a4440c4e7/ExecutionerSupportGem.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Fist of War Support": {
    "gemId": "fist_of_war_support",
    "name": "Fist of War Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0Zpc3RPZldhckdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/6ba67a3963/FistOfWarGem.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Trauma Support": {
    "gemId": "trauma_support",
    "name": "Trauma Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1RyYXVtYSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/f1642bf8e3/Trauma.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Duelist",
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Brutality Support": {
    "gemId": "brutality_support",
    "name": "Brutality Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0JydXRhbGl0eSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/62f8d5318d/Brutality.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Eternal Blessing Support": {
    "gemId": "eternal_blessing_support",
    "name": "Eternal Blessing Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L01vcnRhbENvbnZpY3Rpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/39ae65a638/MortalConviction.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Multiple Totems Support": {
    "gemId": "multiple_totems_support",
    "name": "Multiple Totems Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L011bHRpcGxlVG90ZW1zIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/dc8f032f0b/MultipleTotems.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Marauder",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Overexertion Support": {
    "gemId": "overexertion_support",
    "name": "Overexertion Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L092ZXJleGVydGlvbldhcmNyeVN1cHBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/2f39285834/OverexertionWarcrySupport.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Arcanist Brand": {
    "gemId": "arcanist_brand",
    "name": "Arcanist Brand",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BcmNhbmlzdEJyYW5kR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/b365952f18/ArcanistBrandGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frigid Bond Support": {
    "gemId": "frigid_bond_support",
    "name": "Frigid Bond Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0ZyaWdpZEJvbmQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e595841550/FrigidBond.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ignite Proliferation Support": {
    "gemId": "ignite_proliferation_support",
    "name": "Ignite Proliferation Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L0lnbml0ZVByb2xpZmVyYXRpb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/e6a337b58f/IgniteProliferation.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Spellblade Support": {
    "gemId": "spellblade_support",
    "name": "Spellblade Support",
    "icon": "https://web.poecdn.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdXBwb3J0L1NwZWxsQmxhZGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/6f4a6cf751/SpellBlade.png",
    "type": "support",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "The Eternal Nightmare",
        "questId": "a4q1",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frost Shield": {
    "gemId": "frost_shield",
    "name": "Frost Shield",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm9zdEdsb2JlIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/c9d8957c73/FrostGlobe.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Hydrosphere": {
    "gemId": "hydrosphere",
    "name": "Hydrosphere",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9IeWRyb3NwaGVyZSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/cf433a6596/Hydrosphere.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Sigil of Power": {
    "gemId": "sigil_of_power",
    "name": "Sigil of Power",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaXJjbGVvZlBvd2VyU2tpbGxHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/7b2960c51a/CircleofPowerSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Carrion Golem": {
    "gemId": "summon_carrion_golem",
    "name": "Summon Carrion Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TdW1tb25DYXJyaW9uR29sZW1HZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/84d9986a34/SummonCarrionGolemGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Chaos Golem": {
    "gemId": "summon_chaos_golem",
    "name": "Summon Chaos Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaGFvc0VsZW1lbnRhbFN1bW1vbiIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/e863cad958/ChaosElementalSummon.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Flame Golem": {
    "gemId": "summon_flame_golem",
    "name": "Summon Flame Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GaXJlRWxlbWVudGFsU3VtbW9uIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/5d4c6fc5b4/FireElementalSummon.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Ice Golem": {
    "gemId": "summon_ice_golem",
    "name": "Summon Ice Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9JY2VFbGVtZW50YWxTdW1tb24iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/d35062fbcd/IceElementalSummon.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Lightning Golem": {
    "gemId": "summon_lightning_golem",
    "name": "Summon Lightning Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9MaWdodG5pbmdHb2xlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/4220d92d66/LightningGolem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Summon Stone Golem": {
    "gemId": "summon_stone_golem",
    "name": "Summon Stone Golem",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Sb2NrR29sZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/f0d237e67b/RockGolem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Shadow",
          "Ranger",
          "Duelist",
          "Marauder",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Void Sphere": {
    "gemId": "void_sphere",
    "name": "Void Sphere",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CbGFja0hvbGUiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/8680619c44/BlackHole.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Witch",
          "Templar",
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Ambush": {
    "gemId": "ambush",
    "name": "Ambush",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9BbWJ1c2hTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/b8e64084d6/AmbushSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Temporal Rift": {
    "gemId": "temporal_rift",
    "name": "Temporal Rift",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9DaHJvbm9tYW5jZXIiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/ce3fb3cfe3/Chronomancer.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Shadow"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Tornado": {
    "gemId": "tornado",
    "name": "Tornado",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Ub3JuYWRvR2VtIiwidyI6MSwiaCI6MSwic2NhbGUiOjF9XQ/17ebe5873b/TornadoGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Shadow",
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Snipe": {
    "gemId": "snipe",
    "name": "Snipe",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9TbmlwZXJTa2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/dc97482a93/SniperSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Ranger"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Berserk": {
    "gemId": "berserk",
    "name": "Berserk",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9CZXNlcmtHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/3172413aee/BeserkGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Marauder"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Frozen Legion": {
    "gemId": "frozen_legion",
    "name": "Frozen Legion",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Gcm96ZW5MZWdpb25Ta2lsbEdlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/a81f249f21/FrozenLegionSkillGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Templar"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Flame Link": {
    "gemId": "flame_link",
    "name": "Flame Link",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9GbGFtZUxpbmtHZW0iLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/d1e642950c/FlameLinkGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Intuitive Link": {
    "gemId": "intuitive_link",
    "name": "Intuitive Link",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9UcmlnZ2VyTGlua0dlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/ed83dc062b/TriggerLinkGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  },
  "Soul Link": {
    "gemId": "soul_link",
    "name": "Soul Link",
    "icon": "https://web.poecdn.com/gen/image/WzMwLDE0LHsiZiI6IjJESXRlbXMvR2Vtcy9Tb3VsTGlua0dlbSIsInciOjEsImgiOjEsInNjYWxlIjoxfV0/79ef5c1211/SoulLinkGem.png",
    "type": "active",
    "availability": [
      {
        "act": 4,
        "source": "quest",
        "questName": "Breaking the Seal",
        "questId": "a4q2",
        "classes": [
          "Scion"
        ]
      },
      {
        "act": 3,
        "source": "siosa",
        "questName": "A Fixture of Fate",
        "classes": []
      },
      {
        "act": 6,
        "source": "lilly",
        "questName": "Fallen from Grace",
        "classes": []
      }
    ]
  }
};

/**
 * Special vendors data
 */
export const specialVendors = [
  {
    "npcId": "siosa",
    "name": "Siosa",
    "act": 3,
    "unlockQuest": "A Fixture of Fate",
    "location": "The Library",
    "description": "Removes class restrictions for gems unlocked via quests",
    "provides": "cross_class"
  },
  {
    "npcId": "lilly_roth",
    "name": "Lilly Roth",
    "act": 6,
    "unlockQuest": "Fallen from Grace",
    "location": "Lioneye's Watch (Act 6+)",
    "description": "Unlocks all gems regardless of class or quest completion",
    "provides": "all_gems"
  }
];

/**
 * Get gem availability for specific class
 */
export function getGemAvailabilityForClass(gemName, className) {
  const gem = gemAvailabilityData[gemName];
  if (!gem) return null;

  // Filter sources available to this class
  return gem.availability.filter(source =>
    source.classes.length === 0 || source.classes.includes(className)
  );
}

/**
 * Get earliest act where gem is available for class
 */
export function getEarliestAct(gemName, className) {
  const availability = getGemAvailabilityForClass(gemName, className);
  if (!availability || availability.length === 0) return null;

  return Math.min(...availability.map(a => a.act));
}

/**
 * Check if gem is available as quest reward for class
 */
export function isQuestReward(gemName, className) {
  const availability = getGemAvailabilityForClass(gemName, className);
  return availability && availability.some(a =>
    a.source === 'quest' &&
    (a.classes.length === 0 || a.classes.includes(className))
  );
}

/**
 * Get all gems available in specific act
 */
export function getGemsForAct(actNumber, className) {
  const actGems = [];

  for (const [gemName, gemData] of Object.entries(gemAvailabilityData)) {
    const availability = gemData.availability.filter(a =>
      a.act === actNumber &&
      (a.classes.length === 0 || a.classes.includes(className))
    );

    if (availability.length > 0) {
      actGems.push({
        ...gemData,
        actAvailability: availability
      });
    }
  }

  return actGems;
}

export default gemAvailabilityData;
