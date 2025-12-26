class object {
  constructor(mass, radius, x, y) {
    this.mass = mass;
    this.radius = radius;
    this.pos = new Vec(x, y);

    this.color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255,
    ];
    const r = Math.max(0, this.color[0] - 80);
    const g = Math.max(0, this.color[1] - 80);
    const b = Math.max(0, this.color[2] - 80);

    this.strokeColor = `rgb(${r},${g},${b})`;

    const angle = Math.random() * Math.PI * 2;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));

    this.oldPos = new Vec(x - this.velocity.x * CONFIG.simTime, y - this.velocity.y * CONFIG.simTime);

  }

  gravity(neighbour) {
    const massSqr = this.mass * neighbour.mass;
    const dist = Vec.dist(this.pos, neighbour.pos);
    const force = (Controls.simG * massSqr) / (dist * dist + 100);
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
    force.limit(Controls.maxForce);
    return force;
  }

}

class planet extends object {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);
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

    this.oldPos = new Vec(x - this.velocity.x * CONFIG.simTime, y - this.velocity.y * CONFIG.simTime);
  }
}

class moon extends planet {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);

    if (Sim.planets.length === 0){
      throw new Error("No planet to orbit around!");
    }
    let orbitObject = Sim.planets[0];

    for (let planet of Sim.planets){
      if (Vec.dist(new Vec(x,y), planet.pos) < Vec.dist(new Vec(x,y), orbitObject.pos)){
        orbitObject = planet;
        break;
      }
    }

    const angle =
      Math.atan2(y - orbitObject.pos.y, x - orbitObject.pos.x) + Math.PI / 2;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));
    this.velocity.mult(
      Math.sqrt(
        (CONFIG.G * orbitObject.mass) / Vec.dist(this.pos, orbitObject.pos)
      )
    );

    this.oldPos = new Vec(x - this.velocity.x * CONFIG.simTime, y - this.velocity.y * CONFIG.simTime);

  }
}


class star extends object {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);
    this.color = [255, Math.floor(255 - (this.mass - 500) * (255 / 1500)), 0];
    const r = Math.max(0, this.color[0] - 80);
    const g = Math.max(0, this.color[1] - 80);
    const b = Math.max(0, this.color[2] - 80);

    this.strokeColor = `rgb(${r},${g},${b})`;
  }
}
