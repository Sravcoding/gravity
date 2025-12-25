class renderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
  }

  drawObject(object) {
    const ctx = this.ctx;
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = `rgb(${object.color[0]},${object.color[1]},${object.color[2]})`;
    ctx.beginPath();
    ctx.arc(object.pos.x, object.pos.y, object.radius, 0, Math.PI * 2);
    ctx.fill();
    if (object instanceof planet) {
      this.drawTrail(object);
    }
  }

  drawTrail(object) {
    const ctx = this.ctx;
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
    this.simulationSpeed = CONFIG.simSpeed;

    this.gui = new lil.GUI({ title: "Controls" });
    this.createUI();
    //this.addListeners();
  }

  createUI(){
    //this.gui.add(this, "paused").name("Pause").listen();

    this.gui.add(this, "simulationSpeed", 10, 1000, 1).name("Speed").onChange((value) => {
      this.simulationSpeed = value;
    });

  }

  /*addListeners() {
    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        this.togglePause();
      }
    });
  }*/

}
