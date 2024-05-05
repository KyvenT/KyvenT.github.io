var probability;

window.onload = function() {
    prepareListeners();
}

function prepareListeners() {
    hideCalculationAreas();
    var distributionSelect;
    distributionSelect = document.getElementById("distributionSelect");
    distributionSelect.addEventListener("input", chooseDistribution);
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
            var normalArea = document.getElementById("normalCalc");
            normalArea.style.display = 'none';
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