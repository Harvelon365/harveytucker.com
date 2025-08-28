const backgroundCanvas = document.getElementById("background-canvas");
const ctx = backgroundCanvas.getContext("2d");

class Dot {
    constructor(posX, posY) {
        this.currX = posX;
        this.currY = posY;
        this.originX = posX;
        this.originY = posY;
        this.startX = posX;
        this.startY = posY;
        this.endX = posX;
        this.endY = posY;
        this.progress = 1;
    }
}

class Line {
    constructor(startDot, endDot) {
        this.startDot = startDot;
        this.endDot = endDot;
        this.progress = 0;
    }
}

function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}

let dots = [];
let lines = [];

function setupDots() {
    for (let x = 50; x < backgroundCanvas.width - 50; x += 100) {
        for (let y = 50; y < backgroundCanvas.height - 50; y += 100) {
            dots.push(new Dot(x, y));
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    for (const dot of dots) {
        let posX = dot.startX + (dot.endX - dot.startX) * dot.progress;
        let posY = dot.startY + (dot.endY - dot.startY) * dot.progress;
        ctx.beginPath();
        ctx.arc(posX, posY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#5c5c5c";
        ctx.fill();
        dot.currX = posX;
        dot.currY = posY;

        let a = dot.startX - dot.endX;
        let b = dot.startY - dot.endY;
        dot.progress += 0.05 / Math.sqrt(a * a + b * b);
        if (dot.progress > 1) {
            dot.progress = 0;
            dot.startX = dot.endX;
            dot.startY = dot.endY;
            dot.endX = dot.originX + Math.random() * 20 - 10;
            dot.endY = dot.originY + Math.random() * 20 - 10;
        }
    }

    if (lines.length === 0) {
        for (let i = 0; i < 15; i++) {
            const scrambledDots = dots.sort(() => Math.random() - 0.5);
            const start = scrambledDots[0];
            const end = scrambledDots[1];
            lines.push(new Line(start, end));
        }
    }

    for (let i = 0; i < lines.length; i++) {
        let startX;
        let startY;
        let endX;
        let endY;

        if (lines[i].progress < 0.5) {
            startX = lines[i].startDot.currX;
            startY = lines[i].startDot.currY;
            endX = lines[i].startDot.currX + (lines[i].endDot.currX - lines[i].startDot.currX) * (lines[i].progress * 2);
            endY = lines[i].startDot.currY + (lines[i].endDot.currY - lines[i].startDot.currY) * (lines[i].progress * 2);
        }
        else {
            startX = lines[i].startDot.currX + (lines[i].endDot.currX - lines[i].startDot.currX) * ((lines[i].progress - 0.5) * 2);
            startY = lines[i].startDot.currY + (lines[i].endDot.currY - lines[i].startDot.currY) * ((lines[i].progress - 0.5) * 2);
            endX = lines[i].endDot.currX;
            endY = lines[i].endDot.currY;
        }

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#5c5c5c";
        ctx.strokeWidth = 2;
        ctx.stroke();

        let a = lines[i].startDot.currX - lines[i].endDot.currX;
        let b = lines[i].startDot.currY - lines[i].endDot.currY;
        lines[i].progress += 0.05 / Math.sqrt(a * a + b * b);
        if (lines[i].progress > 1) {
            lines[i].progress = 0;
            const scrambledDots = dots.sort(() => Math.random() - 0.5);
            const end = scrambledDots[0];
            lines[i].startDot = lines[i].endDot;
            lines[i].endDot = end;
        }
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

setupDots();
window.requestAnimationFrame(draw);