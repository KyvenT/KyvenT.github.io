const xValues = [];
const pdfValues = [];
var chart;

// Onload functions 
window.onload = function() {
    prepareListeners();
}

// Sets up listeners
function prepareListeners() {
    firstHide();
    var distributionSelect = document.getElementById("distributionSelect");
    distributionSelect.addEventListener("input", chooseDistribution);
    var binomialCalcButton = document.getElementById("calculateBinomialButton")
    binomialCalcButton.addEventListener("click", graphBinomial);
    var poissonCalcButton = document.getElementById("calculatePoissonButton");
    poissonCalcButton.addEventListener("click", graphPoisson);
    var normalCalcButton = document.getElementById("calculateNormalButton");
    normalCalcButton.addEventListener("click", graphNormal);
}

// User distribution selection, displays selected distribution parameter inputs
function chooseDistribution() {
    var distribution;
    var selectBox = document.getElementById("distributionSelect");
    distribution = selectBox.options[selectBox.selectedIndex].value;
    if (chart != null) {
        chart.destroy();
    }
    document.getElementById("pdf").style.display = 'none';
    hideCalculationAreas();
    switch(distribution) {
        case "Binomial":
            var binomialArea = document.getElementById("binomialCalc");
            binomialArea.style.display = 'block';
            break;
        case "Poisson":
            var poissonArea = document.getElementById("poissonCalc");
            poissonArea.style.display = 'block';
            break;
        case "Normal":
            var normalArea = document.getElementById("normalCalc");
            normalArea.style.display = 'block';
            break;
    }
}

// Hides all parameter inputs except for Binomial distribution on first load
function firstHide() {
    var poissonArea;
    poissonArea = document.getElementById("poissonCalc");
    poissonArea.style.display = 'none';
    var normalArea;
    normalArea = document.getElementById("normalCalc");
    normalArea.style.display = 'none'; 
}

// Hides all parameter inputs
function hideCalculationAreas() {
    graphChart();
    var binomialArea;
    binomialArea = document.getElementById("binomialCalc");
    binomialArea.style.display = 'none';
    var poissonArea;
    poissonArea = document.getElementById("poissonCalc");
    poissonArea.style.display = 'none';
    var normalArea;
    normalArea = document.getElementById("normalCalc");
    normalArea.style.display = 'none';
}

// Creates chart with xValues and pdfValues
function graphChart() {
    // Get a reference to the canvas element
    var chartElement = document.getElementById('pdf').getContext('2d');

    // Create the chart
    chart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: "",
                data: pdfValues,
                pointRadius: 1,
                fill: true
            }]
        },
        options: {
            autoSkip: true,
            scales: {
                x: {
                    min: 0,
                    max: xValues.length
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: true
                    },
                    zoom: {
                        scaleMode: 'xy'
                    }
                }
            }
        }
    });
    document.getElementById("pdf").style.display = 'block';
}


// ***** CREATING GRAPH FUNCTIONS *****
// Creates Binomial Graph
function graphBinomial() {
    var n = document.getElementById("nBinomial").valueAsNumber;
    var p = document.getElementById("pBinomial").valueAsNumber;

    while (xValues.length > 0) {
        xValues.pop();
        pdfValues.pop();
    }

    for (let x = 0; x <= n; x++) {
        xValues.push(x);
        pdfValues.push(binomialFunction(n, p, x));
    }
    redrawChart();
    
}

// Creates Poisson Graph
function graphPoisson() {
    var mean = document.getElementById("meanPoisson").valueAsNumber;
    var areaCalculated = 0;
    var x;
    if (Math.floor(mean - (2 * (mean ** (1/2)))) > 0) {
        x = Math.floor(mean - (2 * (mean ** (1/2))));
    } else {
        x = 0;
    }

    while (xValues.length > 0) {
        xValues.pop();
        pdfValues.pop();
    }

    while (areaCalculated < 0.95) {
        xValues.push(x);
        pdfValues.push(poissonFunction(mean, x));
        areaCalculated += poissonFunction(mean, x);
        x += 1;
    }
    redrawChart();
}

// Creates Normal Graph
function graphNormal() {
    var mean = document.getElementById("meanNormal").valueAsNumber;
    var variance = document.getElementById("varianceNormal").valueAsNumber;
    var stdDeviation = variance ** (1/2);
    var x = 100 * (mean - (2 * stdDeviation));
    var endDrawing = 100 * (mean + (2 * stdDeviation));

    while (xValues.length > 0) {
        xValues.pop();
        pdfValues.pop();
    }

    while (x <= endDrawing) {
        xValues.push(Math.floor(x/100));
        pdfValues.push(normalFunction(mean, stdDeviation, x));
        x += 1;
    }
    redrawChart();

}

// Recreates chart
function redrawChart() {
    if (chart != null) {
        chart.destroy();
    }
    graphChart();
}


// Quick factorial function for non-negative integers
function factorial(x) {
    if (x % 1 != 0 || x < 0) {
        return;
    }
    if (x == 0 || x == 1) {
        return 1;
    }
    return x * factorial(x - 1);
}

// ***** PROBABILITY DISTRIBUTION FUNCTIONS *****
// Binomial Probability Distribution Function
function binomialFunction(n, p, x) {
    return ((factorial(n))/(factorial(n - x) * factorial(x))) * (p**x) * ((1 - p)**(n - x));
}

// Poisson Probability Distribution Function
function poissonFunction(mean, x) {
    return ((mean ** x)/(factorial(x))) * (2.71828182845904523536 ** (-1 * mean));
}

// Normal Probability Distribution Functions
function normalFunction(mean, stdDeviation, x) {
    return (1 / (stdDeviation * ((2 * 3.1415926535) ** (1/2)))) * (2.71828182845904523536 ** ((-1/2) * ((((x/100) - mean) / stdDeviation) ** 2)));
}