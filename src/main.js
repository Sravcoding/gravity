const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const Sim = new sim();
const Renderer = new renderer(canvas);
const Controls = new controls();


let paused = false; 

function loop() {
    if (!Controls.paused){

        Renderer.ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let object of Sim.objects) {
            if (paused && (object instanceof planet)) {paused = false; object.unPredict();}
            for (let i = 0; i < Controls.simulationSpeed; i++){Sim.step(object,i);}         
            Renderer.drawObject(object);   
        }
    }else{
        paused = true;
        for (let object of Sim.objects.filter(obj => obj instanceof planet)) {
            for (let i = 0; i < Controls.predictionSpeed; i++){
                object.predict();
            }
        }
    }
    
    requestAnimationFrame(loop);
}

loop();