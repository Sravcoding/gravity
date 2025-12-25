class renderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
  }

  drawPlanet(planet) {
    const ctx = this.ctx;

    ctx.fillStyle = "#fcfcfc";
    ctx.beginPath();
    ctx.arc(planet.pos.x, planet.pos.y, planet.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
