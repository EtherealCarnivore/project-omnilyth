import { readFileSync } from "fs";
const d = JSON.parse(readFileSync("src/data/passive/passiveTreeData.json", "utf8"));

// Root connections - these span entire tree
const root = d.nodes.root;
console.log("Root out connections:", root.out.length);

for (const id of root.out) {
  const n = d.nodes[id];
  if (n === undefined) { console.log(id, "-> NOT FOUND"); continue; }
  const type = n.classStartIndex !== undefined ? "CLASS_START"
    : n.isAscendancyStart ? "ASC_START"
    : n.ascendancyName ? "ASC_NODE" : "OTHER";
  console.log("  ", id, "->", type, n.name || "(no name)", n.ascendancyName || "");
}

// Count connections that involve root or unpositioned nodes
let rootConns = 0;
let noGroupConns = 0;
let ascToMainConns = 0;
for (const [id, n] of Object.entries(d.nodes)) {
  for (const outId of (n.out || [])) {
    if (id === "root" || outId === "root") rootConns++;
    const target = d.nodes[outId];
    if (n.group === undefined || (target && target.group === undefined)) noGroupConns++;
    // Ascendancy node connected to non-ascendancy node (cross-tree)
    if (n.ascendancyName && target && !target.ascendancyName) ascToMainConns++;
    if (!n.ascendancyName && target && target.ascendancyName) ascToMainConns++;
  }
}
console.log("\nConnections involving root:", rootConns);
console.log("Connections with no-group nodes:", noGroupConns);
console.log("Cross asc-to-main connections:", ascToMainConns);

// Ascendancy nodes without group (these have no position)
const ascNoGroup = Object.entries(d.nodes).filter(([k,v]) => v.ascendancyName && v.group === undefined);
console.log("Ascendancy nodes without group:", ascNoGroup.length);

// Regular nodes without group
const regNoGroup = Object.entries(d.nodes).filter(([k,v]) => !v.ascendancyName && v.group === undefined && k !== "root");
console.log("Regular nodes without group:", regNoGroup.length);
if (regNoGroup.length > 0) {
  console.log("  Sample:", regNoGroup.slice(0,3).map(([k,v]) => `${k}: ${v.name}`));
}

// Check: nodes where group exists but group not in groups
const missingGroups = Object.entries(d.nodes).filter(([k,v]) => v.group !== undefined && !d.groups[v.group]);
console.log("Nodes with missing group ref:", missingGroups.length);
