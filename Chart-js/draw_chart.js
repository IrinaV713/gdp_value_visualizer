let MARGIN = 60;
let PADDING_Y = 20;
let MAXWIDTH = screen.width * 0.8;
let MAXHEIGHT = screen.height * 0.6;
let point_radius = 4;
let axis_width = 3;
let grid_width = 0.5;

document.addEventListener("DOMContentLoaded", function () {
  promise.then(
    (result) => {
      outputToList(result);
    },
    (error) => {
      alert(error);
    }
  );
});

function outputToList() {
  let countriesSelect = document.getElementById("countries"),
    op = "";
  for (let key in arrayTable) {
    op += '<option value="' + key + '">' + key + "</option>";
  }
  countriesSelect.innerHTML = op;

  document.getElementById("selectArea").style = "";

  let combo = document.getElementById("countries");
  combo.onchange = function () {
    let popup = document.getElementById("popup");
    popup.style.display = "none";

    countryData = arrayTable[combo.value];
    let val = combo.value;
    drawChart();
  };

  combo.onchange();
}

function drawChart() {
  var myCanvas = document.getElementById("chart");
  myCanvas.width = MAXWIDTH;
  myCanvas.height = MAXHEIGHT;
  var ctx = myCanvas.getContext("2d");

  let beginX = 0;
  let beginY = MAXHEIGHT;
  getCoordGrid(ctx, beginX, beginY);

  myCanvas.addEventListener("mousedown", function (e) {
    console.log("mousedown", e);
    let num = getArrCoords(e.layerX, e.layerY);
    let popup = document.getElementById("popup");
    popup.innerHTML =
      "For " + countryData[num][0] + " year - " + countryData[num][1] + " $";
    popup.style.left = e.screenX + "px";
    popup.style.top = e.screenY + "px";
    popup.style.display = "block";
  });
}

function drawLine(ctx, startX, startY, endX, endY, width, color) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineWidth = width;
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawPoint(ctx, centerX, centerY, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
}

function getCoordGrid(ctx, startX, startY) {
  // draw axes
  drawLine(
    ctx,
    startX + MARGIN,
    startY - MARGIN,
    MAXWIDTH - MARGIN,
    startY - MARGIN,
    axis_width,
    "#4040a1"
  );
  drawLine(
    ctx,
    startX + MARGIN,
    startY - MARGIN,
    startX + MARGIN,
    MARGIN,
    axis_width,
    "#4040a1"
  );

  // look for max data value
  let mv = 0;
  for (let i = 0; i < countryData.length; i++) {
    if (mv < 1 * countryData[i][1]) mv = 1 * countryData[i][1];
  }

  // draw  Y grid
  let kol = 5;
  let deltaY = Math.round(mv / kol / 1000) * 1000;
  let scaled_deltaY = ((MAXHEIGHT - 2 * MARGIN) * deltaY) / mv;
  scaled_deltaY = Math.floor(scaled_deltaY);
  for (let i = 1; i < kol; i++) {
    drawLine(
      ctx,
      startX + MARGIN,
      startY - MARGIN - i * scaled_deltaY,
      MAXWIDTH - MARGIN,
      startY - MARGIN - i * scaled_deltaY,
      grid_width,
      "#4040a1"
    );
    drawLine(
      ctx,
      startX + MARGIN,
      startY - MARGIN - i * scaled_deltaY,
      startX + MARGIN - 8,
      startY - MARGIN - i * scaled_deltaY,
      axis_width,
      "#4040a1"
    );
    ctx.fillText(
      i * deltaY + "",
      startX + MARGIN - 40,
      startY - MARGIN - i * scaled_deltaY + 3
    );
  }

  // draw X grid
  let kolX = countryData.length + 1;
  let deltaX = (MAXWIDTH - 2 * MARGIN - startX) / kolX;
  for (let i = 0; i < countryData.length; i++) {
    countryData[i][2] = startX + MARGIN + (i + 1) * deltaX;
    drawLine(
      ctx,
      countryData[i][2],
      startY - MARGIN,
      countryData[i][2],
      startY - MARGIN + 5,
      axis_width,
      "#4040a1"
    );
    ctx.fillText(
      countryData[i][0] + "",
      startX + MARGIN + (i + 1) * deltaX,
      startY - MARGIN + 20
    );
  }

  // draw chart
  let ylength = startY - 2 * MARGIN;
  for (let i = 0; i < countryData.length; i++) {
    if (i > 0) {
      drawLine(
        ctx,
        startX + MARGIN + (i + 1) * deltaX,
        startY - MARGIN - (countryData[i][1] * ylength) / mv,
        startX + MARGIN + i * deltaX,
        startY - MARGIN - (countryData[i - 1][1] * ylength) / mv,
        axis_width - 1,
        "#4040a1"
      );
    }
    drawPoint(
      ctx,
      startX + MARGIN + (i + 1) * deltaX,
      startY - MARGIN - (countryData[i][1] * ylength) / mv,
      point_radius,
      "#0000ff"
    );
  }
}

function getArrCoords(x, y) {
  let minDist = 1000,
    pos = 0;
  for (let i = 0; i < countryData.length; i++) {
    let d = Math.abs(countryData[i][2] - x);
    if (d < minDist) {
      minDist = d;
      pos = i;
    }
  }
  return pos;
}
