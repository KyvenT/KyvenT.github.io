const xValues = [];
const pdfValues = [];


window.onload = function() {
    prepareListeners();
}

function prepareListeners() {
    hideCalculationAreas();
    var distributionSelect = document.getElementById("distributionSelect");
    distributionSelect.addEventListener("input", chooseDistribution);
    var binomialCalcButton = document.getElementById("calculateBinomialButton")
    binomialCalcButton.addEventListener("click", graphBinomial);
    var poissonCalcButton = document.getElementById("calculatePoissonButton");
    poissonCalcButton.addEventListener("click", graphPoisson);
    var normalCalcButton = document.getElementById("calculateNormalButton");
    normalCalcButton.addEventListener("click", graphNormal);
}

function chooseDistribution() {
    var distribution;
    var selectBox = document.getElementById("distributionSelect");
    distribution = selectBox.options[selectBox.selectedIndex].value;
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

function hideCalculationAreas() {
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

function graphChart() {
    // Get a reference to the canvas element
    var chart = document.getElementById('pdf').getContext('2d');

    // Create the chart
    var myChart = new Chart(chart, {
        type: 'line',
        data: {
            labels: xValues,
            datasets: [{
                label: "",
                data: pdfValues,
                pointRadius: 5,
                fill: true
            }]
        }
    });
}

function graphBinomial() {
    var n = document.getElementById("nBinomial").valueAsNumber;
    var p = document.getElementById("pBinomial").valueAsNumber;
    for (let x = 0; x <= n; x++) {
        xValues.push(x);
        pdfValues.push(((factorial(n))/(factorial(n - x) * factorial(x))) * (p**x) * ((1 - p)**(n - x)));
    }
    graphChart();
}

function graphPoisson() {
    var mean = document.getElementById("meanPoisson").valueAsNumber;
    var areaCalculated;
    var x = 0;
    var y = 0;
    while (x < 100) {
        xValues.push(x);
        y = ((mean ** x)/(factorial(x))) * (2.71828182845904523536 ** (-1 * mean));
        pdfValues.push(y);
        areaCalculated += y;
        x += 1;
    }
    graphChart();
}

function graphNormal() {
    var mean = document.getElementById("meanNormal").valueAsNumber;
    var variance = document.getElementById("varianceNormal").valueAsNumber;
    var stdDeviation = variance ** (1/2);
    var x = 100 * (mean - (2 * stdDeviation));
    var endDrawing = 100 * (mean + (2 * stdDeviation));
    while (x <= endDrawing) {
        xValues.push(Math.floor(x/100));
        pdfValues.push((1 / (stdDeviation * ((2 * 3.1415926535) ** (1/2)))) * (2.71828182845904523536 ** ((-1/2) * ((((x/100) - mean) / stdDeviation) ** 2))));
        x += 1;
    }
    graphChart();
}

function redrawChart() {
    var chart = document.getElementById('pdf').getContext('2d');
    chart.data.labels = xValues;
    chart.data.datasets.forEach((dataset) => {
        dataset.data = pdfValues;
    });
    chart.update();
}

function factorial(x) {
    if (x % 1 != 0 || x < 0) {
        return;
    }
    if (x == 0 || x == 1) {
        return 1;
    }
    return x * factorial(x - 1);
}