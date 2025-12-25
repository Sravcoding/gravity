class sim{
    constructor(){
        this.time = CONFIG.simTime
    }

    step(object){
        if (object instanceof star) return;
    
        const force = object.totalForce();

        object.pos.x += object.velocity.x * this.time + 0.5*(force.x/object.mass)*this.time*this.time;
        object.pos.y += object.velocity.y * this.time + 0.5*(force.y/object.mass)*this.time*this.time;
        this.warp(object);
        object.velocity.x += force.x/object.mass*this.time;
        object.velocity.y += force.y/object.mass*this.time;       
    }

    warp(object){
        if (object.pos.x + object.radius < 0) object.pos.x += canvas.width;
        if (object.pos.x + object.radius > canvas.width) object.pos.x -= canvas.width;
        if (object.pos.y + object.radius < 0) object.pos.y += canvas.height;
        if (object.pos.y + object.radius > canvas.height) object.pos.y -= canvas.height;
    }

}