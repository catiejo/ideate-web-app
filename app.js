/* Copyright 2016 Catie Jo Pidel */

var canvas,
 		context,
 		canvasWidth = $(window).width(),
	 	canvasHeight = $(window).height(),
	 	lineWidth = 10,
	 	colorLightBlue = "#00a9ce",
	 	colorDarkBlue = "#003057",
    colorRed = "#c8102e",
	 	colorYellow = "#ffcd00",
	 	colorBlack = "#000000",
	 	clickX = new Array(),
	 	clickY = new Array(),
	 	clickColor = new Array(),
	 	clickDrag = new Array(),
	 	paint = false,
	 	curColor = colorLightBlue;

var selectPencil = function(pencil_id)
{
  var buttons = document.getElementsByClassName("button");
  for (var i=0; i<buttons.length; i++) {
    buttons[i].style.left = "-100px";
  }
  document.getElementById(pencil_id).style.left = "-80px";
}

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
	$('#light-blue').click(function() {
		curColor = colorLightBlue;
    selectPencil("light-blue");
	});

  $('#dark-blue').click(function() {
    curColor = colorDarkBlue;
    selectPencil("dark-blue");
  });

	$('#yellow').click(function() {
		curColor = colorYellow;
    selectPencil("yellow");
  });

	$('#red').click(function() {
		curColor = colorRed;
    selectPencil("red");
	});

	$('#black').click(function() {
		curColor = colorBlack;
    selectPencil("black");
	});

	$('#share').click(function() {
      canvas.toBlob(function(blob) {
        var uploader = new MediaUploader({
          'file': blob,
          'token': getToken(),
        });
        uploader.upload();}, "image/jpeg");
        clearCanvas();
	});
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
var prepareCanvas = function()
{
  selectPencil("light-blue");
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
  clickX = new Array();
  clickY = new Array();
  clickColor = new Array();
  clickDrag = new Array();
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
