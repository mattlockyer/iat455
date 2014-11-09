var audioContext = new AudioContext();

function createDelay() {
  var node = audioContext.createScriptProcessor(256, 2, 2);
  
  var del = 250*(44100/1000);
  // console.log(del);

  var x = 0;
  var lBuf = [];
  var rBuf = [];
  node.onaudioprocess = function (e) {
    var lIn = e.inputBuffer.getChannelData(0);
    var rIn = e.inputBuffer.getChannelData(1);

    var lOut = e.outputBuffer.getChannelData(0);
    var rOut = e.outputBuffer.getChannelData(1);


    for (var i = 0; i < lIn.length; i++) {
      var l = lIn[i];
      var r = rIn[i];

      if (x >= del) {
        var lBufVal = lBuf.shift();
        var rBufVal = rBuf.shift();
        
        var lOld = l;
        var rOld = r;

        l = l + lBufVal*0.6;
        r = r + rBufVal*0.6;

          // if (x > del && x < del + 256) { console.log('Weird'); }
        // if (isNaN(l) && isNaN(r)) {
        //   l = lOld;
        //   r = rOld;
        // }
      }

      lBuf.push(l);
      rBuf.push(r);

      lOut[i] = l;
      rOut[i] = r;

      x++;
    }
  };

  return node;
} 

var notesLead = [
  {measure: 0, start: 0/16, duration: 1/16, tone: 'F4'},
  {measure: 0, start: 0/16, duration: 1/16, tone: 'Ab4'},
  {measure: 0, start: 0/16, duration: 1/16, tone: 'C5'},
  {measure: 0, start: 0/16, duration: 1/16, tone: 'Eb5'},

  {measure: 0, start: 2/16, duration: 1/16, tone: 'F4'},
  {measure: 0, start: 2/16, duration: 1/16, tone: 'Ab4'},
  {measure: 0, start: 2/16, duration: 1/16, tone: 'C5'},
  {measure: 0, start: 2/16, duration: 1/16, tone: 'Eb5'},

  {measure: 0, start: 4/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 4/16, duration: 1/16, tone: 'Bb4'},
  {measure: 0, start: 4/16, duration: 1/16, tone: 'D5'},
  {measure: 0, start: 4/16, duration: 1/16, tone: 'F5'},

  {measure: 0, start: 7/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 7/16, duration: 1/16, tone: 'Bb4'},
  {measure: 0, start: 7/16, duration: 1/16, tone: 'D5'},
  {measure: 0, start: 7/16, duration: 1/16, tone: 'F5'},

  {measure: 1, start: 0/16, duration: 1/16, tone: 'D4'},
  {measure: 1, start: 0/16, duration: 1/16, tone: 'F4'},
  {measure: 1, start: 0/16, duration: 1/16, tone: 'A4'},
  {measure: 1, start: 0/16, duration: 1/16, tone: 'C5'},

  {measure: 1, start: 2/16, duration: 1/16, tone: 'D4'},
  {measure: 1, start: 2/16, duration: 1/16, tone: 'F4'},
  {measure: 1, start: 2/16, duration: 1/16, tone: 'A4'},
  {measure: 1, start: 2/16, duration: 1/16, tone: 'C5'},

  {measure: 1, start: 4/16, duration: 1/16, tone: 'D4'},
  {measure: 1, start: 4/16, duration: 1/16, tone: 'F4'},
  {measure: 1, start: 4/16, duration: 1/16, tone: 'A4'},
  {measure: 1, start: 4/16, duration: 1/16, tone: 'C5'},

  {measure: 1, start: 7/16, duration: 1/16, tone: 'Bb4'},
  {measure: 1, start: 7/16, duration: 1/16, tone: 'Db5'},
  {measure: 1, start: 7/16, duration: 1/16, tone: 'F5'},
  {measure: 1, start: 7/16,  duration: 1/16, tone: 'Ab5'},

  {measure: 1, start: 10/16, duration: 1/16, tone: 'F4'},
  {measure: 1, start: 10/16, duration: 1/16, tone: 'Ab4'},
  {measure: 1, start: 10/16, duration: 1/16, tone: 'C5'},
  {measure: 1, start: 10/16, duration: 1/16, tone: 'Eb5'}
];

var delay = createDelay();
var reverb = audioContext.createConvolver();
var noiseBuffer = audioContext.createBuffer(2, 44100/2, 44100);
var left = noiseBuffer.getChannelData(0);
var right = noiseBuffer.getChannelData(1);
for (var i = 0; i < noiseBuffer.length; i++) {
  right[i] = left[i] = Math.random() * 2 - 1;
}
reverb.buffer = noiseBuffer;

var lead = synthastico.createSynth(
  audioContext, notesLead
);

lead.sound = function (note, time) {
  var val =
    440 * Math.pow(2, (note.tone - 36) / 12) * (time / 44100);

  var amp = synthastico.ampFromADSR(
    note.totalPlayed,
    50*(44100 / 1000),
    50*(44100 / 1000),
    1,
    1000*(44100 / 1000)
  )

  // return (val - Math.floor(val)) * amp;
  return Math.sin(val)*amp;
}

lead.connect(delay);
// delay.connect(reverb);
delay.connect(audioContext.destination);









