const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let planets = [];

for (let i = 0; i < CONFIG.planetCount; i++) {
  let boid = new planet(
    5,
    10,
    Math.random() * canvas.width,
    Math.random() * canvas.height,
  );
  planets.push(boid);
}

const Sim = new sim();
const Renderer = new renderer(canvas);

function loop() {
    Renderer.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let planet of planets){
        Sim.step(planet);
        Renderer.drawPlanet(planet)
    }
    
    requestAnimationFrame(loop);
}

loop();