const backgroundCanvas = document.getElementById("background-canvas");
const ctx = backgroundCanvas.getContext("2d");

function resizeCanvas() {
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
}

function draw() {
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
}

window.addEventListener("resize", resizeCanvas);
window.requestAnimationFrame(draw);

resizeCanvas();