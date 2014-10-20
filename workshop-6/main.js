// Reference:
// http://joshondesign.com/p/books/canvasdeepdive/chapter12.html

//properties for this app
var audioContext = new AudioContext(),
canvas = document.getElementById('canvas'),
canvasContext = canvas.getContext('2d'),
buffer,
fft,
samples = 128,
bars = 64,
barWidth = 8,
data = new Uint8Array(samples); 

//animation loop
function update() {
	requestAnimationFrame(update);
	//fill semi transparent black
	canvasContext.fillStyle = 'rgba(0,0,0, 0.1)'; 
	canvasContext.fillRect(0,0,800,600); 
	//put fft frequencies into data array
	fft.getByteFrequencyData(data); 
	//draw bars
	canvasContext.fillStyle = 'red'; 
	for(var i=0; i < bars; i++) { 
		canvasContext.fillRect(50 + i * barWidth,
			500 - data[i] * 1.6,
			barWidth,
			100); 
	}
}

//start when the window has finished loading
window.onload = function() { 
	//get file
	var req = new XMLHttpRequest(); 
	req.open("GET","Hustle.mp3",true);
	//the data will be loaded as an array buffer
	req.responseType = "arraybuffer";
	req.onload = function() {
		//use the audioContext object to decode the response as audio
		audioContext.decodeAudioData(req.response, function(data) { 
			buffer = data;
			//create a source node from the buffer 
			var src = audioContext.createBufferSource();  
			src.buffer = buffer;
			//create fft
			fft = audioContext.createAnalyser();
			fft.fftSize = samples;
			//connect them up into a chain
			src.connect(fft);
			fft.connect(audioContext.destination);
			//play immediately
			console.log(src);
			src.start();
			update();
		});
	};
	req.send();
}

