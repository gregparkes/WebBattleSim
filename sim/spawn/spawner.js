// a base class for spawning units directly into the map after the beginning

class Spawner extends CanvObj {
    /*
    this object gains access to the update method and spawns in units at a certain rate for a faction
    there are different types of spawners as shown in derivative js files.
     */
    constructor(unit, rate_prob, n=Infinity, start=0, ) {
        /*
        Receives a unit class, number of units to spawn, a start time (as t), the rate of spawning as a probability (t).
         */
        super();
        this.unit = unit.OBJ;
        this.n = n;
        this.start = start;
        this.rate = rate_prob;
    }

    spawn(md) {
        /*
        Children of Spawner will overload this function `spawn` and add a custom spawning mechanism.
         */
        let x = utils.randomInt(10, md.field.width - 10),
            y = utils.randomInt(10, md.field.height - 10),
            i = md.units.length,
            u = new this.unit(i, x, y, AI.aggressive);
        // push new unit on to the battle stack
        md.units.push(u);
    }

    update(md) {
        // when we are passed start, begin
        if (this.alive && md.t >= this.start && this.n >= 0) {
            // roll a probability
            if (Math.random() < this.rate) {
                // spawn a unit of appropriate class into the arena... somewhere.
                this.spawn(md);
                if (this.n !== Infinity) {
                    this.n -= 1;
                }
            }
        } else {
            this.alive = false;
        }
    }
}