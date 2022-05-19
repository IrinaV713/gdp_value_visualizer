'use strict';

const margin = 50;
const paddingY = 20;
const maxWidth = screen.width * 0.8;
const maxHeight = screen.height * 0.6;
const pointRadius = 4;
const axisWidth = 3;
const gridWidth = 0.5;

class MyChart {
	constructor(canvasObject, width, height){
		this.canvas = canvasObject;
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = width;
		this.canvas.height = height;
	}
	
	drawLine(startX, startY, endX, endY, width, color){
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		this.ctx.lineWidth = width;
		this.ctx.lineTo(endX, endY);
		this.ctx.strokeStyle = color;
		this.ctx.stroke();
	}

	drawPoint(centerX, centerY, radius, color){
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.moveTo(centerX, centerY);
		this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		this.ctx.closePath();
		this.ctx.fill();
	}	
}

//checking if promise is resolved or rejected
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

// adding options to drop-down list
function outputToList() {
  const countriesSelect = document.getElementById("countries");
  let listOption = "";
  for (let key in arrayTable) {
    listOption += '<option value="' + key + '">' + key + "</option>";
  }
  countriesSelect.innerHTML = listOption;

  document.getElementById("selectArea").style = "";

  let list = document.getElementById("countries");
  list.onchange = function () {
    let popup = document.getElementById("popup");
    popup.style.display = "none";

    countryData = arrayTable[list.value];
    let val = list.value;
    drawChart();
  };

  list.onchange();
}

// setting up canvas and drawing chart
function drawChart() {
  let canvasElement = document.getElementById("chart");
  const chart = new MyChart(canvasElement, maxWidth, maxHeight);

  let beginX = 0;
  let beginY = maxHeight;
  getCoordGrid(chart, beginX, beginY);

  canvasElement.addEventListener("mousedown", function (e) {
    let num = getArrCoords(e.layerX, e.layerY);
    let popup = document.getElementById("popup");
    popup.innerHTML =
      "For " + countryData[num][0] + " year - " + countryData[num][1] + " $";
    popup.style.left = e.screenX + "px";
    popup.style.top = e.screenY + "px";
    popup.style.display = "block";
  });
  
  canvasElement.addEventListener("mouseleave", function (e) {
    let popup = document.getElementById("popup");
    popup.style.display = "none";
  });
}

// drawing a coordinate grid and chart line
function getCoordGrid(chart, startX, startY) {
  // draw axes
  chart.drawLine(
    startX + margin,
    startY - margin,
    maxWidth - margin,
    startY - margin,
    axisWidth,
    "#4040a1"
  );
  chart.drawLine(
    startX + margin,
    startY - margin,
    startX + margin,
    margin,
    axisWidth,
    "#4040a1"
  );

  // look for max data value
  let maxVal = 0;
  for (let i = 0; i < countryData.length; i++) {
    if (maxVal < 1 * countryData[i][1]) maxVal = 1 * countryData[i][1];
  }

  // draw  Y grid
  let countY = 5;
  let deltaY = Math.round(maxVal / countY / 1000) * 1000;
  let scaledDeltaY = ((maxHeight - 2 * margin) * deltaY) / maxVal;
  scaledDeltaY = Math.floor(scaledDeltaY);
  for (let i = 1; i < countY; i++) {
    chart.drawLine(
      startX + margin,
      startY - margin - i * scaledDeltaY,
      maxWidth - margin,
      startY - margin - i * scaledDeltaY,
      gridWidth,
      "#4040a1"
    );
    chart.drawLine(
      startX + margin,
      startY - margin - i * scaledDeltaY,
      startX + margin - 8,
      startY - margin - i * scaledDeltaY,
      axisWidth,
      "#4040a1"
    );
    chart.ctx.fillText(
      i * deltaY + "",
      startX + margin - 40,
      startY - margin - i * scaledDeltaY + 3
    );
  }

  // draw X grid
  let countX = countryData.length + 1;
  let deltaX = (maxWidth - 2 * margin - startX) / countX;
  for (let i = 0; i < countryData.length; i++) {
    countryData[i][2] = startX + margin + (i + 1) * deltaX;
    chart.drawLine(
      countryData[i][2],
      startY - margin,
      countryData[i][2],
      startY - margin + 5,
      axisWidth,
      "#4040a1"
    );
    chart.ctx.fillText(
      countryData[i][0] + "",
      startX + margin + (i + 1) * deltaX,
      startY - margin + 20
    );
  }

  // draw chart
  let yLength = startY - 2 * margin;
  for (let i = 0; i < countryData.length; i++) {
    if (i > 0) {
      chart.drawLine(
        startX + margin + (i + 1) * deltaX,
        startY - margin - (countryData[i][1] * yLength) / maxVal,
        startX + margin + i * deltaX,
        startY - margin - (countryData[i - 1][1] * yLength) / maxVal,
        axisWidth - 1,
        "#4040a1"
      );
    }
    chart.drawPoint(
      startX + margin + (i + 1) * deltaX,
      startY - margin - (countryData[i][1] * yLength) / maxVal,
      pointRadius,
      "#0000ff"
    );
  }
}

// transforming screen coordinates to corresponding information in array
function getArrCoords(x, y) {
  let minDistance = 1000,
      position = 0;
  for (let i = 0; i < countryData.length; i++) {
    let d = Math.abs(countryData[i][2] - x);
    if (d < minDistance) {
      minDistance = d;
      position = i;
    }
  }
  return position;
}

