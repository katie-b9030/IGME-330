/**
 * @overview Practice Exercies 05-B
 * @author Katie Bogart <klb9030@rit.edu>
 */

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
init = () => {
    console.log("page loaded!");
    // #2 Now that the page has loaded, start drawing!

    // A - `canvas` variable points at <canvas> tag
    canvas = document.querySelector("canvas");

    // B - the `ctx` variable points at a "2D drawing context"
    ctx = canvas.getContext("2d");

    // C - all fill operations are now in red
    //ctx.fillStyle = "red";

    // D - fill a rectangle with the current fill color
    drawRectangle(ctx, 20, 20, 600, 440, "red");

    // IV Demo Rect
    drawRectangle(ctx, 120, 120, 400, 300, "yellow", 20, "magenta");

    // V Check it off

    // fill rect
    drawRectangle(ctx, 250, 400, 200, 125, "blue");

    // stroke rect
    drawRectangle(ctx, 10, 30, 100, 350, "purple", 20, "green");

    // CANVAS 2 ASSIGNMENT

    // II Demo

    // lines
    drawLine(ctx, 20, 20, 640, 460, 5, "magenta");

    drawLine(ctx, 640, 20, 20, 460, 5, "magenta");

    // circle
    drawArc(ctx, 320, 240, 50, 0, Math.PI * 2, "gray", 5, "orange");

    // semicircle
    drawArc(ctx, 320, 240, 20, 0, Math.PI, "white", 5, "teal");

    // III Check off

    // circle
    drawArc(ctx, 300, 220, 5, 0, Math.PI * 2, "black", 2, "brown");

    // circle
    drawArc(ctx, 340, 220, 5, 0, Math.PI * 2, "black", 2, "brown");

    // line
    drawLine(ctx, 20, 80, 620, 80, 20, "lightblue");

    // EVENT HANDLING
    setupUI();

    // SCREENSAVER
    update();
}

/**
 * called every frame and draws shapes based on what boxes are checked
 */
update = () => {
    if (paused) return;
    requestAnimationFrame(update);
    if (createRectangles) drawRandomRect(ctx);
    if (createArcs) drawRandomArc(ctx);
    if (createLines) drawRandomLine(ctx);
}

// CANVAS 3
// handy helper functions!
/**
 * returns a random rgb color with an opacity of 80%
 */
getRandomColor = () => {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return `rgba(${getByte()},${getByte()},${getByte()},.8)`;
}

/**
 * returns a random int between the given values
 */
getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * draws a rectangle with a random size, position, and color
 */
drawRandomRect = (ctx) => {
    drawRectangle(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(10, 90), getRandomColor(), getRandomInt(2, 12), getRandomColor())
}

/**
 * draws an arc with a random radius, position, and color
 */
drawRandomArc = (ctx) => {
    drawArc(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(10, 90), getRandomInt(2, 12), getRandomInt(0, Math.PI), getRandomColor(), getRandomInt(Math.PI + .01, Math.PI * 3), getRandomColor())
}

/**
 * draws a line with a random length, start position, and color
 */
drawRandomLine = (ctx) => {
    drawLine(ctx, getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(0, 640), getRandomInt(0, 480), getRandomInt(2, 12), getRandomColor())
}

// CANVAS 4
//event handlers
/**
 * draws circles around a mouse click
 * "spraypaint" function
 */
canvasClicked = (e) => {
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

// canvas helpers
/**
 * draws a rectangle with the given position, size, color, stroke, and lineWidth
 */
drawRectangle = (ctx, x, y, width, height, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
    if (lineWidth > 0) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();
}
/**
 * draws an arc with the given position, radius, start/end angle, color, stroke, and lineWidth
 */
drawArc = (ctx, x, y, radius, startAngle = 0, endAngle = Math.PI * 2, fillStyle = "black", lineWidth = 0, strokeStyle = "black") => {
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
/**
 * draws a rectangle with the given start position, length, stroke, and lineWidth
 */
drawLine = (ctx, x1, y1, x2, y2, lineWidth = 1, strokeStyle = "black") => {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

//helpers
/**
 * sets up functionality of the canvas click, button clicks, and checkbox clicks
 */
setupUI = () => {
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