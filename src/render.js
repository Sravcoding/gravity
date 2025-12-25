class renderer {
  constructor(canvas, flock) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.flock = flock;
  }

  drawObject(object) {
    const ctx = this.ctx;

    ctx.fillStyle = `rgb(${object.color[0]},${object.color[1]},${object.color[2]})`;
    ctx.beginPath();
    ctx.arc(object.pos.x, object.pos.y, object.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
