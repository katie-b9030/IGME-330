// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx:AudioContext;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element:HTMLAudioElement, sourceNode:MediaElementAudioSourceNode, biquadFilter:BiquadFilterNode, lowShelfBiquadFilter:BiquadFilterNode, distortionFilter:WaveShaperNode, analyserNode:AnalyserNode, gainNode:GainNode;
let highshelf:boolean = false;
let lowshelf:boolean = false;
let distortion:boolean = false;
let distortionAmount:number = 20;

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
const setupWebaudio = (filePath:string) => {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = new Audio();

    // 3 - have it point at a sound file
    loadSoundFile(filePath);

    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);

    // https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "highshelf";
    // biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    // biquadFilter.gain.setValueAtTime(20, audioCtx.currentTime);
    lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "highshelf";

    distortionFilter = audioCtx.createWaveShaper();

    // 5 - create an analyser node
    analyserNode = audioCtx.createAnalyser(); // note the UK spelling of "Analyser"

    /*
    // 6
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.

    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */

    // fft stands for Fast Fourier Transform
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(biquadFilter);
    biquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(distortionFilter);
    distortionFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

const loadSoundFile = (filePath:string) => {
    element.src = filePath;
}

const playCurrentSound = () => {
    element.play();
}

const pauseCurrentSound = () => {
    element.pause();
}

const setVolume = (value:number) => {
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

const toggleHighshelf = () => {
    highshelf = !highshelf;
    if (highshelf) {
        biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime); // we created the `biquadFilter` (i.e. "treble") node last time
        biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime);
    } else {
        biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

const toggleLowshelf = () => {
    lowshelf = !lowshelf;
    if (lowshelf) {
        lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
        lowShelfBiquadFilter.gain.setValueAtTime(15, audioCtx.currentTime);
    } else {
        lowShelfBiquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    }
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
const makeDistortionCurve = (amount = 20) => {
    let n_samples = 256, curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

const toggleDistortion = () => {
    distortion = !distortion;
    if (distortion) {
        distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        distortionFilter.curve = makeDistortionCurve(distortionAmount);
    } else {
        distortionFilter.curve = null;
    }
}

const changeDistortion = (amount:number) => {
    distortionAmount = amount;
    if (distortion) {
        distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        distortionFilter.curve = makeDistortionCurve(distortionAmount);
    } else {
        distortionFilter.curve = null;
    }
}

export { audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, toggleHighshelf, toggleLowshelf, toggleDistortion, makeDistortionCurve, changeDistortion, analyserNode, highshelf, lowshelf, distortion, distortionAmount };