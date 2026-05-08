/**
 * RunesOfAldurPage — Long-form summary of PoE 2 patch 0.5
 * ("Return of the Ancients" / Runes of Aldur).
 *
 * Sanitized render of the cached announcement summary at
 * .claude/knowledge/poe2/cached/0.5-announcement.md (gitignored, internal).
 * Refresh after the full patch notes drop on ~2026-05-21.
 *
 * Pattern mirrors PrivacyPage — flat document, max-w-3xl, zinc styling,
 * inline Section / Callout / ExtLink helpers. No league theming yet.
 */
import { Link } from 'react-router-dom';

const LAUNCH_DATE = '2026-05-29 13:00 PDT';
const PATCH_NOTES_DATE = '~2026-05-21';

export default function RunesOfAldurPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
            Path of Exile 2 · 0.5
          </span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-100 leading-tight">
          Runes of Aldur — what we know about Path of Exile 2 patch 0.5
        </h1>
        <p className="text-sm text-zinc-500">
          Announcement-level summary, last refreshed 2026-05-08. Patch notes drop {PATCH_NOTES_DATE};
          this page gets a content pass when they do.
        </p>
      </div>

      <Callout color="cyan">
        <strong>The headline:</strong> 0.5 ("Return of the Ancients") launches{' '}
        <strong>{LAUNCH_DATE}</strong> on PC and consoles. League is{' '}
        <strong>Runes of Aldur</strong>. Atlas tree expands to 300+ allocatable
        nodes. Two new ascendancies (Spirit Walker for Huntress, Martial Artist
        for Monk). New defensive resource called Runic Ward, a new family of
        Kalguuran skill gems that consume it, and 100+ new runes powering the
        league's crafting loop. Final major Early Access patch before 1.0.
      </Callout>

      {/* ═══ Headline facts ═══ */}
      <Section title="Headline facts">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-white/[0.04]">
            <Row label="League name" value="Runes of Aldur" />
            <Row label="Patch number" value="0.5.0" />
            <Row label="Patch nickname" value="Return of the Ancients" />
            <Row label="Reveal date" value="2026-05-07 13:00 PDT (GGG Live on Twitch)" />
            <Row label="Launch date" value="2026-05-29 13:00 PDT / 20:00 UTC" />
            <Row label="Full patch notes" value={`${PATCH_NOTES_DATE} (one week pre-launch, single-source)`} />
            <Row label="Pre-1.0 status" value="Final major Early Access patch before 1.0 (still slated for 2026)" />
            <Row
              label="Total content scale"
              value={`50+ hours of new endgame content · 5 storylines · 15 bosses (4 Pinnacle) · 40 uniques (incl. Mageblood, reportedly)`}
            />
          </tbody>
        </table>
      </Section>

      {/* ═══ New ascendancies ═══ */}
      <Section title="New ascendancies — two confirmed">
        <p>
          GGG confirmed all current classes will have full ascendancy sets by 1.0,
          but only these two ship in 0.5.
        </p>
        <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
          <AscendancyRow
            name="Spirit Walker"
            klass="Huntress"
            identity="Communes with Azmerian animal spirits — Stag, Owl, Bear. Specialize in one or combine all three. Signature ability The Natural Order allows taming unique boss beasts as companions. Idolatry notable buffs based on socketed Idols."
          />
          <AscendancyRow
            name="Martial Artist"
            klass="Monk"
            identity="Channels to spawn mirages that mimic skills, generates damaging bells, sockets up to 5 additional Runes, augments glove stats. Two notable paths — Way of the Mountain (stone-based mitigation) and Way of the Stonefist (gloves transform into stone variants with stronger mods)."
          />
        </div>
        <p className="text-xs text-zinc-500">
          poe2db.tw briefly listed two additional ascendancies (Divinity, Bloodreaver).
          Treat as data-mined 1.0 content surfaced through GGPK rather than 0.5
          confirmations. Not on this page until GGG announces them directly.
        </p>
      </Section>

      {/* ═══ Atlas overhaul ═══ */}
      <Section title="Atlas tree — completely rebuilt">
        <p>
          The atlas passive tree has been fully rebuilt. It now contains{' '}
          <strong className="text-zinc-100">300+ nodes</strong>, and every node
          can eventually be allocated — no more permanent respec lockouts.
          Multi-choice nodes function as build-defining options rather than
          mandatory respecs.
        </p>
        <p>
          Layout shifts from open exploration to a quest-based structure:
          questlines lead to all endgame bosses, removing the need to farm keys.
        </p>
        <p>
          Three new <strong className="text-zinc-100">Atlas Masters</strong>{' '}
          offer ascendancy-style trees on the atlas itself, freely re-assignable
          between maps:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Jado's Spycraft</strong></li>
          <li><strong>Hilda's Hunting</strong></li>
          <li><strong>Doryani's Science</strong></li>
        </ul>
        <p>
          Each grants rank-based bonuses (e.g., double unique drops from
          pinnacle bosses at the cost of fewer attempts). Endgame restructured
          around a fortress at the atlas centre, housing the returning Arbiter
          of Ash and an unnamed deeper pinnacle boss at its core.
        </p>
        <Callout color="amber">
          Pre-announcement chatter said the atlas would expand from ~8 to 40+
          nodes. The actual number is <strong>300+</strong> — about 7× bigger
          than expected. The Atlas Tree Planner we're building is a flagship,
          not a quick fork.
        </Callout>
      </Section>

      {/* ═══ Runes of Aldur (league mechanic) ═══ */}
      <Section title="Runes of Aldur — Ezomyte Runesmithing">
        <p>
          Introduced via NPC <strong className="text-zinc-100">Farrow</strong>,
          a young Ezomyte blacksmith rescued early in the campaign. After
          rescue, every area contains an{' '}
          <strong className="text-zinc-100">Ezomyte Remnant</strong> — an
          ancient stone with pre-inscribed rune slots. Players fill the
          remaining slots with their own rune choices to determine rewards.
        </p>
        <Section title="The loop" level={3}>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Find a Remnant guarded by monsters; pre-inscribed slots already populated.</li>
            <li>Fill remaining slots with chosen runes — different combinations yield different rewards, tracked in the UI.</li>
            <li>Activating the Remnant resurrects the nearby dead with buffs corresponding to your rune choices. Re-engage the empowered enemies to claim rewards.</li>
            <li>Rewards range from basic currency to socketable runes with specific properties.</li>
          </ol>
          <p>
            Rune slot count and reward quality scale with{' '}
            <strong>area level and monster density</strong>.
          </p>
        </Section>
        <Section title="Persistent progression" level={3}>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Permanent Runebook</strong> records every discovered rune combination.</li>
            <li><strong>Runeforging</strong> — a crafting system using Remnant materials (notably Verisium).</li>
            <li><strong>8-challenge reward path</strong> culminates in a full microtransaction armour set.</li>
          </ul>
        </Section>
      </Section>

      {/* ═══ Runic Ward & Kalguuran gems ═══ */}
      <Section title="Runic Ward — a new defensive resource">
        <p>
          A secondary defensive resource alongside health, mana, and energy
          shield. Functions as an extra life pool — when HP would hit zero,
          Runic Ward grants a short window of survival. Can also be consumed as
          fuel by a new class of skill gems. Built up via Verisium collection.
        </p>
      </Section>

      <Section title="Kalguuran skill gems">
        <p>
          A new family of skill gems ships with 0.5. They:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Consume Runic Ward instead of mana.</strong></li>
          <li><strong>Have no attribute or weapon requirements</strong> — colorless and any-build accessible. A meaningful break from PoE 2's typical attribute gating.</li>
        </ul>
        <p className="text-xs text-zinc-500">
          Specific gem names visible on poe2db.tw front page (data-mined,
          preliminary): Frostflame Nova, Runic Infusion, Concussive Runes. Full
          roster confirmed in patch notes.
        </p>
      </Section>

      {/* ═══ Crafting expansion ═══ */}
      <Section title="Crafting expansion">
        <p>
          A substantial crafting expansion centred on the league's runes.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Over 100 new runes / crafting currencies</strong> in total.</li>
          <li>
            <strong>Runeforging</strong> (Verisium-based + others). Outcomes
            include adding Runic Ward to items, replacing defensive modifiers
            with substantial Runic Ward, adding new modifiers to existing
            uniques, and{' '}
            <strong>upgrading low-tier uniques into late-game-viable versions</strong>.
          </li>
          <li><strong>Mystic Refuge in Act 3</strong> — a unique-upgrade station gated through the campaign.</li>
          <li><strong>Alloys</strong> — adds atypical / normally-unavailable modifiers to items. Same shape as a targeted Chaos Orb.</li>
          <li><strong>Liquid Emotions</strong> (jewel crafting) — add specific modifiers to jewels (e.g. 20% armour, 15% attack damage, +2 max rage). Function similarly to Chaos Orbs but jewel-targeted.</li>
          <li><strong>Potent Emotions</strong> — drop in specific atlas areas; grant special jewel/amulet modifiers including elemental exposure and blind mechanics.</li>
          <li>Augment Kalguuran uniques in new ways (specific mechanics not detailed).</li>
        </ul>
      </Section>

      {/* ═══ Endgame mechanic reworks ═══ */}
      <Section title="Endgame mechanic reworks">
        <p>
          All five major atlas mechanics get questlines, new pinnacle bosses,
          and atlas-tree integration:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Delirium</strong> — added visible depth indicator.</li>
          <li><strong>Breach</strong> — redesigned to reward sustained engagement; new enrage phases.</li>
          <li><strong>Ritual</strong> — restricted to <em>Uniques and Omens only</em> (significant scope cut).</li>
          <li><strong>Expedition</strong> — expanded into an ocean exploration system.</li>
          <li><strong>Abyss</strong> — extended with questlines and Abyssal Depths boss encounters.</li>
        </ul>
      </Section>

      {/* ═══ QoL & other ═══ */}
      <Section title="Quality of life">
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>In-game Build Guide system</strong> — community creators
            publish <code>.build</code> files (passive trees, gem selections,
            item suggestions, level notes) that import directly in-client.
          </li>
          <li><strong>Campaign difficulty reduced</strong> with better navigation aids (signs, environmental cues, cracks/trails).</li>
          <li><strong>Dreadnought mission shortened</strong> to a single map.</li>
          <li>Infinite Atlas now has fixed points of interest.</li>
        </ul>
      </Section>

      {/* ═══ Speculation flagged ═══ */}
      <Section title="What the announcement didn't address">
        <p>
          Items the pre-announcement watchlist expected but 0.5 either didn't
          spotlight or addressed too vaguely. Refresh this list on the
          patch-notes drop:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Waystone tier / mod-pool overhaul — only "+1 modifier on corrupted waystones" mentioned.</li>
          <li>Currency Exchange feature parity with PoE 1 — not mentioned.</li>
          <li>Trade improvements (auction-house equivalent) — not mentioned.</li>
          <li>Spirit reservation rework — not mentioned (treat 0.4 baseline as surviving).</li>
          <li>Weapon-set system tweaks — not mentioned.</li>
          <li>Charm system changes — not mentioned (treat 0.4 baseline as surviving).</li>
          <li>Trial of the Sekhemas / Trial of Chaos changes — not mentioned in announcement.</li>
        </ul>
      </Section>

      {/* ═══ Sources ═══ */}
      <Section title="Sources">
        <p className="text-xs">
          Cross-checked across announcement recaps. Where a claim is
          single-source it's flagged inline above.
        </p>
        <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg divide-y divide-white/[0.04]">
          <SourceRow name="Maxroll PoE 2 — patch 0.5 reveal summary" href="https://maxroll.gg/poe2/news/patch-0-5-return-of-the-ancients-reveal-summary" />
          <SourceRow name="Mobalytics — 0.5 livestream summary" href="https://mobalytics.gg/poe-2/guides/0-5-return-of-the-ancients-content-livestream-summary" />
          <SourceRow name="PCGamesN — endgame rework" href="https://www.pcgamesn.com/path-of-exile-2/patch-0-5-return-of-the-ancients-endgame-rework" />
          <SourceRow name="ProGameGuides — 0.5 patch overview" href="https://progameguides.com/path-of-exile-2/path-of-exile-2-return-of-the-ancients-0-5-patch/" />
          <SourceRow name="The Gamer — endgame update / atlas" href="https://www.thegamer.com/path-of-exile-2-return-of-the-ancients-endgame-update-atlas/" />
          <SourceRow name="GameWatcher — 0.5.0 update / Runes of Aldur" href="https://www.gamewatcher.com/news/path-of-exile-2-0-5-0-update-endgame-rework-runes-of-aldur" />
          <SourceRow name="Sportskeeda — 0.5 league mechanics / Ward / Expedition" href="https://www.sportskeeda.com/mmo/poe2-0-5-runes-aldur-league-mechanics-ward-expedition-changes" />
          <SourceRow name="Sportskeeda — 0.5 reveal recap" href="https://www.sportskeeda.com/mmo/path-exile-2-patch-0-5-reveal-recap-what-s-coming-return-ancients" />
          <SourceRow name="ComicBook.com — 0.5.0 preview" href="https://comicbook.com/gaming/feature/path-of-exile-2-0-5-0-return-of-the-ancients-preview-everything-to-know-about-the-massive-foundational-update/" />
          <SourceRow name="poe2db.tw" href="https://poe2db.tw/us/" />
          <SourceRow name="aRPG Timeline — PoE 2 page" href="https://www.arpg-timeline.com/game/path-of-exile2" />
        </div>
      </Section>

      {/* Footer */}
      <div className="border-t border-white/5 pt-6 flex items-center justify-between text-xs text-zinc-600">
        <Link to="/poe2" className="text-cyan-400/80 hover:text-cyan-300">← Back to PoE 2 home</Link>
        <span>Fan-made · not affiliated with Grinding Gear Games</span>
      </div>
    </div>
  );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Section({ title, level = 2, children }) {
  const Tag = level === 2 ? 'h2' : 'h3';
  const size = level === 2 ? 'text-xl' : 'text-base';
  return (
    <section>
      <Tag className={`${size} font-semibold text-zinc-200 mb-3`}>{title}</Tag>
      <div className="text-sm leading-relaxed text-zinc-300 space-y-3">{children}</div>
    </section>
  );
}

function Callout({ color, children }) {
  const colors = {
    cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
  };
  return (
    <div className={`border rounded-lg p-4 text-sm leading-relaxed ${colors[color]}`}>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr>
      <td className="py-2 pr-4 text-zinc-500 align-top text-xs uppercase tracking-wider whitespace-nowrap">{label}</td>
      <td className="py-2 text-zinc-300">{value}</td>
    </tr>
  );
}

function AscendancyRow({ name, klass, identity }) {
  return (
    <div className="p-4">
      <div className="flex items-baseline gap-2">
        <strong className="text-zinc-100">{name}</strong>
        <span className="text-xs text-zinc-500">·</span>
        <span className="text-xs text-cyan-300/80">{klass}</span>
      </div>
      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{identity}</p>
    </div>
  );
}

function SourceRow({ name, href }) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-4">
      <span className="text-xs text-zinc-300 truncate">{name}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-amber-400 hover:text-amber-300 whitespace-nowrap flex-shrink-0"
      >
        Source &rarr;
      </a>
    </div>
  );
}
