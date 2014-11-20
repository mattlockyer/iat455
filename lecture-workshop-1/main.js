

"use strict";

var APP = APP || {};

APP.init = function() {
	//setup app
	APP.setup({w:320, h:240});
	//add effects
	APP.effects = [];
	APP.effects.push(new AnalysisEffect());
	APP.setupControls();
};

APP.init();
