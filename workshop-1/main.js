

"use strict";

var APP = APP || {};

APP.init = function() {
	//setup app
	APP.setup({w:640, h:480});
	//add effects
	APP.effects = [];
	APP.effects.push(new CaptureEffect(new MEDIA.Canvas()));
	APP.effects.push(new RGBEffect(new MEDIA.Canvas()));
	APP.effects.push(new ScanlineEffect(new MEDIA.Canvas()));
	//setup controls
	APP.setupControls();
};

APP.init();
