(function() {
    "use strict";

    function fact(n) {
        if (n <= 1) return 1;
        var result = 1;
        for (var i = 2; i <= n; i++) result *= i;
        return result;
    }

    function multinomial(n, r, g, b) {
        return fact(n) / (fact(r) * fact(g) * fact(b));
    }

    function taintedExactChance(N, r, g, b) {
        return multinomial(N, r, g, b) / Math.pow(3, N);
    }

    function showError(msg) {
        var body = document.getElementById("tainted-resultbody");
        body.innerHTML = '<tr class="prob"><td colspan="3" style="color:#FF6666;">' + msg + '</td></tr>';
    }

    function taintedCalculate() {
        var socketsInput = document.getElementById("tainted-sockets");
        var redInput = document.getElementById("tainted-red");
        var greenInput = document.getElementById("tainted-green");
        var blueInput = document.getElementById("tainted-blue");

        var r = redInput.value === "" ? 0 : parseInt(redInput.value, 10);
        var g = greenInput.value === "" ? 0 : parseInt(greenInput.value, 10);
        var b = blueInput.value === "" ? 0 : parseInt(blueInput.value, 10);

        // Auto-fill total sockets if empty
        if (socketsInput.value === "") {
            var sum = r + g + b;
            if (sum > 0 && sum <= 6) {
                socketsInput.value = sum;
            }
        }

        var N = parseInt(socketsInput.value, 10);

        if (isNaN(N) || N < 1 || N > 6) {
            showError("Total sockets must be between 1 and 6.");
            return;
        }
        if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || g < 0 || b < 0) {
            showError("Desired colors must be non-negative integers.");
            return;
        }
        if (r + g + b > N) {
            showError("Desired colors (" + (r + g + b) + ") exceed total sockets (" + N + ").");
            return;
        }

        var specified = r + g + b;
        var free = N - specified;
        var totalChance = 0;

        // Enumerate all ways to distribute free sockets among R, G, B
        for (var fr = 0; fr <= free; fr++) {
            for (var fg = 0; fg <= free - fr; fg++) {
                var fb = free - fr - fg;
                totalChance += taintedExactChance(N, r + fr, g + fg, b + fb);
            }
        }

        var avg = 1 / totalChance;
        // Geometric distribution: std dev = sqrt((1-p)/p^2)
        var stddev = Math.sqrt((1 - totalChance) / (totalChance * totalChance));

        var body = document.getElementById("tainted-resultbody");
        body.innerHTML = '<tr class="prob">' +
            '<td>' + (totalChance * 100).toFixed(4) + '%</td>' +
            '<td>' + avg.toFixed(2) + '</td>' +
            '<td>' + stddev.toFixed(2) + '</td>' +
            '</tr>';
    }

    // Expose to global scope for onclick
    window.taintedCalculate = taintedCalculate;
})();
