const backgroundCanvas = document.getElementById("background-canvas");
const ctx = backgroundCanvas.getContext("2d");

function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}

let lineProgress = 0;
let lines = []

function draw() {
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    let dots = [];

    for (let x = 50; x < backgroundCanvas.width; x += 50) {
        for (let y = 50; y < backgroundCanvas.height; y += 50) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#424242";
            ctx.fill();
            dots.push([x, y]);
        }
    }

    if (lines.length === 0) {
        for (let i = 0; i < 15; i++) {
            const scrambledDots = dots.sort(() => Math.random() - 0.5);
            const start = scrambledDots[0];
            const end = scrambledDots[1];
            lines.push(new Line(start[0], start[1], end[0], end[1]));
        }
    }

    for (let i = 0; i < lines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(lines[i].startX, lines[i].startY);

        const endX = lines[i].startX + (lines[i].endX - lines[i].startX) * lineProgress;
        const endY = lines[i].startY + (lines[i].endY - lines[i].startY) * lineProgress;

        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    lineProgress += 0.01;
    if (lineProgress > 1) {
        lineProgress = 0;
        lines = []
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
window.requestAnimationFrame(draw);

resizeCanvas();

class Line {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
    }
}