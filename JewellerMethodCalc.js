(function() {
    "use strict";

    var BENCH_COST = [0, 1, 1, 3, 10, 70, 350]; // index = socket count

    function getColorChances(str, dex, int) {
        var X = 5;
        var C = 5;
        var maxOnColorChance = 0.9;
        var reqs = [str, dex, int];
        var totalReqs = str + dex + int;
        var numReqs = reqs.filter(function(r) { return r > 0; }).length;

        if (numReqs === 0) {
            return { r: 1/3, g: 1/3, b: 1/3 };
        }

        var chances;
        if (numReqs === 1) {
            chances = reqs.map(function(req) {
                if (req > 0) {
                    return maxOnColorChance * (X + C + req) / (totalReqs + 3 * X + C);
                } else {
                    return (1 - maxOnColorChance) / 2 + maxOnColorChance * (X / (totalReqs + 3 * X + C));
                }
            });
        } else if (numReqs === 2) {
            chances = reqs.map(function(req) {
                if (req > 0) {
                    return maxOnColorChance * req / totalReqs;
                } else {
                    return 1 - maxOnColorChance;
                }
            });
        } else {
            chances = reqs.map(function(req) {
                return req / totalReqs;
            });
        }

        return { r: chances[0], g: chances[1], b: chances[2] };
    }

    function fact(n) {
        if (n <= 1) return 1;
        var result = 1;
        for (var i = 2; i <= n; i++) result *= i;
        return result;
    }

    function multinomialProb(N, dr, dg, db, pr, pg, pb) {
        var free = N - dr - dg - db;
        if (free < 0) return 0;

        var totalChance = 0;
        for (var fr = 0; fr <= free; fr++) {
            for (var fg = 0; fg <= free - fr; fg++) {
                var fb = free - fr - fg;
                var tr = dr + fr;
                var tg = dg + fg;
                var tb = db + fb;
                var coeff = fact(N) / (fact(tr) * fact(tg) * fact(tb));
                totalChance += coeff * Math.pow(pr, tr) * Math.pow(pg, tg) * Math.pow(pb, tb);
            }
        }
        return totalChance;
    }

    function showError(msg) {
        var body = document.getElementById("jeweller-resultbody");
        body.innerHTML = '<tr class="prob"><td colspan="3" style="color:#FF6666;">' + msg + '</td></tr>';
    }

    function jewellersCalculate() {
        var socketsInput = document.getElementById("jeweller-sockets");
        var strInput = document.getElementById("jeweller-str");
        var dexInput = document.getElementById("jeweller-dex");
        var intInput = document.getElementById("jeweller-int");
        var redInput = document.getElementById("jeweller-red");
        var greenInput = document.getElementById("jeweller-green");
        var blueInput = document.getElementById("jeweller-blue");

        var str = strInput.value === "" ? 0 : parseInt(strInput.value, 10);
        var dex = dexInput.value === "" ? 0 : parseInt(dexInput.value, 10);
        var int = intInput.value === "" ? 0 : parseInt(intInput.value, 10);
        var dr = redInput.value === "" ? 0 : parseInt(redInput.value, 10);
        var dg = greenInput.value === "" ? 0 : parseInt(greenInput.value, 10);
        var db = blueInput.value === "" ? 0 : parseInt(blueInput.value, 10);

        // Auto-fill total sockets if empty
        if (socketsInput.value === "") {
            var sum = dr + dg + db;
            if (sum >= 2 && sum <= 6) {
                socketsInput.value = sum;
            }
        }

        var N = parseInt(socketsInput.value, 10);

        // Validation
        if (isNaN(N) || N < 2 || N > 6) {
            showError("Total sockets must be between 2 and 6.");
            return;
        }
        if (isNaN(dr) || isNaN(dg) || isNaN(db) || dr < 0 || dg < 0 || db < 0) {
            showError("Desired colors must be non-negative integers.");
            return;
        }
        if (dr + dg + db > N) {
            showError("Desired colors (" + (dr + dg + db) + ") exceed total sockets (" + N + ").");
            return;
        }

        var chances = getColorChances(str, dex, int);
        var colorProbs = { r: chances.r, g: chances.g, b: chances.b };

        // For each base size, find optimal strategy
        var strategies = [];
        var bestIdx = -1;
        var bestTotal = Infinity;

        for (var base = 1; base <= N; base++) {
            var bestForBase = null;
            var bestCostForBase = Infinity;

            // Enumerate all ways to split desired colors into base vs added
            // base_r + base_g + base_b <= base, base_r <= dr, etc.
            for (var br = 0; br <= Math.min(dr, base); br++) {
                for (var bg = 0; bg <= Math.min(dg, base - br); bg++) {
                    for (var bb = 0; bb <= Math.min(db, base - br - bg); bb++) {
                        var baseColored = br + bg + bb;
                        var baseFree = base - baseColored;

                        // Remaining desired colors to add via jewellers
                        var addR = dr - br;
                        var addG = dg - bg;
                        var addB = db - bb;
                        var addTotal = addR + addG + addB;
                        var addFree = N - base - addTotal;

                        if (addFree < 0) continue;

                        // Chromatic cost for base sockets
                        var chromeProb = multinomialProb(base, br, bg, bb, colorProbs.r, colorProbs.g, colorProbs.b);
                        var chromeCost;
                        if (base === 0) {
                            chromeCost = 0;
                        } else if (chromeProb <= 0) {
                            continue; // impossible
                        } else {
                            chromeCost = 1 / chromeProb;
                        }

                        // Build list of probabilities for added sockets
                        // Desired-color sockets first, then free sockets
                        var addedProbs = [];
                        for (var i = 0; i < addR; i++) addedProbs.push(colorProbs.r);
                        for (var i = 0; i < addG; i++) addedProbs.push(colorProbs.g);
                        for (var i = 0; i < addB; i++) addedProbs.push(colorProbs.b);
                        // Sort ascending: hardest colors at cheapest (lowest) socket positions
                        addedProbs.sort(function(a, b) { return a - b; });
                        // Free sockets (any color works, p=1)
                        for (var i = 0; i < addFree; i++) addedProbs.push(1);

                        // Jeweller cost: bench cost to reach base + sum of E_i
                        var jewellerCost = BENCH_COST[base];
                        for (var i = 0; i < addedProbs.length; i++) {
                            var socketIdx = base + 1 + i; // socket number being added
                            var p = addedProbs[i];
                            // E_i = (benchCost[socketIdx] + (1-p)*benchCost[socketIdx-1]) / p
                            var ei = (BENCH_COST[socketIdx] + (1 - p) * BENCH_COST[socketIdx - 1]) / p;
                            jewellerCost += ei;
                        }

                        var totalCost = chromeCost + jewellerCost;
                        if (totalCost < bestCostForBase) {
                            bestCostForBase = totalCost;
                            bestForBase = {
                                base: base,
                                baseR: br, baseG: bg, baseB: bb,
                                chromeCost: chromeCost,
                                jewellerCost: jewellerCost,
                                totalCost: totalCost
                            };
                        }
                    }
                }
            }

            if (bestForBase) {
                strategies.push(bestForBase);
                if (bestForBase.totalCost < bestTotal) {
                    bestTotal = bestForBase.totalCost;
                    bestIdx = strategies.length - 1;
                }
            }
        }

        // Render results
        var body = document.getElementById("jeweller-resultbody");
        if (strategies.length === 0) {
            body.innerHTML = '<tr class="prob"><td colspan="3" style="color:#FF6666;">No valid strategy found.</td></tr>';
            return;
        }

        var html = "";
        for (var i = 0; i < strategies.length; i++) {
            var s = strategies[i];
            var rowClass = (i === bestIdx) ? "prob best-jeweller" : "prob";
            var label;
            if (s.base === N) {
                label = "Pure Chromatic (" + N + "S)";
            } else {
                label = "Chrome " + s.base + "S → Jeweller to " + N + "S";
            }
            var chromeStr = s.chromeCost < 1000000 ? s.chromeCost.toFixed(2) : s.chromeCost.toExponential(2);
            var jewStr = s.jewellerCost.toFixed(2);
            html += '<tr class="' + rowClass + '">' +
                '<td>' + label + '</td>' +
                '<td>' + chromeStr + '</td>' +
                '<td>' + jewStr + '</td>' +
                '</tr>';
        }
        body.innerHTML = html;
    }

    window.jewellersCalculate = jewellersCalculate;
})();
