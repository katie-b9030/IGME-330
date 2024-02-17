/**
 * @overview Practice Exercies 05-B
 * @author Katie Bogart <klb9030@rit.edu>
 */

/** import functions */
import { getRandomColor } from "./utils.js";
import { getRandomInt } from "./utils.js";
import { drawRectangle } from "./canvas-utils.js";
import { drawArc } from "./canvas-utils.js";
import { drawLine } from "./canvas-utils.js";

/** Module Variables */
let ctx;
let canvas;
let paused = false;

let createRectangles = true;
let createArcs = true;
let createLines = true;

/**
 * sets up the base of the screensaver and starts the update loop
 */
const init = () => {
    console.log("page loaded!");
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    
    drawRectangle(ctx, 20, 20, 600, 440, "red");
    drawRectangle(ctx, 120, 120, 400, 300, "yellow", 20, "magenta");
    drawRectangle(ctx, 250, 400, 200, 125, "blue");
    drawRectangle(ctx, 10, 30, 100, 350, "purple", 20, "green");
    
    drawLine(ctx, 20, 20, 640, 460, 5, "magenta");
    drawLine(ctx, 640, 20, 20, 460, 5, "magenta");

    drawArc(ctx, 320, 240, 50, 0, Math.PI * 2, "gray", 5, "orange");
    drawArc(ctx, 320, 240, 20, 0, Math.PI, "white", 5, "teal");
    drawArc(ctx, 300, 220, 5, 0, Math.PI * 2, "black", 2, "brown");
    drawArc(ctx, 340, 220, 5, 0, Math.PI * 2, "black", 2, "brown");
    drawLine(ctx, 20, 80, 620, 80, 20, "lightblue");

    setupUI();
    update();
}

/**
 * called every frame and draws shapes based on what boxes are checked
 */
const update = () => {
    if (paused) return;
    requestAnimationFrame(update);
    if (createRectangles) drawRandomRect(ctx);
    if (createArcs) drawRandomArc(ctx);
    if (createLines) drawRandomLine(ctx);
}

// CANVAS 3

/**
 * draws a rectangle with a random size, position, and color
 */
const drawRandomRect = (ctx) => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor())
}

/**
 * draws an arc with a random radius, position, and color
 */
const drawRandomArc = (ctx) => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(2, 12), getRandomInt(0, Math.PI), getRandomColor(), getRandomInt(Math.PI + .01, Math.PI * 3), getRandomColor())
}

/**
 * draws a line with a random length, start position, and color
 */
const drawRandomLine = (ctx) => {
    drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(2, 12), getRandomColor())
}

/**
 * draws circles around a mouse click
 * "spraypaint" function
 */
const canvasClicked = (e) => {
    let rect = e.target.getBoundingClientRect();
    let mouseX = e.clientX - rect.x;
    let mouseY = e.clientY - rect.y;
    console.log(mouseX, mouseY);
    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(-100, 100) + mouseX;
        let y = getRandomInt(-100, 100) + mouseY;
        let radius = getRandomInt(20, 50);
        let color = getRandomColor();
        drawArc(ctx, x, y, radius, 0, 360, color);
    }
}

/**
 * sets up functionality of the canvas click, button clicks, and checkbox clicks
 */
const setupUI = () => {
    document.querySelector("#btn-pause").onclick = function () {
        paused = true;
    }
    document.querySelector("#btn-play").onclick = function () {
        if (!paused) return;
        else {
            paused = false;
            update();
        }
    }
    document.querySelector("#btn-clear").onclick = function () {
        drawRectangle(ctx, 0, 0, 640, 480);
    }

    canvas.onclick = canvasClicked;

    document.querySelector("#cb-rectangles").onclick = function (e) {
        createRectangles = e.target.checked;
    }
    document.querySelector("#cb-arcs").onclick = function (e) {
        createArcs = e.target.checked;
    }
    document.querySelector("#cb-lines").onclick = function (e) {
        createLines = e.target.checked;
    }
}

/** starts the screensaver */
init();