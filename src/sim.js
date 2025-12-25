class sim{
    constructor(){
        this.time = CONFIG.simTime
    }

    step(object){
        if (object instanceof star) return;
    
        const force = object.totalForce();

        object.velocity.x += force.x/object.mass*this.time;
        object.velocity.y += force.y/object.mass*this.time;   

        object.pos.x += object.velocity.x * this.time + 0.5*(force.x/object.mass)*this.time*this.time;
        object.pos.y += object.velocity.y * this.time + 0.5*(force.y/object.mass)*this.time*this.time;
        
        this.delete(object);

        object.trailAdd()    
    }

    delete(object){
        if (object.pos.x + object.radius < 0 || object.pos.x - object.radius > canvas.width || object.pos.y + object.radius < 0 || object.pos.y - object.radius > canvas.height){
            const index = objects.indexOf(object);
            if (index > -1){
                objects.splice(index, 1);
            }
        }
    }

    gameify(){
        document.addEventListener('click', (event) => {
            const x = event.clientX;
            const y = event.clientY;
            objects.push(new orbitingPlanet(5, 8, x, y));
        });
    }

}