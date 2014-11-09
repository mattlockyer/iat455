
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

//loads an image through a cors proxy and sets crossOrigin = true
//otherwise canvas is tainted, see: https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
APP.loadImage = function(canvas) {
	var url = window.prompt('Enter image url');
	var img = new Image();
	img.crossOrigin = true;
	img.onload = function() {
		canvas.context.drawImage(img, 0, 0, MEDIA.width, MEDIA.height);
	};
	img.src = 'http://www.corsproxy.com/' + url.substr(url.indexOf('//') + 2);
};

APP.guiToFront = function() {
	var gui = document.querySelector('.dg');
	document.body.removeChild(gui);
	document.body.appendChild(gui);
};

APP.setupControls = function() {
	var main = {
		name:'Main',
		controls:{
			ToggleVideo:function() {
				if (!APP.video.style.display || APP.video.style.display === 'none') APP.video.style.display = 'block';
				else APP.video.style.display = 'none';
			}
		}
	};
	APP.addControls(main, true, true);
	for (var i = 0; i < APP.effects.length; i++)
		APP.addControls(APP.effects[i]);

	APP.guiToFront();
};

APP.addControls = function(effect, open, skipBase) {
	var f = APP.gui.addFolder(effect.name);
	if (!skipBase) {
		var base = {
			Toggle:APP.Effect.toggle.bind(effect),
			Freeze:APP.Effect.toggleLoop,
			Save:APP.Effect.save
		};
		for (var key in base) 
			f.add(base, key);
	}
	if (!effect.controls) return;
	for (var key in effect.controls) {
		var control = effect.controls[key];
		switch (typeof control) {
			case 'function':
			f.add(effect.controls, key);
			break;
			case 'object':
			var c = f.add(control, 'value', control.min, control.max).step(control.step);
			c.name(key);
			break;
		}
	}
	if (open) f.open();
};

APP.drawImage = function(canvas) {
	canvas.context.drawImage(MEDIA.Camera.video, 0, 0, MEDIA.width, MEDIA.height);
};

APP.Effect = {
	current:null,
	looping:false,
	loop:function() {
		if (!APP.Effect.looping || !APP.Effect.current) return;
		requestAnimationFrame(APP.Effect.loop);
		APP.Effect.current.draw();
	},
	stop:function() {
		APP.Effect.looping = false;
	},
	start:function() {
		APP.Effect.looping = true;
		APP.Effect.loop();
	},
	save:function() {
		var a = document.createElement('a');
		a.onclick = function(e) {
			a.href = APP.Effect.current.canvas.toDataURL();
			a.download = 'image-effect-sample.png';
		};
		a.click();
	},
	toggleLoop:function() {
		if (APP.Effect.looping) APP.Effect.stop();
		else APP.Effect.start();
	},
	toggle:function() {
		var e = APP.Effect;
		if (e.current === this) {
			e.current.canvas.el.style.display = 'none';
			e.current = null;
		} else {
			e.looping = true;
			e.current = this;
			e.current.canvas.el.style.display = 'block';
			e.loop();
		}
	}
};

APP.Utils = {
	clamp:function(value, min, max) {
		return (value < min) ? min : (value > max ? max : value);
	}
}