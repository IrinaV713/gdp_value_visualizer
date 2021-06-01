let MARGIN = 60;
let PADDING_Y = 20;
let MAXWIDTH = screen.width * 0.8;
let MAXHEIGHT = screen.height * 0.6;

// awainting to load data
document.addEventListener('DOMContentLoaded', function () {
	promise.then(
		result => {
			output(result);
		},
		error => {
			alert(error);
		}
	);
});

// load information to drop-down list of countries
function output() {
	let countriesSelect = document.getElementById("countries"), op = '';
	for (let key in arrData) {
		op += '<option value="'+key+'">' + key + '</option>'; 
	}
	countriesSelect.innerHTML = op;
	
	document.getElementById("selectArea").style = "";
	
	let combo = document.getElementById("countries");
	combo.onchange = function() {
		let popup = document.getElementById("popup");
		popup.style.display = "none";
		
		myArr = arrData[combo.value];
		let val = combo.value;
		drawChart();
	}
	
	combo.onchange();
}

function drawLine(ctx, startX, startY, endX, endY, width, color){
	ctx.beginPath();
	ctx.moveTo(startX,startY);
	ctx.lineWidth = width;
	ctx.lineTo(endX,endY);
	ctx.strokeStyle = color;
	ctx.stroke();
}

function drawPoint(ctx, centerX, centerY, radius, color){
	ctx.fillStyle = color
	ctx.beginPath();
	ctx.moveTo(centerX, centerY);
	ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

// draw coordinate grig and chart points
function getCoordGrid(ctx, startX, startY){
	drawLine(ctx, startX + MARGIN, startY - MARGIN, MAXWIDTH - MARGIN, startY - MARGIN, 2, "#4040a1");
	drawLine(ctx, startX + MARGIN, startY - MARGIN, startX + MARGIN, MARGIN, 2, "#4040a1");
	
	// look for max Y value
	let mv = 0;
	for (let i=0; i<myArr.length; i++) {
		if (mv < 1*myArr[i][1]) mv = 1*myArr[i][1];
	}
	
	let kolY = 5;
	let deltaY = Math.round((mv/kolY)/1000) * 1000;	
	let scaled_deltaY = (MAXHEIGHT - 2*MARGIN)*deltaY/mv; //?
	scaled_deltaY = Math.floor(scaled_deltaY);
	
	// draw  Y grid
	for (let i=1; i<kol; i++) {
		drawLine(ctx, startX + MARGIN, startY - MARGIN - i*scaled_deltaY, MAXWIDTH - MARGIN, startY - MARGIN - i*scaled_deltaY, 0.5,"#4040a1");
		drawLine(ctx, startX + MARGIN, startY - MARGIN - i*scaled_deltaY, startX + MARGIN-8, startY - MARGIN - i*scaled_deltaY, 3, "#4040a1");
		console.log('osY', startY - MARGIN - i*scaled_deltaY);
		ctx.fillText(i*deltaY+"", startX + MARGIN-40, startY - MARGIN - i*scaled_deltaY + 3);
	}
	
	// draw X grid
	let kolX = myArr.length+1;
	let deltaX = (MAXWIDTH - 2*MARGIN - startX)/kolX;
	for (let i=0; i<myArr.length; i++) {
		myArr[i][2] = startX + MARGIN + (i+1)*deltaX;
		drawLine(ctx, myArr[i][2], startY - MARGIN, myArr[i][2], startY-MARGIN+5, 3, "#4040a1");
		ctx.fillText(myArr[i][0]+"", startX + MARGIN + (i+1)*deltaX, startY - MARGIN + 20);
	}
	// draw points
	let osYlength = startY - 2*MARGIN;
	for (let i=0; i<myArr.length; i++){
		drawPoint(ctx, startX + MARGIN + (i+1)*deltaX, startY - MARGIN - myArr[i][1] * osYlength/mv, 3, "#0000ff");
	}
}

// transform array data to screen coordinates to display label with exact data near chart point
function getArrCoords(x, y) {
	let minDist = 1000, pos = 0;
	for (let i=0; i<myArr.length; i++) {
		let d = Math.abs(myArr[i][2]-x);
		if (d < minDist) {
			minDist = d;
			pos = i;
		}
	}
	return pos;
}
// creating canvas to display chart
function drawChart() {
	var myCanvas = document.getElementById("chart");
	myCanvas.width = MAXWIDTH;
	myCanvas.height = MAXHEIGHT;
	var ctx = myCanvas.getContext("2d");

	let beginX = 0;
	let beginY = MAXHEIGHT;
	getCoordGrid(ctx, beginX, beginY);
	
	myCanvas.addEventListener('mousedown', function(e) {
		console.log('mousedown', e);
		let num = getArrCoords(e.layerX, e.layerY);
		let popup = document.getElementById("popup");
		popup.innerHTML = "For " + myArr[num][0] + " year - " + myArr[num][1];
		popup.style.left = e.screenX + "px";
		popup.style.top = e.screenY + "px";
		popup.style.display = "block";
	});
}	
