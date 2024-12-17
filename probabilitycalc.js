const xValues = [];
const pdfValues = [];
let chart;

// Onload functions 
window.onload = function() {
    prepareListeners();
}

// Sets up listeners
function prepareListeners() {
    firstHide();
    let distributionSelect = document.getElementById("distribution-selection-box");
    distributionSelect.addEventListener("input", chooseDistribution);
    let binomialCalcButton = document.getElementById("calculateBinomialButton")
    binomialCalcButton.addEventListener("click", graphBinomial);
    let poissonCalcButton = document.getElementById("calculatePoissonButton");
    poissonCalcButton.addEventListener("click", graphPoisson);
    let normalCalcButton = document.getElementById("calculateNormalButton");
    normalCalcButton.addEventListener("click", graphNormal);
}

// User distribution selection, displays selected distribution parameter inputs
function chooseDistribution() {
    let selectBox = document.getElementById("distribution-selection-box");
    let distribution = selectBox.options[selectBox.selectedIndex].value;
    if (chart != null) {
        chart.destroy();
    }
    hideCalculationAreas();
    document.getElementById("pdf").style.display = 'none';
    switch(distribution) {
        case "Binomial":
            let binomialArea = document.getElementById("binomial-parameter-input-wrapper");
            binomialArea.style.display = 'block';
            break;
        case "Poisson":
            let poissonArea = document.getElementById("poisson-parameter-input-wrapper");
            poissonArea.style.display = 'block';
            break;
        case "Normal":
            let normalArea = document.getElementById("normal-parameter-input-wrapper");
            normalArea.style.display = 'block';
            break;
    }

}

// Hides all parameter inputs except for Binomial distribution on first load
function firstHide() {
    let poissonArea = document.getElementById("poisson-parameter-input-wrapper");
    poissonArea.style.display = 'none';
    let normalArea =  document.getElementById("normal-parameter-input-wrapper");
    normalArea.style.display = 'none'; 
    let resultsArea = document.getElementById("results");
    resultsArea.style.display = 'none';
    let graphArea = document.getElementById("distributionGraph");
    graphArea.style.display = 'none';
}

// Hides all parameter inputs
function hideCalculationAreas() {
    graphChart();
    let binomialArea = document.getElementById("binomial-parameter-input-wrapper");
    binomialArea.style.display = 'none';
    let poissonArea = document.getElementById("poisson-parameter-input-wrapper");
    poissonArea.style.display = 'none';
    let normalArea = document.getElementById("normal-parameter-input-wrapper");
    normalArea.style.display = 'none';
    let resultsArea = document.getElementById("results");
    resultsArea.style.display = 'none';
    let graphArea = document.getElementById("distributionGraph");
    graphArea.style.display = 'none';
}

// Creates chart with xValues and pdfValues
function graphChart() {
    // Get a reference to the canvas element
    let chartElement = document.getElementById('pdf').getContext('2d');

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
    let resultsArea = document.getElementById("results");
    resultsArea.style.display = 'block';
    let graphArea = document.getElementById("distributionGraph");
    graphArea.style.display = 'block';
}


// ***** CREATING GRAPH FUNCTIONS *****
// Creates Binomial Graph
function graphBinomial() {
    let n = document.getElementById("nBinomial").valueAsNumber;
    let p = document.getElementById("pBinomial").valueAsNumber;

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
    let mean = document.getElementById("meanPoisson").valueAsNumber;
    let areaCalculated = 0;
    let x;
    if (Math.floor(mean - (2 * (mean ** (0.5)))) > 0) {
        x = Math.floor(mean - (2 * (mean ** (0.5))));
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
    let mean = document.getElementById("meanNormal").valueAsNumber;
    let variance = document.getElementById("varianceNormal").valueAsNumber;
    let stdDeviation = variance ** (0.5);
    let x = 100 * (mean - (2 * stdDeviation));
    let endDrawing = 100 * (mean + (2 * stdDeviation));

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
const binomialFunction = (n, p, x) => ((factorial(n))/(factorial(n - x) * factorial(x))) * (p**x) * ((1 - p)**(n - x));

// Poisson Probability Distribution Function
const poissonFunction = (mean, x) => ((mean ** x)/(factorial(x))) * (Math.E ** (-1 * mean));

// Normal Probability Distribution Functions
const normalFunction = (mean, stdDeviation, x) => (1 / (stdDeviation * ((2 * Math.PI) ** (0.5)))) * 
                                                    (Math.E ** ((-0.5) * ((((x/100) - mean) / stdDeviation) ** 2)));


