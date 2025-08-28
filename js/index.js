const backgroundCanvas = document.getElementById("background-canvas");
const ctx = backgroundCanvas.getContext("2d");

class Dot {
    constructor(posX, posY) {
        this.startX = posX;
        this.startY = posY;
        this.posX = posX;
        this.posY = posY;
    }
}

class Line {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
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
        dot.posX = Math.min(Math.max(dot.posX + Math.random() * 4 - 2, dot.startX - 10), dot.startX + 10);
        dot.posY = Math.min(Math.max(dot.posY + Math.random() * 4 - 2, dot.startY - 10), dot.startY + 10);
        ctx.beginPath();
        ctx.arc(dot.posX, dot.posY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#5c5c5c";
        ctx.fill();
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
        let startX;
        let startY;
        let endX;
        let endY;

        if (lines[i].progress < 0.5) {
            startX = lines[i].startX;
            startY = lines[i].startY;
            endX = lines[i].startX + (lines[i].endX - lines[i].startX) * (lines[i].progress * 2);
            endY = lines[i].startY + (lines[i].endY - lines[i].startY) * (lines[i].progress * 2);
        }
        else {
            startX = lines[i].startX + (lines[i].endX - lines[i].startX) * ((lines[i].progress - 0.5) * 2);
            startY = lines[i].startY + (lines[i].endY - lines[i].startY) * ((lines[i].progress - 0.5) * 2);
            endX = lines[i].endX;
            endY = lines[i].endY;
        }

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = "#5c5c5c";
        ctx.strokeWidth = 2;
        ctx.stroke();

        let a = lines[i].startX - lines[i].endX;
        let b = lines[i].startY - lines[i].endY;
        lines[i].progress += 0.001 + ((Math.sqrt(a * a + b * b) / backgroundCanvas.width) * 0.002);
        if (lines[i].progress > 1) {
            lines[i].progress = 0;
            const scrambledDots = dots.sort(() => Math.random() - 0.5);
            const end = scrambledDots[0];
            lines[i].startX = lines[i].endX;
            lines[i].startY = lines[i].endY;
            lines[i].endX = end[0];
            lines[i].endY = end[1];
        }
    }
    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

setupDots();
window.requestAnimationFrame(draw);