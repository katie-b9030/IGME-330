export class SunflowerSprite {
    constructor(x, y, centerRadius, audioData){
        this.x = x;
        this.y = y;
        this.centerRadius = centerRadius;
        this.audioData = this.audioData;
        this.length = audioData.length;
        this.scale=1;
    }

    update(audioData){
        this.audioData = audioData;
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.x, this.y);
        let scale = this.audioData[this.length/2]/100;
        if (scale < 1){
            scale = 1;
        }
        ctx.scale(scale, scale);
        // petals
        for (let i = 0; i < 8; i ++){
            drawPetal(ctx, this.centerRadius*2, i*Math.PI/4, "#FFBF00");
        }
        for (let i = 0; i < 8; i ++){
            drawPetal(ctx, this.centerRadius*2, Math.PI/8 + i*Math.PI/4, "#FFCF40");
        }
        // outer center
        ctx.fillStyle = "#3D2314";
        ctx.beginPath();
        ctx.arc(0, 0, this.centerRadius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        // inner center
        ctx.fillStyle = "#23120B";
        ctx.beginPath();
        ctx.arc(0, 0, this.centerRadius*.66, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

const drawPetal = (ctx, length, rotation, color) => {
    ctx.save();
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-length/8, 0);
    ctx.lineTo(-length/8, -length*.66);
    ctx.lineTo(0, -length);
    ctx.lineTo(length/8, -length*.66);
    ctx.lineTo(length/8, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}