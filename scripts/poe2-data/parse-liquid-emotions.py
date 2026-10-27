#!/usr/bin/env python3
"""
Parse poe2db.tw/us/Liquid_Emotions raw HTML into structured anointing data.

Source : poe2db.tw/us/Liquid_Emotions (datamined)
Outputs:
  - src/data/poe2/anointing/emotions.json      (10 base + 3 Potent emotions)
  - src/data/poe2/anointing/combinations.json   (ordered triple -> notable)

Re-run: fetch the page to scripts/poe2-data/.cache/liquid_emotions.html, then
        run this script. It is idempotent and overwrites the JSON outputs.

Provenance: every output carries _meta with scrapedAt. ORDERED triples are preserved verbatim from the page (slot sequence kept).
"""
import json
import os
import re
import sys
from html import unescape

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HTML_PATH = os.path.join(REPO, "scripts", "poe2-data", ".cache", "liquid_emotions.html")
OUT_DIR = os.path.join(REPO, "src", "data", "poe2", "anointing")
SCRAPED_AT = "2026-10-27"

# Emotion item-page slug (the href on each emotion link) -> (slug, displayName, tier).
# Potent emotions (Contempt / Ferocity / Melancholy) also instill amulets.
EMOTION_META = {
    "Diluted_Liquid_Ire":            ("ire",        "Ire",        "diluted"),
    "Diluted_Liquid_Guilt":          ("guilt",      "Guilt",      "diluted"),
    "Diluted_Liquid_Greed":          ("greed",      "Greed",      "diluted"),
    "Liquid_Paranoia":               ("paranoia",   "Paranoia",   "standard"),
    "Liquid_Envy":                   ("envy",       "Envy",       "standard"),
    "Liquid_Disgust":                ("disgust",    "Disgust",    "standard"),
    "Liquid_Despair":                ("despair",    "Despair",    "standard"),
    "Concentrated_Liquid_Fear":      ("fear",       "Fear",       "concentrated"),
    "Concentrated_Liquid_Suffering": ("suffering",  "Suffering",  "concentrated"),
    "Concentrated_Liquid_Isolation": ("isolation",  "Isolation",  "concentrated"),
    "Potent_Liquid_Contempt":        ("contempt",   "Contempt",   "potent"),
    "Potent_Liquid_Ferocity":        ("ferocity",   "Ferocity",   "potent"),
    "Potent_Liquid_Melancholy":      ("melancholy", "Melancholy", "potent"),
}


def strip_tags(s):
    return unescape(re.sub(r"<[^>]+>", "", s)).strip()


def collapse_ws(s):
    return re.sub(r"\s+", " ", s).strip()


def main():
    if not os.path.exists(HTML_PATH):
        sys.exit(f"HTML fixture not found: {HTML_PATH}\n"
                 "Fetch it first: curl -L -A '<UA>' "
                 "https://poe2db.tw/us/Liquid_Emotions -o " + HTML_PATH)

    html = open(HTML_PATH, "r", encoding="utf-8").read()

    # Isolate the "Liquid Emotions Passives" tab pane to avoid catching the
    # 10 item-definition cards / unrelated PassiveSkills links elsewhere.
    start = html.find('id="LiquidEmotionsPassives"')
    if start == -1:
        sys.exit("Could not locate LiquidEmotionsPassives section.")
    # The section runs to the next top-level tab-pane id (or EOF). Find the
    # next `tab-pane` after a healthy offset.
    nxt = html.find('class="tab-pane fade"', start + 50)
    section = html[start:nxt] if nxt != -1 else html[start:]

    # Header count.
    m = re.search(r"Liquid Emotions Passives\s*/(\d+)", section)
    header_count = int(m.group(1)) if m else None

    # Each recipe is a <div class="col"> ... </div> card. Split on the col
    # boundary; each card holds one PassiveSkills anchor + one property block
    # with three emotion anchors (emotion item links).
    cards = re.split(r'<div class="col">', section)[1:]

    recipes = []
    notable_ids_seen = {}
    skipped = 0
    multi_emotion_anchor_warn = 0

    for card in cards:
        # Notable name + skill id.
        nm = re.search(
            r'<a class="PassiveSkills"\s+data-hover="[^"]*"\s+href="([^"]*)">([^<]+)</a>',
            card,
        )
        if not nm:
            skipped += 1
            continue
        skill_id = nm.group(1)
        notable = unescape(nm.group(2)).strip()

        # Ordered emotion sequence: every emotion item link inside the
        # property block, in document order = slot order.
        prop = re.search(r'<div class="property">(.*?)<div class="separator">', card, re.S)
        prop_html = prop.group(1) if prop else card
        emo_ids = re.findall(r'class="BlightCraftingItems" href="([^"]+)"', prop_html)
        if len(emo_ids) != 3:
            # If not exactly 3, skip honestly rather than guess.
            skipped += 1
            multi_emotion_anchor_warn += 1
            continue
        try:
            seq = [EMOTION_META[e][0] for e in emo_ids]
        except KeyError:
            skipped += 1
            continue

        # Effect text: the mod div(s) after the separator.
        eff = re.search(r'<div class="separator"></div>(.*)$', card, re.S)
        # Block tags separate mod lines; turn them into spaces before stripping.
        effect = collapse_ws(strip_tags(re.sub(r"</div>|<br\s*/?>", " ", eff.group(1)))) if eff else ""

        rec = {"e": seq, "notable": notable, "id": skill_id}
        if effect:
            rec["effect"] = effect
        recipes.append(rec)
        notable_ids_seen[skill_id] = notable

    # ---- emotions.json ----
    emotions = [
        {"id": slug, "displayName": disp, "tier": tier}
        for (slug, disp, tier) in EMOTION_META.values()
    ]

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, "emotions.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(
            {
                "_meta": {
                    "source": "poe2db.tw/us/Liquid_Emotions",
                    "scrapedAt": SCRAPED_AT,
                    "provenance": "datamined, patch 0.5.5",
                    "count": len(emotions),
                },
                "emotions": emotions,
            },
            f,
            indent=2,
            ensure_ascii=False,
        )

    # ---- combinations.json ----
    with open(os.path.join(OUT_DIR, "combinations.json"), "w", encoding="utf-8", newline="\n") as f:
        json.dump(
            {
                "_meta": {
                    "source": "poe2db.tw/us/Liquid_Emotions",
                    "scrapedAt": SCRAPED_AT,
                    "provenance": "datamined, patch 0.5.5",
                    "ordered": True,
                    "headerCount": header_count,
                    "count": len(recipes),
                },
                "recipes": recipes,
            },
            f,
            indent=0,
            ensure_ascii=False,
            separators=(",", ":"),
        )

    print(f"header /{header_count} -> captured {len(recipes)} recipes "
          f"({len(notable_ids_seen)} distinct notable ids); skipped {skipped} cards "
          f"({multi_emotion_anchor_warn} not-exactly-3-emotion)")


if __name__ == "__main__":
    main()
