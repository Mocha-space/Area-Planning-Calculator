document.getElementById('calculator-form').addEventListener('submit', function(e) {
  e.preventDefault();

  let length = parseFloat(document.getElementById('length').value);
  let width = parseFloat(document.getElementById('width').value);

  let rollWidths = [2, 4]; // Available roll widths in meters

  let result = calculateCuts(length, width, rollWidths);

  displayResult(result);
  drawDiagram(result);
});

function calculateCuts(length, width, rollWidths) {
  let cuts = [];
  rollWidths.sort((a, b) => b - a); // Sort widths descending

  for (let rollWidth of rollWidths) {
      if (width % rollWidth === 0) {
          cuts.push({ length: length, width: rollWidth, quantity: width / rollWidth });
          width = 0;
          break;
      } else if (width > rollWidth) {
          let quantity = Math.floor(width / rollWidth);
          cuts.push({ length: length, width: rollWidth, quantity: quantity });
          width -= quantity * rollWidth;
      }
  }

  if (width > 0) {
      cuts.push({ length: length, width: width, quantity: 1 });
  }

  return cuts;
}

function displayResult(cuts) {
  let resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '<h2>Required Cuts:</h2>';

  cuts.forEach(cut => {
      resultDiv.innerHTML += `<p>${cut.quantity} cut(s) of ${cut.length}m x ${cut.width}m</p>`;
  });
}

function drawDiagram(cuts) {
  let canvas = document.getElementById('diagram');
  let ctx = canvas.getContext('3d');
  let x = 10, y = 10;
  let padding = 10;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cuts.forEach(cut => {
      for (let i = 0; i < cut.quantity; i++) {
          ctx.strokeRect(x, y, cut.width * 50, cut.length * 50);
          x += cut.width * 50 + padding;

          if (x + cut.width * 50 > canvas.width) {
              x = 10;
              y += cut.length * 50 + padding;
          }
      }
  });
}
