

"use strict";

var APP = APP || {};

APP.init = function() {
	//setup app
	APP.setup({w:640, h:480});
	//add effects
	APP.effects = [];
	// APP.effects.push(new CaptureEffect());
	// APP.effects.push(new RGBEffect());
	// APP.effects.push(new RGBEffect32());
	// APP.effects.push(new ScanlineEffect());
	APP.effects.push(new RunLengthCompression());
	//setup controls
	APP.setupControls();
};

APP.init();
