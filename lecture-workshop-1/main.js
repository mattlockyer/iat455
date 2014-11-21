

"use strict";

var APP = APP || {};

APP.init = function() {
	//setup app
	APP.setup({w:320, h:240});
	//add effects
	APP.effects = [];
	APP.effects.push(new AnalysisDiff());
	APP.effects.push(new AnalysisMotionDetect());
	APP.setupControls();
};

APP.init();
