const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let objects = [];

objects.push(new star(1000, 50, canvas.width / 2, canvas.height / 2));
objects.push(new orbitingPlanet(5, 20, canvas.width / 2 + 250, canvas.height / 2));

const Sim = new sim();
const Renderer = new renderer(canvas);
const Controls = new controls();

Sim.gameify();

function loop() {
    Renderer.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let object of objects) {
        for (let i = 0; i < Controls.simulationSpeed; i++){Sim.step(object,i);}         
        Renderer.drawObject(object);   
    }
    
    requestAnimationFrame(loop);
}

loop();