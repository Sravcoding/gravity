class sim{
    constructor(){
        this.objects = [];
        this.planets = [];
        this.stars = [];

        this.time = CONFIG.simTime;
        this.keys = {};
        this.mouse = {x: 0, y: 0};
        this.setUpListeners();
    }

    step(object, i){
        if (object instanceof star) return;
    
        const force = object.totalForce();

        object.velocity.x += force.x/object.mass*this.time;
        object.velocity.y += force.y/object.mass*this.time;   

        object.pos.x += object.velocity.x * this.time + 0.5*(force.x/object.mass)*this.time*this.time;
        object.pos.y += object.velocity.y * this.time + 0.5*(force.y/object.mass)*this.time*this.time;

        if (i === CONFIG.simSpeed - 1 || i === -1){object.trailAdd();}

        if (i != -1){this.oob(object);this.inSun(object);}
    }
    inSun(object){
        for (let star of this.stars){
            if (Math.hypot(object.pos.x - star.pos.x, object.pos.y - star.pos.y) < star.radius){
                this.deleteObject(object);
            }
        }
    }

    oob(object){
        if (object.pos.x + object.radius < 0 || object.pos.x - object.radius > canvas.width || object.pos.y + object.radius < 0 || object.pos.y - object.radius > canvas.height){
           this.deleteObject(object);
        }
    }

    deleteObject(object){
         const index = this.objects.indexOf(object);
            if (index > -1){
                this.objects.splice(index, 1);
            }
    }

    setUpListeners(){
        document.addEventListener('mousemove', (e) => {
            this.mouse = {x: e.clientX, y: e.clientY};
        });
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            try{
                if (this.keys['o'] === true){
                    this.objects.push(new orbitingPlanet(Controls.planetMass, Controls.planetRadius, this.mouse.x, this.mouse.y));
                }
                else if (this.keys['p'] === true){
                    this.objects.push(new planet(Controls.planetMass, Controls.planetRadius, this.mouse.x, this.mouse.y));
                }
                else if (this.keys['s'] === true){
                    const mass = Controls.sunMass;
                    const radius = Controls.sunRadius;
                    const sun = new star(mass, radius, this.mouse.x, this.mouse.y);
                    this.objects.push(sun);
                    this.stars.push(sun);
                }
            }catch(err){
                alert(err);
            }

            this.keys[e.key] = false;
        }); 

    }


}