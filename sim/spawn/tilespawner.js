/**
 * A class for spawning units on random tiles.
 * Ensure that tiles selected are not tiles that are impassable.
 */
class RandomTileSpawner extends Spawner {
    /**
     *
     * @param unit
     * @param rate_prob
     * @param n
     */
    constructor(unit, rate_prob, n=Infinity) {
        super(unit, rate_prob, n, 0);
        // just use the level within the md attribute.
    }

    spawn(md) {
        /** spawns a unit on a random passable tile */
        let tx = 0,
            ty = 0,
            tile = null;
        do {
            tx = utils.randomInt(0, md.level.xtiles-1);
            ty = utils.randomInt(0, md.level.ytiles-1);
            tile = md.level.tileCoord(tx, ty);
        }
        while (!tile.passable);

        // create a new unit and assign it a target
        let u = new this.unit(tx*md.level.size, ty*md.level.size, AI.aggressive);
        u.target = ai_next_target.nearest(u, md);
        // now spawn a unit on that tile.
        md.units.push(u);
    }
}


