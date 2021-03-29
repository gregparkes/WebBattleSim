/**
 * This spawner spawns groups of units at the same time.
 */
class GroupSpawner extends Spawner {

    constructor(unit, rate_prob, n=Infinity, group_size = 3) {
        /*
        Receives a unit class, number of units to spawn, a start time (as t), the rate of spawning as a probability (t).
         */
        super(unit, rate_prob, n);
        this.group_size = group_size;
    }

    spawn(md) {

        let x = utils.randomInt(10, md.field.width - 10),
            y = utils.randomInt(10, md.field.height - 10);

        for (let i = 0; i < this.group_size; i ++) {
            let u = new this.unit(x + Math.random() * 10., y + Math.random() * 10., AI.aggressive);
            u.target = ai_next_target.nearest(u, md);
            md.units.push(u);
        }
    }

}