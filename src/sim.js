class sim{
    constructor(){
        this.time = CONFIG.simTime
    }

    step(object, i){
        if (object instanceof star) return;
    
        const force = object.totalForce();

        object.velocity.x += force.x/object.mass*this.time;
        object.velocity.y += force.y/object.mass*this.time;   

        object.pos.x += object.velocity.x * this.time + 0.5*(force.x/object.mass)*this.time*this.time;
        object.pos.y += object.velocity.y * this.time + 0.5*(force.y/object.mass)*this.time*this.time;

        if (i === CONFIG.simSpeed - 1){object.trailAdd();}

        this.delete(object);
    }

    delete(object){
        if (object.pos.x + object.radius < 0 || object.pos.x - object.radius > canvas.width || object.pos.y + object.radius < 0 || object.pos.y - object.radius > canvas.height
            || (Vec.dist(object.pos, objects[0].pos) < objects[0].radius)
        ){
            const index = objects.indexOf(object);
            if (index > -1){
                objects.splice(index, 1);
            }
        }
    }

    gameify(){
        let pPress = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P'){
                pPress = true;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'p' || e.key === 'P'){
                pPress = false;
            }
        }); 

        document.addEventListener('click', (event) => {
            if (pPress){
                console.log("wyt")
                const x = event.clientX;
                const y = event.clientY;
                objects.push(new planet(5, 20, x, y));
            }else{
                const x = event.clientX;
                const y = event.clientY;
                objects.push(new orbitingPlanet(5, 20, x, y));
            }
        });
    }

}