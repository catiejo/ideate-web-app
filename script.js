// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var canvas,
 		context,
 		canvasWidth = $(window).width(),
	 	canvasHeight = $(window).height(),
	 	lineWidth = 8,
	 	colorPurple = "#cb3594",
	 	colorGreen = "#659b41",
	 	colorYellow = "#ffcf33",
	 	colorBrown = "#986928",
	 	clickX = new Array(),
	 	clickY = new Array(),
	 	clickColor = new Array(),
	 	clickDrag = new Array(),
	 	paint = false,
	 	curColor = colorPurple;

/**
* Adds touch/mouse events
*/
var createUserEvents = function()
{
	var press = function(e) {
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
				mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;
				paint = true;

		addClick(mouseX, mouseY, false);
		redraw();
	};

	var drag = function(e) {
		var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
				mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

		if(paint){
			addClick(mouseX, mouseY, true);
			redraw();
		}
	};

	var release = function(e) {
		paint = false;
	};

	var cancel = function(e) {
		paint = false;
	};

	// Add mouse event listeners to canvas element
	canvas.addEventListener("mousedown", press, false);
	canvas.addEventListener("mousemove", drag, false);
	canvas.addEventListener("mouseup", release);
	canvas.addEventListener("mouseout", cancel, false);

	// Add touch event listeners to canvas element
	canvas.addEventListener("touchstart", press, false);
	canvas.addEventListener("touchmove", drag, false);
	canvas.addEventListener("touchend", release, false);
	canvas.addEventListener("touchcancel", cancel, false);

	//TODO: put in updated format (like above)
	$('#purple').click(function() {
		curColor = colorPurple;
	});

	$('#yellow').click(function() {
		curColor = colorYellow;
	});

	$('#green').click(function() {
		curColor = colorGreen;
	});

	$('#brown').click(function() {
		curColor = colorBrown;
	});

	$('#share').click(function() {
			window.open(canvas.toDataURL());
	});

}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
var prepareCanvas = function()
{
	// Create the canvas
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	document.getElementById('canvasDiv').appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	// context = document.getElementById('canvasInAPerfectWorld').getContext("2d");

	createUserEvents();
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
var addClick = function(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickColor.push(curColor);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
var clearCanvas = function()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
var redraw = function()
{
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.lineJoin = "round";
  context.lineWidth = 5;

  for(var i=0; i < clickX.length; i++) {
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
		 context.strokeStyle = clickColor[i];
  }
}
