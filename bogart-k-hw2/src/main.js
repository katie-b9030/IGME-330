/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as visualizer from './visualizer.js';

const drawParams = {
  showGradient: true,
  showBars: true,
  showCircles: true,
  showNoise: false,
  showInvert: false,
  showEmboss: false,
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
  sound1: "media/New Adventure Theme.mp3"
});

const init = () => {
  console.log("init called");
  console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
  audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
  setupUI(canvasElement);
  visualizer.setupCanvas(canvasElement, audio.analyserNode);
  loadJson();
  loop();
}

const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
  const playButton = document.querySelector("#btn-play");

  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // add .onclick event to buttion
  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no") {
      // if track is currently paused, play it
      audio.playCurrentSound();
      e.target.dataset.playing = "yes" // our CSS will set the text to "Pause"
    }
    // if track IS playing, pause it
    else {
      audio.pauseCurrentSound();
      e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
    }

    let gradientCB = document.querySelector("#cb-gradient");
    let barsCB = document.querySelector("#cb-bars");
    // let circlesCB = document.querySelector("#cb-circles");
    let noiseCB = document.querySelector("#cb-noise");
    let invertCB = document.querySelector("#cb-invert");
    let embossCB = document.querySelector("#cb-emboss");

    gradientCB.onchange = e => {
      if (gradientCB.checked) {
        drawParams.showGradient = true;
      }
      else {
        drawParams.showGradient = false;
      }
    }

    barsCB.onchange = e => {
      if (barsCB.checked) {
        drawParams.showBars = true;
      }
      else {
        drawParams.showBars = false;
      }
    }

    // circlesCB.onchange = e => {
    //   if (circlesCB.checked) {
    //     drawParams.showCircles = true;
    //   }
    //   else {
    //     drawParams.showCircles = false;
    //   }
    // }

    noiseCB.onchange = e => {
      if (noiseCB.checked) {
        drawParams.showNoise = true;
      }
      else {
        drawParams.showNoise = false;
      }
    }

    invertCB.onchange = e => {
      if (invertCB.checked) {
        drawParams.showInvert = true;
      }
      else {
        drawParams.showInvert = false;
      }
    }

    embossCB.onchange = e => {
      if (embossCB.checked) {
        drawParams.showEmboss = true;
      }
      else {
        drawParams.showEmboss = false;
      }
    }
  };

  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect = document.querySelector("#select-track");
  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  let vizualizerSelect = document.querySelector("#select-vizualizer")
  vizualizerSelect.onchange = e => {
    visualizer.changeVizualizeFrequency();
  }

  // I. set the initial state of the high shelf checkbox
  document.querySelector('#cb-highshelf').checked = audio.highshelf; // `highshelf` is a boolean we will declare in a second

  // II. change the value of `highshelf` every time the high shelf checkbox changes state
  document.querySelector('#cb-highshelf').onchange = e => {
    audio.toggleHighshelf(); // turn on or turn off the filter, depending on the value of `highshelf`!
  };

  // I. set the initial state of the low shelf checkbox
  document.querySelector('#cb-lowshelf').checked = audio.lowshelf; // `lowshelf` is a boolean we will declare in a second

  // II. change the value of `lowshelf` every time the low shelf checkbox changes state
  document.querySelector('#cb-lowshelf').onchange = e => {
    audio.toggleLowshelf(); // turn on or turn off the filter, depending on the value of `lowshelf`!
  };

  document.querySelector('#slider-distortion').value = audio.distortionAmount;
  document.querySelector('#slider-distortion').onchange = e => {
    audio.changeDistortion(Number(e.target.value));
  };
  document.querySelector("#cb-distortion").value = audio.distortionAmount;
  document.querySelector('#cb-distortion').onchange = e => {
    audio.toggleDistortion();
  };

} // end setupUI

const loop = () => {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  setTimeout(loop, 1000 / 60);

  visualizer.draw(drawParams);
}

const loadJson = () => {
  const url = "./data/av-data.json"
  const xhr = new XMLHttpRequest();
  xhr.onload = (e) => {
      console.log(`In onload - HTTP Status Code = ${e.target.status}`);
      const string = e.target.responseText;
      const json = JSON.parse(string);
      const title = json["title"];
      const trackFiles = json["track-files"];
      const trackNames = json["track-names"];
      const instructions = json["instructions"];

      const titleHtml = `<h1>${title.map(w => `${w}`).join("")}</h1>`;
      const instructionsHtml = `<p>${instructions.map(w => `${w}<br>`).join("")}</p>`;
      const infoHtml = `${titleHtml}${instructionsHtml}`;

      document.querySelector("#info").innerHTML = infoHtml;

      let trackSelect = document.querySelector("#select-track");
      trackSelect.querySelector("#NAT").value = trackFiles[0];
      trackSelect.querySelector("#NAT").innerHTML = trackNames[0];
      trackSelect.querySelector("#PT").value = trackFiles[1];
      trackSelect.querySelector("#PT").innerHTML = trackNames[1];
      trackSelect.querySelector("#TPS").value = trackFiles[2];
      trackSelect.querySelector("#TPS").innerHTML = trackNames[2];
  };
  xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
  xhr.open("GET", url);
  xhr.send();
}

export { init };