const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];

objects.push(new star(1000, 30, canvas.width / 2, canvas.height / 2));
objects.push(new orbitingPlanet(5, 8, canvas.width / 2 + 250, canvas.height / 2));

const Sim = new sim();
const Renderer = new renderer(canvas);

Sim.gameify();

function loop() {
    Renderer.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let object of objects) {
        Sim.step(object);
        Renderer.drawObject(object)
    }
    
    requestAnimationFrame(loop);
}

loop();