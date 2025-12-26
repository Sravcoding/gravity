class object {
  constructor(mass, radius, x, y) {
    this.mass = mass;
    this.radius = radius;
    this.pos = new Vec(x, y);

    const angle = Math.random() * Math.PI * 2;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));

  }

  gravity(neighbour) {
    const massSqr = this.mass * neighbour.mass;
    const dist = Vec.dist(this.pos, neighbour.pos) + 0.001;
    const force = (CONFIG.G * massSqr) / (dist * dist + 15);
    return new Vec(
      (force * (neighbour.pos.x - this.pos.x)) / dist,
      (force * (neighbour.pos.y - this.pos.y)) / dist
    );
  }

  totalForce() {
    const force = new Vec(0, 0);
    for (let neighbour of Sim.objects) {
      if (neighbour === this) continue;
      force.add(this.gravity(neighbour));
    }

    return force;
  }

}

class planet extends object {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);
    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    this.trail = [];

    this.tempTrail = [];
    this.tempPos = new Vec(0,0);
    this.tempVel = new Vec(0,0);
  }

  trailAdd() {
    this.trail.push({ x: this.pos.x, y: this.pos.y });
    if (this.trail.length > 1000) {
      this.trail.shift();
    }
  }

  predict() {
    if (this.tempTrail.length === 0){
      this.tempPos = new Vec(this.pos.x, this.pos.y);
      this.tempVel = new Vec(this.velocity.x, this.velocity.y);
      this.tempTrail = [...this.trail];
    }
    Sim.step(this, -1);
    Renderer.drawTrail(this);
  }

  unPredict() {
    this.pos = new Vec(this.tempPos.x, this.tempPos.y);
    this.velocity = new Vec(this.tempVel.x, this.tempVel.y);
    this.trail = this.tempTrail.map(p => ({...p}));
    this.tempTrail = [];
  }

}

class orbitingPlanet extends planet {
  constructor(mass, radius, x, y) {
    if (Sim.stars.length === 0){
      throw new Error("No star to orbit around!");
    }
    let orbitObject = Sim.stars[0];

    for (let sun of Sim.stars){
      if (Vec.dist(new Vec(x,y), sun.pos) < Vec.dist(new Vec(x,y), orbitObject.pos)){
        orbitObject = sun;
        break;
      }
    }

    super(mass, radius, x, y);
    const angle =
      Math.atan2(y - orbitObject.pos.y, x - orbitObject.pos.x) + Math.PI / 2;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));
    this.velocity.mult(
      Math.sqrt(
        (CONFIG.G * orbitObject.mass) / Vec.dist(this.pos, orbitObject.pos)
      )
    );
    this.velocity.mult(Math.random() * 0.2 + 0.9);
  }
}

class star extends object {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);
    this.color = [255, Math.floor(255 - (this.mass - 500) * (255 / 1500)), 0];
  }
}
