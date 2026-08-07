/*
 * RetiredCalcShell.jsx — Renders a calculator inert without deleting it.
 *
 * For tools whose underlying mechanic a patch removed. We keep the UI visible
 * (deep links land on an explanation instead of a 404, and it's obvious what
 * used to live here) but nothing can be typed into or clicked.
 *
 * Uses <fieldset disabled> rather than a pointer-events-none overlay: the
 * native attribute disables every descendant control AND removes them from
 * the tab order, so a keyboard user can't land in a dead form that silently
 * does nothing. aria-hidden keeps it out of the screen-reader tree entirely —
 * the reason banner above it carries the meaning.
 *
 * fieldset resets: browsers give it default border/margin/padding and a
 * min-width:min-content that breaks nested grid/flex children, hence min-w-0.
 */

export default function RetiredCalcShell({ children }) {
  return (
    <fieldset
      disabled
      aria-hidden="true"
      className="m-0 p-0 border-0 min-w-0 opacity-40 saturate-50 select-none cursor-not-allowed"
    >
      {children}
    </fieldset>
  );
}
