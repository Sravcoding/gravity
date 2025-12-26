class renderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
  }

  drawObject(object) {
    if (object instanceof planet) {          
      this.drawTrail(object);
    }   

    const ctx = this.ctx;
    ctx.globalAlpha = 1.0;

    if (object instanceof star) {
        ctx.shadowBlur = object.radius / 2; 
        ctx.shadowColor = object.strokeColor;
    } else {
        ctx.shadowBlur = 0;
    }

    ctx.fillStyle = `rgb(${object.color[0]},${object.color[1]},${object.color[2]})`;
    ctx.beginPath();
    ctx.arc(object.pos.x, object.pos.y, object.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = object.strokeColor || 'black'; 
    ctx.lineWidth = Math.floor(object.radius/10) + 1; 
    ctx.stroke();
     
  }

  drawTrail(object) {
    const ctx = this.ctx;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgb(${object.color[0]},${object.color[1]},${object.color[2]})`;
    ctx.lineWidth = 5;
    for (let i = 1; i < object.trail.length; i++) {
      ctx.beginPath();
      ctx.globalAlpha = i / object.trail.length;
      ctx.moveTo(object.trail[i-1].x, object.trail[i-1].y);
      ctx.lineTo(object.trail[i].x, object.trail[i].y);  
      ctx.stroke();
    }
  }
}  

class controls {
  constructor() {
    this.paused = false;
    this.maxForce = CONFIG.maxForce;
    this.simG = CONFIG.G;
    this.outsideBoundsBuffer = CONFIG.outsideBoundsBuffer;
    this.simulationSpeed = CONFIG.simSpeed;
    this.predictionSpeed = CONFIG.predictionSpeed;
    this.simulationTime = CONFIG.simTime;
    this.sunMass = CONFIG.sunMass;
    this.planetMass = CONFIG.planetMass;
    this.moonMass = CONFIG.moonMass;
    this.sunRadius = CONFIG.sunRadius;
    this.planetRadius = CONFIG.planetRadius;
    this.moonRadius = CONFIG.moonRadius;

    this.gui = new lil.GUI({ title: "GUI" });
    this.gui2 = this.gui.addFolder("Simulation Settings");
    this.gui3 = this.gui.addFolder("Object Settings");
    
    this.createUI();
    this.addListeners();
  }

  createUI(){
    this.gui2.add(this, "paused").name("Predict").listen();

    this.gui2.add(this, "simulationSpeed", 10, 500, 1).name("Speed").onChange((value) => {
      this.simulationSpeed = value;
    });

    this.gui2.add(this, "simulationTime", 0.001, 0.01).name("Delta T").onChange((value) => {
      Sim.time = value;
    });

    this.gui2.add(this, "predictionSpeed", 1, 100, 1).name("Prediction Speed").onChange((value) => {
      this.predictionSpeed = value;
    });

    this.gui2.add(this, "outsideBoundsBuffer", 500, 10000, 100).name("Bounds Buffer").onChange((value) => {
      this.outsideBoundsBuffer = value;
    });

    this.gui2.add(this, "maxForce", 1, 100, 10).name("Max Force").onChange((value) => {
      this.maxForce = value;
    });

    this.gui2.add(this, "simG", 1, 20, 1).name("G Constant").onChange((value) => {
      this.simG = value;
    });

    this.gui3.add(this, "sunMass", 300, 2000, 100).name("Sun Mass").onChange((value) => {
      this.sunMass = value;
    });

    this.gui3.add(this, "planetMass", 10, 200, 10).name("Planet Mass").onChange((value) => {
      this.planetMass = value;
    });

    this.gui3.add(this, "moonMass", 1, 30, 5).name("Moon Mass").onChange((value) => {
      this.moonMass = value;
    });

    this.gui3.add(this, "sunRadius", 10, 100, 10).name("Sun Radius").onChange((value) => {
      this.sunRadius = value;
    });

    this.gui3.add(this, "planetRadius", 10, 50, 5).name("Planet Radius").onChange((value) => {
      this.planetRadius = value;
    });

    this.gui3.add(this, "moonRadius", 5, 30, 5).name("Moon Radius").onChange((value) => {
      this.moonRadius = value;
    });

  }

  addListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePause();
      }
    });
  }

  togglePause() {
    this.paused = !this.paused;
  }

}
