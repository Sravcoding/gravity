const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];

for (let i = 0; i < CONFIG.planetCount; i++) {
  let Planet = new planet(
    5,
    10,
    Math.random() * canvas.width,
    Math.random() * canvas.height,
  );
  objects.push(Planet);
}

objects.push(new star(10, 30, canvas.width / 2, canvas.height / 2));

const Sim = new sim();
const Renderer = new renderer(canvas);

function loop() {
    Renderer.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let object of objects) {
        Sim.step(object);
        Renderer.drawObject(object)
    }
    
    requestAnimationFrame(loop);
}

loop();