;(function () {
  var BASE_FREQUENCY = 440;
  var OCTAVE_LENGTH = 12;
  var SAMPLERATE = 44100;
  var BUFFER_SIZE = 256;
  var TEMPO = 120;
  var BASE_OCTAVE = 4;

  var semitones = {
    'Cb': -1,
    C   : 0,
    'C#': 1,
    'Db': 1,
    D   : 2,
    'D#': 3,
    'Eb': 3,
    E   : 4,
    'Fb': 4,
    'E#': 5,
    F   : 5,
    'F#': 6,
    'Gb': 6,
    G   : 7,
    'G#': 8,
    'Ab': 8,
    A   : 9,
    'A#': 10,
    'Bb': 10,
    B   : 11
  };

  window.synthastico = {
    BASE_FREQUENCY: BASE_FREQUENCY,
    OCTAVE_LENGTH: OCTAVE_LENGTH,
    BASE_OCTAVE: BASE_OCTAVE,
    SAMPLERATE: SAMPLERATE,
    createSynth: function (audioContext, notes) {
      // The node that we are going to return.
      var node = {
        _node: audioContext.createScriptProcessor(BUFFER_SIZE, 2, 2),
        connect: function (node) {
          this._node.connect(node);
        }
      };

      node.attack = 0;
      node.decay = 0;
      node.sustain = 1;
      node.release = 0;

      function createNoteCallback(note) {
        note = createNote(note);
        return {
          start: note.start,
          end: note.end,
          tone: getSemitoneFromNote(note.tone),
        };
      }

      // This is the sound of our synth. It's overrideable.
      node.sound = function (note, time) {
        // Create a "period" based on the note's semitone.
        var val =
          BASE_FREQUENCY *
          Math.pow(2, (note.tone - (OCTAVE_LENGTH*BASE_OCTAVE)) /OCTAVE_LENGTH) *
          (time / SAMPLERATE);

        // console.log(val);

        // Get the ADSR amplitude.
        var amp = ampFromADSR(
          note.totalPlayed,
          this.attack,
          this.decay,
          this.sustain,
          this.release,
          note.releaseTime
        );

        // Now apply the periodic function.
        var value = Math.sin(val) * 1 * amp;

        return value;
      };

      function createNotes(timeOffset) {
        timeOffset = timeOffset || 0;
        var retval = Array(notes.length);
        for (var i = 0; i < notes.length; i++) {
          var note = createNote(notes[i]);
          retval[i] = {
            start: note.start + timeOffset,
            end: note.end + timeOffset,
            tone: getSemitoneFromNote(note.tone),
            totalPlayed: note.totalPlayed
          };
        }
        return retval;
      }

      // This is where we wil store our notes to play.
      var toPlay = [];
      var _notes = createNotes();
      // Just a discrete timer.
      var x = 0;

      node._node.onaudioprocess = function (e) {
        if (this.bass) { console.log('Good.'); }
        // Get the left and right output buffers.
        var L = e.outputBuffer.getChannelData(0);
        var R = e.outputBuffer.getChannelData(1);

        for (var i = 0; i < L.length; i++) {
          L[i] = R[i] = 0;

          // Push all notes that we
          while (_notes[0] && _notes[0].start <= x) {
            toPlay.push(_notes.shift());
          }

          for (var j = 0; j < toPlay.length; j++) {
            // If we're at the end of our note, then start "releasing".
            if (x >= toPlay[j].end && !toPlay[j].releaseTime) {
              toPlay[j].releaseTime = toPlay[j].totalPlayed;
            }
            if (x >= toPlay[j].start) {
              L[i] = R[i] = L[i] + node.sound(toPlay[j], x);
              toPlay[j].totalPlayed++;
            }
          }

          // While there is a top note, and that top note's ending is less than
          // the number of samples played minus the realease time, take it out
          // out of the list.
          while (toPlay[0] && (x - node.release + 1) >= toPlay[0].end) {
            toPlay[0].totalPlayed = 0;
            toPlay[0].releaseTime = 0;
            toPlay.shift();
          }

          x++;

          var allEnded = true;
          for (var j = 0; j < toPlay.length; j++) {
            if (x >= toPlay[j].end) {
              allEnded = false; break;
            }
          }
          if (_notes.length) {
            allEnded = false;
          }

          if (allEnded && (x % (((SAMPLERATE * 60)/TEMPO)*4) === 0)) {
            _notes = createNotes(x);
          }
        }
      }
      return node;
    },
    ampFromADSR: ampFromADSR
  };

  // Create a note object.
  function createNote(note) {
    note = JSON.parse(JSON.stringify(note));
    note.end =
      (note.start + note.measure + note.duration) *
        SAMPLERATE * (60 / TEMPO) * 4;
    note.start = (note.start + note.measure) * SAMPLERATE * (60 / TEMPO) * 4;
    note.totalPlayed = 0;
    note.amplitude = 1;
    return note;
  }

  // Generate an amplitude coefficient. This value is time-sensitive, and it's
  // amplitude is determined by particular events, based on the attack, decay,
  // and release paramaters. The sustain determines the result of the
  // coefficient after the decay time.
  // TODO: expose this function.
  function ampFromADSR(samplesPlayed, a, d, s, r, releaseTime) {
    var value = 0;
    if (samplesPlayed <= a && !releaseTime) {
      value = a === 0 ? 1 : (1 / a) * samplesPlayed;
    } else if (samplesPlayed > a && samplesPlayed <= d && !releaseTime) {
      value = d === 0 ? s : -((1 - s) / d) * (samplesPlayed - a) + 1;
    } else if (samplesPlayed > d && !releaseTime) {
      value = s;
    } else if (releaseTime) {
      value = -(s / r) * (samplesPlayed - releaseTime) + s;
      if (value < 0) { value = 0 }
    }
    return value;
  }

  // Converts a string representation of a note into an integral semitone.
  function getSemitoneFromNote(note) {
    if (typeof note !== 'string' || !/^[CDEFGAB](\#|b)?[0-9]+$/.test(note)) {
      throw new Error('Unable to read the note string format');
    }
    var key = note[0];
    var octave = note.slice(1, note.length);
    if (octave[0] === '#' || octave[0] === 'b') {
      key += octave[0];
      octave = octave.slice(1, octave.length);
    }
    var semitone = semitones[key] + parseInt(octave, 10) * OCTAVE_LENGTH;
    if (semitone < 0) {
      throw new Error('Can\'t have a semitone less than 0');
    }
    return semitone;
  }
}());
