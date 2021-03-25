// handles attack objects and their logic

class Projectile extends Attack {

    constructor(source, damage, vel=5., radius=2.5, is_crit = false) {
        // call constructor attack
        super(source, damage, is_crit);
        // define extras to a projectile
        // calculates dx and dy based on target.
        this.vel = vel;
        this.sx = source.x;
        this.sy = source.y;
        [this.dx, this.dy] = source.directionalDerivatives(source.target.x, source.target.y);
        // size of the projectile (ball)
        this.hit_radius = radius;
        this.max_range = source.range * 1.3;
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
            this.alive = false;
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
        // allow unit to perform damage effects.
        u.dealDamageFrom(this.source, this.damage);
        // no longer active
        this.alive = false;
    }

    unit_collided(u) {
        // {2-16}
        // roll chance to deflect
        if (Dice.d2d8() <= u.dflr) {
            // then re-direct the attack
            this.re_direct();
        } else {
            // does this projectile contain a crit?
            this.dealDamage(u);
            if (this.is_crit)
            {
                this._hit_crit_target = u;
            }
        }
    }

    check_collision(md) {
        // get enemy unit list - only alive enemy units

        let units_hit = md.get_enemies(this.team).filter(e =>
            collide.circle_circle(this.x, this.y, this.hit_radius, e.x, e.y, e.hit_radius)),
            obstacles_hit = md.obstacles.filter(o =>
            collide.circle_rect(this.x, this.y, this.hit_radius, o.x, o.y, o.w, o.h));

        if (units_hit.length > 0) {
            let u = units_hit[0];
            this.unit_collided(u);
            if (this.is_crit) {
                md.crits.push(new Crit(u.x, u.y, md.t))
            }
        }
        // otherwise lets look at obstacles
        else if (obstacles_hit.length > 0) {
            // the projectile stops.
            this.alive = false;
        }
    }

    translate() {
        this.x += this.dx * this.vel;
        this.y += this.dy * this.vel;
    }

    update(md) {
        if (this.alive && this._in_range()) {
            // move
            this.translate();
            // perform collision detection
            this.check_collision(md);
        } else {
            this.alive = false;
        }
    }

    render(ctx) {
        if (this.alive) {
            ctx.beginPath();
            // @ts-ignore
            ctx.fillStyle = "rgba({0},{1},{2},0.3)".format(this.color);
            ctx.arc(this.x, this.y, this.hit_radius, 0,
                Math.PI*2, false);
            ctx.fill();
        }
    }

}