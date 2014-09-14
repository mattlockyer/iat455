

"use strict";

var APP = APP || {};

APP.init = function() {
	var size = {
		small:{w:160, h:120},
		medium:{w:320, h:240},
		large:{w:640, h:480}
	}
	//setup app
	APP.setup(size.large);
	//add effects
	APP.effects = [];
	APP.effects.push(new BlurEffect());
	APP.effects.push(new SobelEffect());
	APP.effects.push(new TransformationEffect());
	//setup controls
	APP.setupControls();
};

APP.init();
