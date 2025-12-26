class sim {
  constructor() {
    this.objects = [];
    this.planets = [];
    this.stars = [];

    this.time = CONFIG.simTime;
    this.keys = {};
    this.mouse = { x: 0, y: 0 };
    this.setUpListeners();
  }

  step(object, i) {
    if (object instanceof star) return;

    const force = object.totalForce();
    const accel = new Vec(force.x / object.mass, force.y / object.mass);

    const tempX = object.pos.x;
    const tempY = object.pos.y;

    // VERLET INTEGRATION FORMULA:
    // pos = pos * 2 - oldPos + accel * dt^2
    object.pos.x = object.pos.x * 2 - object.oldPos.x + accel.x * (this.time * this.time);
    object.pos.y = object.pos.y * 2 - object.oldPos.y + accel.y * (this.time * this.time);

    object.oldPos.x = tempX;
    object.oldPos.y = tempY;

    object.velocity.x = (object.pos.x - object.oldPos.x) / this.time;
    object.velocity.y = (object.pos.y - object.oldPos.y) / this.time;

    if (i === CONFIG.simSpeed - 1 || i === -1) {
      object.trailAdd();
    }

    if (i != -1) {
      this.oob(object);
      this.inSun(object);
    }
  }
  inSun(object) {
    for (let star of this.stars) {
      if (
        Math.hypot(object.pos.x - star.pos.x, object.pos.y - star.pos.y) <
        star.radius
      ) {
        this.deleteObject(object);
      }
    }
  }

  oob(object) {
    const buffer = Controls.outsideBoundsBuffer;
    if (
      object.pos.x + object.radius < -buffer ||
      object.pos.x - object.radius > canvas.width + buffer ||
      object.pos.y + object.radius < -buffer ||
      object.pos.y - object.radius > canvas.height + buffer
    ) {
      this.deleteObject(object);
    }
  }

  deleteObject(object) {
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }

  setUpListeners() {
    
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    document.addEventListener("mousemove", (e) => {
      this.mouse = { x: e.clientX, y: e.clientY };
    });
    document.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    document.addEventListener("keyup", (e) => {
      try {
        if (this.keys["o"] === true) {
          const planeti = new orbitingPlanet(
            Controls.planetMass,
            Controls.planetRadius,
            this.mouse.x,
            this.mouse.y
          );
          this.objects.push(planeti);
          this.planets.push(planeti);
        } else if (this.keys["p"] === true) {
          const planeti = new planet(
            Controls.planetMass,
            Controls.planetRadius,
            this.mouse.x,
            this.mouse.y
          );
          this.objects.push(planeti);
          this.planets.push(planeti);
        } else if (this.keys["m"] === true) {
          this.objects.push(
            new moon(
              Controls.moonMass,
              Controls.moonRadius,
              this.mouse.x,
              this.mouse.y
            )
          );
        } else if (this.keys["s"] === true) {
          const mass = Controls.sunMass;
          const radius = Controls.sunRadius;
          const sun = new star(mass, radius, this.mouse.x, this.mouse.y);
          this.objects.push(sun);
          this.stars.push(sun);
        }
      } catch (err) {
        alert(err);
      }

      this.keys[e.key] = false;
    });
  }
}
