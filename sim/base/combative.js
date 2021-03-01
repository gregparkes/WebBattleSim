// combative objects have an identifier,
// and a *Target* as well as
// positional, team and color coordinates from Sprite

/*
A Combative extends Sprite, has a position id, with hit points and a potential target object of interest.
Combative also can move, so they contain dx and dy, with temp variables _nddx, _nddy which are normalized
directions of which way to go.
 */

class Combative extends Sprite {

    constructor(i, x, y, team, con) {
        super(x, y, team);
        // set ID and hit points
        this.id = i;
        // constitution converted directly to HP
        this.hp = this.MAX_HP = 20 + (con * 7);
        // target set to null
        this.target = null;
        // a bunch of hidden parameters for direcitonal derivatives
        this.dx = 0.0;
        this.dy = 0.0;
        this._nddx = 0.0;
        this._nddy = 0.0;
        this._dist = 0.0;
        this._angle = 0.0;
    }

    // with target set, we can calculate distances and angles to this
    // target

    updateToTarget(other = this.target,
                   update_angle = true,
                   add_perturbation = false) {
        /* Updates the derivatives and direction of the unit with. respect. to. the target.
            other : Unit or Combative
            update_angle : bool
                Whether to update the angle the unit is facing (or not).
            add_perturbation : bool
                Adds small noise to x and y to make it easier with unit collision.
         */
        if (other) {
            if (add_perturbation)
            {
                this.dx = other.x - this.x + (Math.random() * 2 - 1);
                this.dy = other.y - this.y + (Math.random() * 2 - 1);
            }
            else {
                this.dx = other.x - this.x;
                this.dy = other.y - this.y;
            }
            this._dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this._nddx = this.dx / this._dist;
            this._nddy = this.dy / this._dist;
            if (update_angle) {
                this._angle = Math.atan2(this.dy, this.dx);
            }
        }
    }

    translate(md, speed) {
        /* Moves the Combative according to its target derivative.
            md : the battleground data
            speed : float
                Speed parameter modifier.
         */
        this.x += this._nddx * speed;
        this.y += this._nddy * speed;
        // bounds check to edge of the map
        this.bounds_check(md);
    }

    angleToTarget() {
        return this._angle;
    }

    dealDamageFrom(dmg) {
        this.hp -= dmg;
    }

    isTargetAlive() {
        return (this.target && this.target.hp > 0.0);
    }

}