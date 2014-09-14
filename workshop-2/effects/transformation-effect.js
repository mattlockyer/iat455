

"use strict";

var TransformationEffect = function() {
	var self = this;
	//parameters
	self.canvas = new MEDIA.Canvas();

	//name
	self.name = 'TransformationEffect';
	var translateDefaults = {
		value:0,
		min:-1000,
		max:1000,
		step:1
	};
	var scaleDefaults = {
		value:1,
		min:0,
		max:10,
		step:0.02
	};
	var rotDefaults = {
		value:0,
		min:0,
		max:360,
		step:0.5
	};
	//controls
	self.controls = {
		Background:function() {
			var url = window.prompt('Enter Image URL');
			document.body.style.background = 'url(' + url + ')';
			document.body.style.backgroundSize = 'cover';
		},
		TranslateX:JSON.parse(JSON.stringify(translateDefaults)),
		TranslateY:JSON.parse(JSON.stringify(translateDefaults)),
		TranslateZ:JSON.parse(JSON.stringify(translateDefaults)),
		ScaleX:JSON.parse(JSON.stringify(scaleDefaults)),
		ScaleY:JSON.parse(JSON.stringify(scaleDefaults)),
		RotateX:JSON.parse(JSON.stringify(rotDefaults)),
		RotateY:JSON.parse(JSON.stringify(rotDefaults)),
		RotateZ:JSON.parse(JSON.stringify(rotDefaults)),
		Perspective:{
			value:MEDIA.width,
			min:100,
			max:2048,
			step:32
		}
	};
};

TransformationEffect.prototype = {
	draw: function() {
		//cache some basic values for this iteration of draw
		var canvas = this.canvas,
		tranX = this.controls.TranslateX.value,
		tranY = this.controls.TranslateY.value,
		tranZ = this.controls.TranslateZ.value,
		scaleX = this.controls.ScaleX.value,
		scaleY = this.controls.ScaleY.value,
		rotX = this.controls.RotateX.value,
		rotY = this.controls.RotateY.value,
		rotZ = this.controls.RotateZ.value,
		perspective = this.controls.Perspective.value,
		w = MEDIA.width,
		h = MEDIA.height;

		//update frame
		APP.drawImage(canvas);

		canvas.element.style.transform = 'perspective(' + perspective + 'px) '
		+ 'translate3d(' + tranX + 'px, ' + tranY + 'px, ' + tranZ + 'px) '
		+ 'scale(' + scaleX + ', ' + scaleY + ') '
		+ 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) rotateZ(' + rotZ + 'deg)';
	}
};