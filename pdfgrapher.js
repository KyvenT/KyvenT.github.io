const xValues = [];
const pdfValues = [];
graphBinomial();
// Wait for the DOM to be fully loaded before executing the code
document.addEventListener('DOMContentLoaded', function () {
  // Get a reference to the canvas element
  var chart = document.getElementById('pdf').getContext('2d');

  // Create the chart
  var myChart = new Chart(chart, {
    type: 'line',
    data: {
        labels: xValues,
        datasets: [{
            label: 'Probability Density',
            data: pdfValues,
            pointRadius: 1,
            fill: true
        }]
    },
  });
});

function graphBinomial() {
  var n = 10;
  var p = 0.5;
  for (let x = 0; x <= n; x++) {
      xValues.push(x);
      pdfValues.push(((factorial(n))/(factorial(n - x) * factorial(x))) * (p**x) * ((1 - p)**(n - x)));
  }
}

function factorial(x) {
  if (x == 0 || x == 1) {
      return 1;
  }
  return x * factorial(x - 1);
}