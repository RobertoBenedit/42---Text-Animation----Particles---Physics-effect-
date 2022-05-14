const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let adjustX = 5;
let adjustY = 5;

// handle mouse

const mouse = {
    x: null,
    y: null,
    radius: 150,
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("touchmove", (event) => {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

ctx.fillStyle = "#fff";
ctx.font = "30px Verdana";
ctx.fillText("RC", 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 7 + 1;
    }
    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx * 0.05;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy * 0.05;
            }
        }
    }
}
function init() {
    particleArray = [];
    for (let i = 0, i2 = textCoordinates.height; i < i2; i++) {
        for (let j = 0, j2 = textCoordinates.width; j < j2; j++) {
            if (
                textCoordinates.data[
                    j * 4 * textCoordinates.width + i * 4 + 3
                ] > 128
            ) {
                let positionX = i + adjustX;
                let positionY = j + adjustY;
                particleArray.push(
                    new Particle(positionX * 20, positionY * 20)
                );
            }
        }
    }
}

init();

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function connect() {
    let opacityValue = 1;

    for (let i = 0; i < particleArray.length; i++) {
        for (let j = i; j < particleArray.length; j++) {
            if (i !== j) {
                let dx = particleArray[i].x - particleArray[j].x;
                let dy = particleArray[i].y - particleArray[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 50) {
                    // opacityValue = 1 - distance / 50;
                    ctx.strokeStyle = `rgba(120,255,255,${opacityValue})`;
                    ctx.beginPath();
                    ctx.moveTo(particleArray[i].x, particleArray[i].y);
                    ctx.lineTo(particleArray[j].x, particleArray[j].y);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
}
