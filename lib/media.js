

/*! getUserMedia - v0.1.0 - 2012-08-19
* https://github.com/addyosmani/getUserMedia.js
* Copyright (c) 2012 addyosmani; Licensed MIT */

"use strict";

;(function (window, document) {
	window.getUserMedia = function (options, successCallback, errorCallback) {
        // Options are required
        if (options !== undefined) {
            // getUserMedia() feature detection
            navigator.getUserMedia_ = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            if ( !! navigator.getUserMedia_) {
                // constructing a getUserMedia config-object and 
                // an string (we will try both)
                var option_object = {};
                var option_string = '';
                var getUserMediaOptions, container, temp, video, ow, oh;

                if (options.video === true) {
                	option_object.video = true;
                	option_string = 'video';
                }
                if (options.audio === true) {
                	option_object.audio = true;
                	if (option_string !== '') {
                		option_string = option_string + ', ';
                	}
                	option_string = option_string + 'audio';
                }

                temp = document.createElement('video');
                temp.className = 'video';

                // configure the interim video
                temp.width = options.width;
                temp.height = options.height;
                temp.autoplay = true;
                document.body.appendChild(temp);
                video = temp;

                // referenced for use in your applications
                options.video = video;

                // first we try if getUserMedia supports the config object
                try {
                    // try object
                    navigator.getUserMedia_(option_object, successCallback, errorCallback);
                } catch (e) {
                    // option object fails
                    try {
                        // try string syntax
                        // if the config object failes, we try a config string
                        navigator.getUserMedia_(option_string, successCallback, errorCallback);
                    } catch (e2) {
                        // both failed
                        // neither object nor string works
                        return undefined;
                    }
                }
            } else {
            	alert('No HMTL5 Video Support');
            }
        }
    };
}(this, document));

/*******************************
* Media Tools for App
*******************************/

var MEDIA = {};

MEDIA.width = 320;
MEDIA.height = 240;
MEDIA.quality = 100;

MEDIA.Canvas = function() {
	this.el = document.createElement('canvas');
	this.el.className = 'canvas';
	document.body.appendChild(this.el);
	this.el.width = MEDIA.width;
	this.el.height = MEDIA.height;
	this.context = this.el.getContext("2d");
	this.defaultArgs = {
		x:0, y:0, w:MEDIA.width, h:MEDIA.height
	};
};

MEDIA.Canvas.prototype = {
	getImageData:function(args) {
		args = args || this.defaultArgs;
		return this.context.getImageData(args.x, args.y, args.w, args.h);
	},
	putImageData:function(imgData, args) {
		args = args || this.defaultArgs;
		this.context.putImageData(imgData, args.x, args.y);
	}
};

MEDIA.Camera = {
	init: function(args) {
		args = args || {};
		MEDIA.width = args.width = args.width || MEDIA.width;
		MEDIA.height = args.height = args.height || MEDIA.height;
		args.quality = args.quality || MEDIA.quality;
		args.audio = args.audio || false;
		args.video = args.video || true;
		
		getUserMedia(args, this.success, this.deviceError);

		this.video = args.video;
	},

	success: function (stream) {
		var video = MEDIA.Camera.video;
		if ((typeof MediaStream !== "undefined" && MediaStream !== null) && stream instanceof MediaStream) {
			if (video.mozSrcObject !== undefined) { //FF18a
				video.mozSrcObject = stream;
			} else { //FF16a, 17a
				video.src = stream;
			}
			return video.play();
		} else {
			var vendorURL = window.URL || window.webkitURL;
			video.src = vendorURL ? vendorURL.createObjectURL(stream) : stream;
		}
		video.onerror = function () {
			stream.stop();
			streamError();
		};
	},

	deviceError: function (error) {
		alert('No camera available.');
		console.error('An error occurred: [CODE ' + error.code + ']');
	},

	changeFilter: function () {
		if (this.filter_on) {
			this.filter_id = (this.filter_id + 1) & 7;
		}
	}

};
