/**
 * Poe2MarkupRenderer.jsx — renders the custom markup grammar used in
 * PoE 2 `.build` files for every `additional_text` field.
 *
 * Grammar (from https://www.pathofexile.com/developer/docs/game):
 *   <bold>{...}            font-weight: bold
 *   <italic>{...}          font-style: italic   (docs example form)
 *   <italics>{...}         font-style: italic   (docs prose form — accept both)
 *   <underline>{...}       text-decoration: underline
 *   <red>{...}             color: red
 *   <green>{...}           color: green
 *   <rgb(r,g,b)>{...}      color: rgb(r,g,b)
 *
 * Tags nest: `<underline>{<red>{text}}` is valid.
 * Newlines (`\n`) become <br/> elements.
 * Malformed input falls back to literal text — never throws.
 *
 * Phase 1 reuses this component verbatim in the validator's preview pane.
 * Don't add validation here; that's the linter's job. This is presentation only.
 */

// Recognizes either a simple tag (bold/italic/italics/underline/red/green)
// or an rgb(r,g,b) tag. Anchored to the opening `<` so we only try when
// the tokenizer is at a `<`.
const TAG_RE = /^<(bold|italic|italics|underline|red|green|rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))>\{/;

function findMatchingBrace(text, start) {
  let depth = 1;
  for (let k = start; k < text.length; k++) {
    if (text[k] === '{') depth++;
    else if (text[k] === '}') {
      depth--;
      if (depth === 0) return k;
    }
  }
  return -1;
}

function wrap(tag, rgb, children, key) {
  if (rgb) {
    const [, , r, g, b] = rgb;
    return <span key={key} style={{ color: `rgb(${r}, ${g}, ${b})` }}>{children}</span>;
  }
  switch (tag) {
    case 'bold':
      return <strong key={key} className="font-bold text-zinc-100">{children}</strong>;
    case 'italic':
    case 'italics':
      return <em key={key} className="italic">{children}</em>;
    case 'underline':
      return <span key={key} className="underline decoration-zinc-500 underline-offset-2">{children}</span>;
    case 'red':
      return <span key={key} className="text-red-400">{children}</span>;
    case 'green':
      return <span key={key} className="text-emerald-400">{children}</span>;
    default:
      return <span key={key}>{children}</span>;
  }
}

function parse(text, keyPath = '0') {
  const out = [];
  let i = 0;
  let idx = 0;

  while (i < text.length) {
    const ch = text[i];

    if (ch === '<') {
      const m = text.slice(i).match(TAG_RE);
      if (m) {
        const isRgb = m[1].startsWith('rgb(');
        const close = findMatchingBrace(text, i + m[0].length);
        if (close !== -1) {
          const inner = text.slice(i + m[0].length, close);
          const childKey = `${keyPath}-${idx}c`;
          const children = parse(inner, childKey);
          out.push(wrap(m[1], isRgb ? m : null, children, `${keyPath}-${idx++}`));
          i = close + 1;
          continue;
        }
        // Unbalanced — graceful fallback: render the `<` literally,
        // advance one char, keep parsing.
      }
    }

    if (ch === '\n') {
      out.push(<br key={`${keyPath}-${idx++}br`} />);
      i++;
      continue;
    }

    // Text run — collect everything until the next `<` or `\n`.
    let j = i;
    while (j < text.length && text[j] !== '<' && text[j] !== '\n') j++;
    if (j > i) {
      out.push(<span key={`${keyPath}-${idx++}t`}>{text.slice(i, j)}</span>);
      i = j;
    } else {
      // Stuck (a `<` that didn't match a tag) — emit the char and advance.
      out.push(<span key={`${keyPath}-${idx++}t`}>{text[i]}</span>);
      i++;
    }
  }

  return out;
}

export default function Poe2MarkupRenderer({ text, className = '' }) {
  if (typeof text !== 'string') return null;
  return <span className={className}>{parse(text)}</span>;
}
