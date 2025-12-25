class sim{
    constructor(){
        this.time = CONFIG.simTime
    }
    
    step(planet){
        const force = planet.totalForce();

        planet.pos.x += planet.velocity.x * this.time + 0.5*(force.x/planet.mass)*this.time*this.time;
        planet.pos.y += planet.velocity.y * this.time + 0.5*(force.y/planet.mass)*this.time*this.time;

        planet.velocity.x += force.x/planet.mass*this.time;
        planet.velocity.y += force.y/planet.mass*this.time;       
    }

}