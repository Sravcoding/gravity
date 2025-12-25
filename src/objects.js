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
    for (let neighbour of objects) {
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
  }

  trailAdd() {
    this.trail.push({ x: this.pos.x, y: this.pos.y });
    if (this.trail.length > 50*this.radius) {
      this.trail.shift();
    }
  }
}

class orbitingPlanet extends planet {
  constructor(mass, radius, x, y, orbitObject = objects[0]) {
    super(mass, radius, x, y);
    const angle =
      Math.atan2(y - orbitObject.pos.y, x - orbitObject.pos.x) + Math.PI / 2;
    this.velocity = new Vec(Math.cos(angle), Math.sin(angle));
    this.velocity.mult(
      Math.sqrt(
        (CONFIG.G * orbitObject.mass) / Vec.dist(this.pos, orbitObject.pos)
      )
    );
  }
}

class star extends object {
  constructor(mass, radius, x, y) {
    super(mass, radius, x, y);
    this.color = [255, 255, 0];
  }
}
