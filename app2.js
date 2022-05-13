const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// handle mouse

const mouse = {
    x: null,
    y: null,
    radius: 450,
};

window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener("touchmove", (event) => {
    mouse.x = event.touches[ 0 ].clientX;
    mouse.y = event.touches[ 0 ].clientY;
});

ctx.fillStyle = "#fff";
ctx.font = "30px Verdana";
ctx.fillText("A", 20, 60);
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 0.25;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 13 + 1;
    }
    draw() {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x; // distance in the x axis
        let dy = mouse.y - this.y; // distance in the y axis
        let distance = Math.sqrt(dx * dx + dy * dy); // pythagoras theorem

        let forceDirectionX = dx / distance; // this represent sin or cos? the answer is sin, cos is opposite
        let forceDirectionY = dy / distance; // this represent sin or cos? the answer is sin, cos is opposite

        let maxDistance = mouse.radius; // this is the radius of the circle
        let force = (maxDistance - distance) / maxDistance; // this is the force of attraction
        let forceX = forceDirectionX * force * this.density; // this is the force of attraction in the x direction
        let forceY = forceDirectionY * force * this.density; // this is the force of attraction in the y direction

        if (distance < mouse.radius) { // this is the radius of the circle
            this.x += forceX; // this is the force of attraction in the x direction
            this.y += forceY; // this is the force of attraction in the y direction
        } else {
            this.size = 1;
        }
    }
}
function init() {
    particleArray = [];
    for (let i = 0; i < 500; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
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
}

animate();

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
