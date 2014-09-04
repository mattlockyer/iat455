
"use strict";

var APP = APP || {};

APP.setup = function(args) {
	if (args) {
		MEDIA.width = args.w;
		MEDIA.height = args.h;
	}
	MEDIA.Camera.init();

	APP.video = MEDIA.Camera.video;
	APP.canvas = new MEDIA.Canvas();
	APP.gui = new dat.GUI();
};

APP.setupControls = function() {
	var controls = {
		ToggleVideo:function() {
			if (!APP.video.style.display || APP.video.style.display === 'none') APP.video.style.display = 'block';
			else APP.video.style.display = 'none';
		}
	};

	APP.addControls('Main', controls, true);

	for (var i = 0; i < APP.effects.length; i++) {
		APP.addControls(APP.effects[i].name, APP.effects[i].controls);
	}
};

APP.addControls = function(folder, controls, open) {
	var f = APP.gui.addFolder(folder);
	for (var key in controls) {
		var control = controls[key];
		switch (typeof control) {
			case 'function':
			f.add(controls, key);
			break;
			case 'object':
			f.add(control, 'value', control.min, control.max).step(control.step);
			break;
		}
	}
	if (open) f.open();
};

APP.drawImage = function(canvas) {
	canvas.context.drawImage(MEDIA.Camera.video, 0, 0, MEDIA.width, MEDIA.height);
};

APP.Effect = {
	toggle:function() {
		if (this.interval) APP.Effect.stop(this);
		else APP.Effect.start(this);
	},
	start:function(effect) {
		effect.interval = setInterval(effect.draw.bind(effect), 25);
		effect.canvas.el.style.display = 'block';
	},
	stop:function(effect) {
		clearInterval(effect.interval);
		effect.interval = null;
		effect.canvas.el.style.display = 'none';
	}
};