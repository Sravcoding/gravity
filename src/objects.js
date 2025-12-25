class object{
    
    constructor(mass,radius,x,y){
        this.mass = mass;
        this.radius = radius;
        this.pos = new Vec(x,y);
    }

    gravity(neighbour){
        const massSqr = this.mass * neighbour.mass;
        const dist = Vec.dist(this.pos,neighbour.pos) + 0.001;
        const force = (CONFIG.G * massSqr)/(dist*dist);
        return new Vec(force*(neighbour.pos.x - this.pos.x)/dist,force*(neighbour.pos.y - this.pos.y)/dist);
    }

    totalForce(){
        const force = new Vec(0,0);
        for (let neighbour of objects){
            if (neighbour === this) continue;
            force.add(this.gravity(neighbour));
        }

        return force;
    }

}

class planet extends object{
    constructor(mass,radius,x,y){
        super(mass,radius,x,y);
        const angle = Math.random()*Math.PI*2;
        this.velocity = new Vec(Math.cos(angle), Math.sin(angle));
        this.color = [Math.random()*255,Math.random()*255,Math.random()*255];
    }
}

class star extends object{
    constructor(mass,radius,x,y){
        super(mass,radius,x,y);
        this.color = [255,255,0];
    }
}