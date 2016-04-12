
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

var canvas;
var context;
var canvasWidth = 490;
var canvasHeight = 220;
var padding = 25;
var lineWidth = 8;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = colorPurple;
var curTool = "marker";
var curSize = "normal";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 111;
var drawingAreaY = 11;
var drawingAreaWidth = 267;
var drawingAreaHeight = 200;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = new Object();
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8;
var curLoadResNum = 0;
/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");

	// context = document.getElementById('canvasInAPerfectWorld').getContext("2d");

	// Load images
	// -----------
	// crayonImage.onload = function() { resourceLoaded();
	// };
	// crayonImage.src = "images/crayon-outline.png";
	// context.drawImage(crayonImage, 0, 0, 100, 100);
	//
	// markerImage.onload = function() { resourceLoaded();
	// };
	// markerImage.src = "images/marker-outline.png";
	//
	// eraserImage.onload = function() { resourceLoaded();
	// };
	// eraserImage.src = "images/eraser-outline.png";
	//
	// crayonBackgroundImage.onload = function() { resourceLoaded();
	// };
	// crayonBackgroundImage.src = "images/crayon-background.png";
	//
	// markerBackgroundImage.onload = function() { resourceLoaded();
	// };
	// markerBackgroundImage.src = "images/marker-background.png";
	//
	// eraserBackgroundImage.onload = function() { resourceLoaded();
	// };
	// eraserBackgroundImage.src = "images/eraser-background.png";
	//
	// crayonTextureImage.onload = function() { resourceLoaded();
	// };
	// crayonTextureImage.src = "images/crayon-texture.png";
	//
	// outlineImage.onload = function() { resourceLoaded();
	// };
	// outlineImage.src = "images/watermelon-duck-outline.png";

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e){
  	var mouseX = e.pageX - this.offsetLeft;
  	var mouseY = e.pageY - this.offsetTop;

  	paint = true;
  	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  	redraw();
	});

	$('#canvas').mousemove(function(e){
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});

	$('#canvas').mouseup(function(e){
		paint = false;
	  // redraw();
	});

	$('#canvas').mouseleave(function(e){
		paint = false;
	});
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	// clickTool.push(curTool);
	// clickColor.push(curColor);
	// clickSize.push(curSize);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

// function redrawHelper(locX, locY, color)
// {
// 	context.beginPath();
// 	context.moveTo(locX + 10, locY + 24);
// 	context.lineTo(locX + 10, locY + 24);
// 	context.lineTo(locX + 22, locY + 16);
// 	context.lineTo(locX + 22, locY + 31);
// 	context.closePath();
// 	context.fillStyle = color;
// 	context.fill();
// }

/**
* Redraws the canvas.
*/
function redraw(){
  context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

  context.strokeStyle = "#df4b26";
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
  }
}

/**/
