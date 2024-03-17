/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import { SunflowerSprite } from './sprites.js';
import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData;
let vizualizeFrequency = true;
let bigSunflower, mediumSunflower, smallSunflower;


const setupCanvas = (canvasElement, analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: 0, color: "hotPink" }, { percent: .25, color: "paleVioletRed" }, { percent: .5, color: "lightPink" }, { percent: .75, color: "orange" }, { percent: 1, color: "gold" }]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize / 2);
	bigSunflower = new SunflowerSprite(canvasWidth/2, canvasHeight/2, 50, audioData);
	mediumSunflower = new SunflowerSprite(canvasWidth/5, canvasHeight*.75, 35, audioData);
	smallSunflower = new SunflowerSprite(canvasWidth*.8, canvasHeight/3, 20, audioData);
}

const draw = (params = {}) => {
	// 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	if (vizualizeFrequency) {
		analyserNode.getByteFrequencyData(audioData);
	}
	else {
		analyserNode.getByteTimeDomainData(audioData);
	}

	// 2 - draw background
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = .9;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.restore();

	// 3 - draw gradient
	if (params.showGradient) {
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.restore();
	}

	// 4 - draw bars
	if (params.showBars) {
		let barSpacing = 10;
		let margin = 10;
		let screenWidthForBars = canvasWidth - (15 * barSpacing) - margin * 2;
		let barWidth = screenWidthForBars / 21;
		let barHeight = 20;
		//let topSpacing = 100;

		ctx.save();
		ctx.fillStyle = 'rgba(55, 150, 55, 0.50)';
		ctx.strokeStyle = 'rgba(0, 0, 0, 0.50)';
		ctx.translate(margin, canvasHeight/2);
		// loop through the data and draw!
		for (let i = 0; i < audioData.length; i += audioData.length/16) {
			let yScale = audioData[i]/25;
			if (yScale < 1) {
				yScale = 1
			}
			// ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
			ctx.beginPath();
			ctx.moveTo(0, 0, barWidth, barHeight * yScale);
			ctx.lineTo(0, barHeight*yScale/2);
			ctx.lineTo(barWidth, barHeight*yScale/2);
			ctx.lineTo(barWidth, -barHeight*yScale/2);
			ctx.lineTo(0, -barHeight*yScale/2);
			ctx.closePath();
			ctx.fill();
			ctx.translate(margin + barSpacing + barWidth, 0);
		}
		ctx.restore();
	}

	bigSunflower.update(audioData);
	bigSunflower.draw(ctx);
	mediumSunflower.update(audioData);
	mediumSunflower.draw(ctx);
	smallSunflower.update(audioData);
	smallSunflower.draw(ctx);

	// 5 - draw circles
	// if (params.showCircles) {
	// 	let maxRadius = canvasHeight / 4;
	// 	ctx.save();
	// 	ctx.globalAlpha = 0.5;
	// 	for (let i = 0; i < audioData.length; i++) {
	// 		// red-ish circles
	// 		let percent = audioData[i] / 255;

	// 		let circleRadius = percent * maxRadius;
	// 		ctx.beginPath();
	// 		ctx.fillStyle = utils.makeColor(255, 111, 111, .34 - percent / 3.0);
	// 		ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius, 0, 2 * Math.PI, false);
	// 		ctx.fill();
	// 		ctx.closePath();

	// 		// blue-ishh circles, bigger, more transparent
	// 		ctx.beginPath();
	// 		ctx.fillStyle = utils.makeColor(0, 0, 255, .10 - percent / 10.0);
	// 		ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
	// 		ctx.fill();
	// 		ctx.closePath();

	// 		// yellow-ish circles, smaller
	// 		ctx.save();
	// 		ctx.beginPath();
	// 		ctx.fillStyle = utils.makeColor(200, 200, 0, .5 - percent / 5.0);
	// 		ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * .50, 0, 2 * Math.PI, false);
	// 		ctx.fill();
	// 		ctx.closePath();
	// 		ctx.restore();
	// 	}
	// 	ctx.restore();
	// }

	// 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width; // not using here
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i += 4) {
		// C) randomly change every 20th pixel to red
		if (params.showNoise && Math.random() < .05) {
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
			// data[i] = 255; // make the red channel 100% red
			data[i + 1] = data[i + 2] = 125
		} // end if

		// invert?
		if (params.showInvert) {
			let red = data[i], green = data[i + 1], blue = data[i + 2];
			data[i] = 255 - red; // set red
			data[i + 1] = 255 - green; // set green
			data[i + 2] = 255 - blue;	// set blue
			// data[i+3] is the alpha, but we're leaving that alone
		}
	} // end for

	if (params.showEmboss) {
		// note we are stepping through *each* sub-pixel
		for (let i = 0; i < length; i++) {
			if (i % 4 == 3) continue; // skip alpha channel
			data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
		}
	}
	// for (let i = 0; i < audioData.length; i++) {
	// 	let bigSunflower = new SunflowerSprite(canvasWidth/2, canvasHeight/2, 50 + audioData[i]);
	// 	bigSunflower.draw(ctx);
	// }

	

	// D) copy image data back to canvas
	ctx.putImageData(imageData, 0, 0);
} // end draw()

const changeVizualizeFrequency = () => {
	vizualizeFrequency = !vizualizeFrequency;
}

export { setupCanvas, draw, changeVizualizeFrequency };