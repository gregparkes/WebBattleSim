// handles attack objects and their logic

class Projectile extends Attack {

    constructor(x, y, team, dmg, dx, dy, range, vel=5., radius=2.5) {
        // call constructor attack
        super(x, y, team, dmg);
        // define extras to a projectile
        this.dx = dx;
        this.dy = dy;
        this.vel = vel;
        this.sx = x;
        this.sy = y;
        // size of the projectile (ball)
        this.hit_radius = radius;
        this.max_range = range * 1.3;
    }

    _in_range() {
        return utils.distanceXY(this.x, this.y, this.sx, this.sy) < this.max_range;
    }

    re_direct() {
        // this method is called when the projectile is re-directed.
        // slightly reduce damage and range
        this.damage *= 0.8;
        // projectile switches team
        this._switch_team();
        // if this attack damage is below 0, de-activate
        if (this.damage <= 0.1) {
            this.active = false;
            return;
        }
        // update positional arguments
        this.sx = this.x;
        this.sy = this.y;
        // flip direction (adding a small amount of error)
        this.dx *= -1.0 + (Math.random() / 15.0);
        this.dy *= -1.0 + (Math.random() / 15.0);
    }

    dealDamage(u) {
        // allow unit to calculate damage effects.
        u.dealDamageFrom(this.damage);
        // no longer active
        this.active = false;
    }

    has_collided(u) {
        // {2-16}
        let deflect_roll = utils.ddroll("2d8");
        // roll chance to deflect
        if (deflect_roll <= u.dflr) {
            // then re-direct the attack
            this.re_direct();
        } else {
            this.dealDamage(u);
        }
    }

    check_collision(md) {
        // get enemy unit list - only alive enemy units
        let enemy = md.get_enemies(this.team),
            L_enemy = enemy.length;
        // iterate over the enemies and check whether our attack has collided with any of them
        for (let i = 0; i < L_enemy; i++) {
            // check for collision
            let e = enemy[i],
                is_collided = collide.circle_circle(
                    this.x, this.y, this.hit_radius, e.x, e.y, e.hit_radius);
            // if we have collided with something, perform the collision
            if (is_collided) {
                // perform some calculation based on the unit.
                this.has_collided(e);
                break;
            }
        }
    }

    move() {
        this.x += this.dx * this.vel;
        this.y += this.dy * this.vel;
    }

    update(md) {
        if (this.active && this._in_range()) {
            // move
            this.move();
            // perform collision detection
            this.check_collision(md);
        } else {
            this.active = false;
        }
    }

    render(ctx) {
        if (this.active) {
            ctx.beginPath();
            // @ts-ignore
            ctx.fillStyle = "rgba({0},{1},{2},0.3)".format(this.color);
            ctx.arc(this.x, this.y, this.hit_radius, 0,
                Math.PI*2, false);
            ctx.fill();
        }
    }

}