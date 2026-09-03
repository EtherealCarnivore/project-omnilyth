/**
 * Poe2BuildFileLint.jsx — Phase 0 preview page body.
 *
 * Ships a working markup-tag renderer as the page hero. The validator,
 * diagnostics list, and normalized download all wire up at the 0.5 launch
 * (2026-05-29) — see memory/project_build_file_lint_preview.md for the
 * full phase plan.
 *
 * The example sentence below exercises every supported markup tag and
 * doubles as the Phase 1 regression fixture: when the validator lands,
 * pasting this exact string into the textarea should produce diagnostics
 * that match the renderer's behavior, end-to-end.
 */
import Poe2MarkupRenderer from './Poe2MarkupRenderer';

const DEMO_EXAMPLE = `<bold>{Shield Wall} is your <green>{main damage skill} starting at <red>{level 22}.
Use <italic>{Permafrost Bolts} to freeze enemies while leveling.
<underline>{<rgb(217, 180, 110)>{Pro tip}}: keep a one-hand mace and shield in your <italics>{second weapon set}.`;

const CAPABILITIES = [
  {
    title: 'Paste or drop a .build file',
    body: 'Reads JSON straight from the clipboard or a file drop. No upload, all in-browser.',
  },
  {
    title: 'Schema diagnostics',
    body: 'Every BuildPassive, BuildSkill, BuildItem, and BuildSupport field validated against the published spec — with JSON-path pointers to each issue.',
  },
  {
    title: 'Markup preview and normalized download',
    body: 'See exactly what every additional_text field will render as in-game. Export a clean, pretty-printed .build for sharing.',
  },
];

export default function Poe2BuildFileLint() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-zinc-100">Build File Linter</h1>
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300/90 font-semibold">
            Preview
          </span>
        </div>
        <p className="text-sm text-zinc-400 max-w-2xl">
          Validate and inspect <code className="text-zinc-300 text-[0.85em] px-1 py-0.5 rounded bg-zinc-900/80 border border-white/[0.04]">.build</code> files
          for the new Path of Exile 2 build planner. The markup-tag renderer is live; the validator wires up at the 0.5 launch.
        </p>
      </header>

      {/* HERO — markup-renderer demo */}
      <section
        className="bg-zinc-900/60 backdrop-blur-sm border border-white/[0.06] rounded-lg p-5 space-y-3"
        aria-labelledby="markup-demo-heading"
      >
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 id="markup-demo-heading" className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
            Markup preview
          </h2>
          <span className="text-[11px] text-zinc-500">
            How <code className="text-zinc-400 text-[0.95em]">additional_text</code> renders in-game
          </span>
        </div>

        <div className="rounded-md bg-black/40 border border-white/[0.04] p-3 sm:p-4 text-sm text-zinc-300 leading-relaxed break-words">
          <Poe2MarkupRenderer text={DEMO_EXAMPLE} />
        </div>

        <details className="text-xs text-zinc-500">
          <summary className="cursor-pointer hover:text-zinc-300 transition-colors select-none">Source string</summary>
          <pre className="mt-2 p-3 rounded bg-black/40 border border-white/[0.04] text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all">
{DEMO_EXAMPLE}
          </pre>
        </details>

        <p className="text-xs text-zinc-500">
          All tags from the{' '}
          <a
            href="https://www.pathofexile.com/developer/docs/game"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-200 underline decoration-zinc-700 underline-offset-2 transition-colors"
          >
            official format spec
          </a>{' '}
          ↗
        </p>
      </section>

      {/* Launch banner */}
      <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] p-3 text-xs text-cyan-200/80">
        <strong className="font-semibold text-cyan-200">The <code className="text-[0.95em]">.build</code> format goes live with PoE 2 0.5 on May 29.</strong>{' '}
        Full validator and normalized download wire up on launch week.
      </div>

      {/* Capabilities */}
      <section aria-labelledby="capabilities-heading" className="space-y-3">
        <h2 id="capabilities-heading" className="text-sm font-semibold text-zinc-200 uppercase tracking-wide">
          What ships at launch
        </h2>
        <ul className="space-y-2">
          {CAPABILITIES.map((cap) => (
            <li
              key={cap.title}
              className="bg-zinc-900/40 border border-white/[0.04] rounded-lg p-4"
            >
              <h3 className="text-sm font-semibold text-zinc-200">{cap.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{cap.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
