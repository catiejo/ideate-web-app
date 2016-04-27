// The Browser API key obtained from the Google Developers Console.
// Replace with your own Browser API key, or your own key.
var developerKey = 'AIzaSyAvvu3xY2Qc0AiawurKa56bzE0NgqbGlyw';

// The Client ID obtained from the Google Developers Console. Replace with your own Client ID.
var clientId = "584533696754-o1edrl4hn6icuuh782b01duofsd6suhh.apps.googleusercontent.com"

// Replace with your own App ID. (Its the first number in your Client ID)
var appId = "584533696754";

// Scope to use to access user's Drive items.
var scope = ['https://www.googleapis.com/auth/drive'];

var pickerApiLoaded = false;
var oauthToken;

// Use the Google API Loader script to load the google.picker script.
function loadPicker() {
  gapi.load('auth', {'callback': onAuthApiLoad});
  gapi.load('picker', {'callback': onPickerApiLoad});
}

function onAuthApiLoad() {
  window.gapi.auth.authorize(
      {
        'client_id': clientId,
        'scope': scope,
        'immediate': false
      },
      handleAuthResult);
}

function onPickerApiLoad() {
  pickerApiLoaded = true;
  createPicker();
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

// Create and render a Picker object for searching images.
function createPicker() {
  if (pickerApiLoaded && oauthToken) {
    var view = new google.picker.DocsView()
        .setIncludeFolders(true)
        .setMimeTypes("application/vnd.google-apps.folder")
        .setSelectFolderEnabled(true);
    var picker = new google.picker.PickerBuilder()
        .enableFeature(google.picker.Feature.NAV_HIDDEN)
        .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
        .setAppId(appId)
        .setOAuthToken(oauthToken)
        .addView(view)
        .addView(new google.picker.DocsUploadView())
        .setDeveloperKey(developerKey)
        .setCallback(pickerCallback)
        .build();
     picker.setVisible(true);
  }
}

// A simple callback implementation.
function pickerCallback(data) {
  if (data.action == google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    alert('The user selected: ' + fileId);
  }
}

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
			window.open(canvas.toDataURL());
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
