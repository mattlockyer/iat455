var audioContext = new AudioContext();

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

var notesBass = [
  {measure: 0, start: 0/16, duration: 1/16, tone: 'F4'},
  {measure: 0, start: 2/16, duration: 1/16, tone: 'F4'},
  {measure: 0, start: 4/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 7/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 10/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 14/16, duration: 1/16, tone: 'G4'},
  {measure: 0, start: 15/16, duration: 1/16, tone: 'F4'},

  {measure: 1, start: 0/16, duration: 1/16, tone: 'F5'}
];

var reverb = (function() {
  var convolver = audioContext.createConvolver(),
      noiseBuffer = audioContext.createBuffer(2, 0.5 * audioContext.sampleRate, audioContext.sampleRate),
      left = noiseBuffer.getChannelData(0),
      right = noiseBuffer.getChannelData(1);
  var amp = 1;
  for (var i = 0; i < noiseBuffer.length; i++) {
    // left[i] = Math.random() * amp - amp/2;
    // right[i] = Math.random() * amp - amp/2;
    right[i] = left[i] = Math.cos(i/noiseBuffer.length);
  }
  convolver.buffer = noiseBuffer;
  return convolver;
})();

var sidechain = (function () {
  var effect = audioContext.createScriptProcessor(256, 2, 2);
  var x = 0;
  effect.onaudioprocess = function (e) {
    var lIn = e.inputBuffer.getChannelData(0);
    var rIn = e.inputBuffer.getChannelData(1);

    var lOut = e.outputBuffer.getChannelData(0);
    var rOut = e.outputBuffer.getChannelData(1);

    var beat = (44100*60)/120;
    var coefficient = (x % beat)/beat;

    for (var i = 0; i < lIn.length; i++) {
      lOut[i] = lIn[i] * (coefficient + 0.3);
      rOut[i] = rIn[i] * (coefficient + 0.3);
      x++;
    }
  };
  return effect;
}());

var lowpass = (function () {
  var effect = audioContext.createBiquadFilter();
  effect.type = 'lowpass';
  effect.frequency.value = 5000;
  effect.gain.value = 0;
  return effect;
}());

var gain = audioContext.createGain();
gain.gain.value = 20;
var lead = synthastico.createSynth(audioContext, notesLead);

setTimeout(function () {
  // var bass = synthastico.createSynth(audioContext, notesBass);

  lead.decay = 50*(synthastico.SAMPLERATE / 1000);
  lead.sustain = 0.5;
  lead.release = 50*(synthastico.SAMPLERATE / 1000);

  lead.sound = function (note, time) {
    // Create a "period" based on the note's semitone.
    var val =
      synthastico.BASE_FREQUENCY *
      Math.pow(2, (note.tone - (synthastico.OCTAVE_LENGTH*(synthastico.BASE_OCTAVE + 1))) / synthastico.OCTAVE_LENGTH) *
      (time / synthastico.SAMPLERATE);

    // console.log(val);

    // Get the ADSR amplitude.
    var amp = synthastico.ampFromADSR(
      note.totalPlayed,
      this.attack,
      this.decay,
      this.sustain,
      this.release,
      note.releaseTime
    );

    // Now apply the periodic function.
    var value =
      (val - Math.floor(val) - 0.5) * 1 * amp;

    return value;
  };

  // lead.connect(lowpass);
  lead.connect(reverb);
  // bass.connect(audioContext.destination);
  // lowpass.connect(sidechain);
  // lead.connect(audioContext.destination);
  reverb.connect(gain);
  gain.connect(audioContext.destination);
},1000);
