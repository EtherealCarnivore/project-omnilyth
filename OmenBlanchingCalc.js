(function() {
    "use strict";

    // Reimplemented from PoEChromaticCalc.js:245-270
    function getColorChances(str, dex, int) {
        var X = 5;
        var C = 5;
        var maxOnColorChance = 0.9;
        var reqs = [str, dex, int];
        var totalReqs = str + dex + int;
        var numReqs = reqs.filter(function(r) { return r > 0; }).length;

        if (numReqs === 0) {
            // No requirements: equal chance
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
            // 3 requirements
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

    // Probability of exactly (dr, dg, db) in N colored sockets
    function multinomialProb(N, dr, dg, db, pr, pg, pb) {
        var free = N - dr - dg - db;
        if (free < 0) return 0;

        var totalChance = 0;
        // Enumerate distributions of free sockets among R, G, B
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
        var body = document.getElementById("blanching-resultbody");
        body.innerHTML = '<tr class="prob"><td colspan="3" style="color:#FF6666;">' + msg + '</td></tr>';
    }

    function blanchingCalculate() {
        var socketsInput = document.getElementById("blanching-sockets");
        var strInput = document.getElementById("blanching-str");
        var dexInput = document.getElementById("blanching-dex");
        var intInput = document.getElementById("blanching-int");
        var redInput = document.getElementById("blanching-red");
        var greenInput = document.getElementById("blanching-green");
        var blueInput = document.getElementById("blanching-blue");
        var whiteInput = document.getElementById("blanching-white");

        var str = strInput.value === "" ? 0 : parseInt(strInput.value, 10);
        var dex = dexInput.value === "" ? 0 : parseInt(dexInput.value, 10);
        var int = intInput.value === "" ? 0 : parseInt(intInput.value, 10);
        var r = redInput.value === "" ? 0 : parseInt(redInput.value, 10);
        var g = greenInput.value === "" ? 0 : parseInt(greenInput.value, 10);
        var b = blueInput.value === "" ? 0 : parseInt(blueInput.value, 10);
        var w = whiteInput.value === "" ? 0 : parseInt(whiteInput.value, 10);

        // Auto-fill total sockets if empty
        if (socketsInput.value === "") {
            var sum = r + g + b + w;
            if (sum > 0 && sum <= 6) {
                socketsInput.value = sum;
            }
        }

        var N = parseInt(socketsInput.value, 10);

        // Validation
        if (isNaN(N) || N < 1 || N > 6) {
            showError("Total sockets must be between 1 and 6.");
            return;
        }
        if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(w) || r < 0 || g < 0 || b < 0 || w < 0) {
            showError("Desired colors must be non-negative integers.");
            return;
        }
        if (w < 1) {
            showError("White sockets (W) must be at least 1 for Omen of Blanching.");
            return;
        }
        if (r + g + b + w > N) {
            showError("Desired colors (" + (r + g + b + w) + ") exceed total sockets (" + N + ").");
            return;
        }

        var chances = getColorChances(str, dex, int);
        var pWhite = { 1: 0.50, 2: 0.25, 3: 0.25 };
        var totalProb = 0;

        for (var wRoll = 1; wRoll <= 3; wRoll++) {
            if (wRoll > N) continue;
            // wRoll white sockets produced; need at least w of them
            if (wRoll < w) continue;
            // Remaining colored sockets
            var colored = N - wRoll;
            // Need enough colored sockets for desired R+G+B
            if (colored < r + g + b) continue;

            var colorProb = multinomialProb(colored, r, g, b, chances.r, chances.g, chances.b);
            totalProb += pWhite[wRoll] * colorProb;
        }

        var avg = totalProb > 0 ? 1 / totalProb : Infinity;
        var stddev = totalProb > 0 ? Math.sqrt((1 - totalProb) / (totalProb * totalProb)) : Infinity;

        var body = document.getElementById("blanching-resultbody");
        if (totalProb === 0) {
            body.innerHTML = '<tr class="prob"><td colspan="3" style="color:#FF6666;">Impossible with these parameters.</td></tr>';
        } else {
            body.innerHTML = '<tr class="prob">' +
                '<td>' + (totalProb * 100).toFixed(4) + '%</td>' +
                '<td>' + avg.toFixed(2) + '</td>' +
                '<td>' + stddev.toFixed(2) + '</td>' +
                '</tr>';
        }
    }

    window.blanchingCalculate = blanchingCalculate;
})();
