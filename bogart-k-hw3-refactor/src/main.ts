/*
  main.js is primarily responsible for hooking up the UI to the rest of the application 
  and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils';
import * as audio from './audio';
import * as visualizer from './visualizer';

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
  let canvasElement:HTMLCanvasElement = document.querySelector("canvas")!; // hookup <canvas> element
  setupUI(canvasElement);
  visualizer.setupCanvas(canvasElement, audio.analyserNode);
  loadJson();
  loop();
}

const setupUI = (canvasElement: HTMLCanvasElement) => {
  // A - hookup fullscreen button
  const fsButton:HTMLButtonElement = document.querySelector("#btn-fs")!;
  const playButton:HTMLButtonElement = document.querySelector("#btn-play")!;

  // add .onclick event to button
  fsButton.onclick = () => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };

  // add .onclick event to buttion
  playButton.onclick = (e:MouseEvent) => {
    let target = e.target as HTMLButtonElement;

    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (target.dataset.playing == "no") {
      // if track is currently paused, play it
      audio.playCurrentSound();
      (target).dataset.playing = "yes" // our CSS will set the text to "Pause"
    }
    // if track IS playing, pause it
    else {
      audio.pauseCurrentSound();
      (target as HTMLButtonElement).dataset.playing = "no"; // our CSS will set the text to "Play"
    }

    let gradientCB:HTMLInputElement = document.querySelector("#cb-gradient")!;
    let barsCB:HTMLInputElement = document.querySelector("#cb-bars")!;
    // let circlesCB = document.querySelector("#cb-circles");
    let noiseCB:HTMLInputElement = document.querySelector("#cb-noise")!;
    let invertCB:HTMLInputElement = document.querySelector("#cb-invert")!;
    let embossCB:HTMLInputElement = document.querySelector("#cb-emboss")!;

    gradientCB.onchange = () => {
      if (gradientCB.checked) {
        drawParams.showGradient = true;
      }
      else {
        drawParams.showGradient = false;
      }
    }

    barsCB.onchange = () => {
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

    noiseCB.onchange = () => {
      if (noiseCB.checked) {
        drawParams.showNoise = true;
      }
      else {
        drawParams.showNoise = false;
      }
    }

    invertCB.onchange = () => {
      if (invertCB.checked) {
        drawParams.showInvert = true;
      }
      else {
        drawParams.showInvert = false;
      }
    }

    embossCB.onchange = () => {
      if (embossCB.checked) {
        drawParams.showEmboss = true;
      }
      else {
        drawParams.showEmboss = false;
      }
    }
  };

  // C - hookup volume slider & label
  let volumeSlider:HTMLInputElement = document.querySelector("#slider-volume")!;
  let volumeLabel:HTMLLabelElement = document.querySelector("#label-volume")!;

  // add .oninput event to slider
  volumeSlider!.oninput = e => {
    let target = e.target as HTMLButtonElement;

    // set the gain
    audio.setVolume(Number(target.value));
    // update value of label to match value of slider
    volumeLabel!.innerHTML = Math.round((Number(target.value) / 2 * 100)).toString();
  };

  // set value of label to match initial value of slider
  volumeSlider!.dispatchEvent(new Event("input"));

  // D - hookup track <select>
  let trackSelect:HTMLSelectElement = document.querySelector("#select-track")!;
  // add .onchange event to <select>
  trackSelect!.onchange = e => {
    let target = e.target as HTMLButtonElement;

    audio.loadSoundFile((target as HTMLButtonElement).value);
    // pause the current track if it is playing
    if (playButton.dataset.playing == "yes") {
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  let vizualizerSelect:HTMLElement = document.querySelector("#select-vizualizer")!;
  vizualizerSelect!.onchange = () => {
    visualizer.changeVizualizeFrequency();
  }

  let highshelfCB:HTMLInputElement = document.querySelector('#cb-highshelf')!;
  let lowshelfCB:HTMLInputElement = document.querySelector('#cb-lowshelf')!;
  let distortionSlider:HTMLInputElement = document.querySelector('#slider-distortion')!;
  let distortionCB:HTMLInputElement = document.querySelector("#cb-distortion")!;

  // I. set the initial state of the high shelf checkbox
  highshelfCB!.checked = audio.highshelf; // `highshelf` is a boolean we will declare in a second

  // II. change the value of `highshelf` every time the high shelf checkbox changes state
  highshelfCB!.onchange = () => {
    audio.toggleHighshelf(); // turn on or turn off the filter, depending on the value of `highshelf`!
  };

  // I. set the initial state of the low shelf checkbox
  lowshelfCB!.checked = audio.lowshelf; // `lowshelf` is a boolean we will declare in a second

  // II. change the value of `lowshelf` every time the low shelf checkbox changes state
  lowshelfCB!.onchange = () => {
    audio.toggleLowshelf(); // turn on or turn off the filter, depending on the value of `lowshelf`!
  };

  distortionSlider.value = audio.distortionAmount.toString();
  distortionSlider.onchange = e => {
    let target = e.target as HTMLInputElement;

    audio.changeDistortion(Number(target.value));
  };
  distortionCB.value = audio.distortionAmount.toString();
  distortionCB.onchange = () => {
    audio.toggleDistortion();
  };

} // end setupUI

const loop = () => {
  /* NOTE: This is temporary testing code that we will delete in Part II */
  setTimeout(loop, 1000 / 60);

  visualizer.draw(drawParams);
}

const loadJson = () => {

  const url:string = "./data/av-data.json"
  const xhr:XMLHttpRequest = new XMLHttpRequest();
  xhr.onload = e => {
      let target:EventTarget = e.target!;
      console.log(`In onload - HTTP Status Code = ${(target as XMLHttpRequest).status}`);
      const string = (target as XMLHttpRequest).responseText;
      const json = JSON.parse(string);
      const title = json["title"];
      const trackFiles = json["track-files"];
      const trackNames = json["track-names"];
      const instructions = json["instructions"];

      const titleHtml = `${title.map((w:string) => `${w}`).join("")}`;
      const instructionsHtml = `<p>${instructions.map((w:string) => `${w}<br>`).join("")}</p>`;

      document.querySelector(".title")!.innerHTML = titleHtml;
      document.querySelector(".subtitle")!.innerHTML = instructionsHtml;

      let trackSelect:HTMLSelectElement = document.querySelector("#select-track")!;
      let trackSelectNat:HTMLSelectElement = trackSelect.querySelector("#NAT")!;
      let trackSelectPt:HTMLSelectElement = trackSelect.querySelector("#PT")!;
      let trackSelectTps:HTMLSelectElement = trackSelect.querySelector("#TPS")!;
      trackSelectNat.value = trackFiles[0];
      trackSelectNat!.innerHTML = trackNames[0];
      trackSelectPt.value = trackFiles[1];
      trackSelectPt.innerHTML = trackNames[1];
      trackSelectTps.value = trackFiles[2];
      trackSelectTps.innerHTML = trackNames[2];
  };
  xhr.onerror = e => {
    let target:EventTarget = e.target!;

    console.log(`In onerror - HTTP Status Code = ${(target as XMLHttpRequest).status}`);
  }
  xhr.open("GET", url);
  xhr.send();
}

export { init };