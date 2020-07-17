// types of AI for units

const UNITAITYPE = {
    AGRESSIVE: 0, HIT_AND_RUN: 1, STAND: 2, DEFENSIVE: 3
}

// A Unit is an object that can move, attack, defend and in general has a large, diverse set of
// capabilities.


class Unit extends Combative {

    constructor(i, x, y, hp, damage, mvs, range, team, fire_rate, dflr, ai) {
        // call element
        super(i, x, y, team, hp);
        // attributes
        this.hit_radius = 8;
        this.damage = damage;
        this.mvs = mvs;
        this.range = range;
        this.fire_rate = fire_rate;
        this.dflr = dflr;
        this.ai = ai;
        // default attack type
        this.atk_type = AttackType.PROJECTILE;
        // by default - infantry
        this.utype = "infantry";
    
        // default unit size
        this.sizebot = 10;
        this.sizelen = 17;
    }
    
    _execute_movement(md, modifier=1., towards=true) {
        // moves this combative with bounds check
        this.moveToTarget(md, this.mvs * modifier, towards);
        // update is_attacking flag
        this.is_attacking = false;
    }
    
    _unit_collision_check(md, towards=true) {
        // iterate over every alive unit and check (assuming not us) whether there is a single circle collision
        let collision_objs = md._alive.filter(e =>
            ((this.id !== e.id) && collide.circle_circle(this.x, this.y, this.hit_radius * .7, e.x, e.y, e.hit_radius*.7))
        )
        if (collision_objs.length > 0) {
            // move away from the first collided object
            let e = collision_objs[0];
            // update dx, dy, _dist, nddx and nddy to target
            this.updateToTarget(e, false);
            // collision has occurred
            this._execute_movement(md, .3, !towards);
        } else {
            // collision has not occured
            this._execute_movement(md, 1., towards);
        }
    }
    
    // public functions
    
    move(md, towards=true) {
        if (md.UU_COLLISION) {
            this._unit_collision_check(md, towards);
        } else {
            this._execute_movement(md, 1., towards);
        }
    }
    
    isTargetInRange() {
        return (this._dist <= this.range);
    }
    
    attack(md) {
        if (this.atk_type === AttackType.PROJECTILE) {
            if (Math.random() < this.fire_rate) {
                md.projectiles.push(new Projectile(
                    this.x, this.y, this.team, this.damage, this._nddx, this._nddy,
                    this.range));
            }
        } else if (this.atk_type === AttackType.MELEE) {
            if (Math.random() < this.fire_rate) {
                // do a swing attack..
                md.melees.push(new Melee(
                    this.target.x, this.target.y, this.team, this.damage, this.target
                ));
            }
        } else {
            alert("Attack type'" + this.atk_type + "' not recognized");
        }
    }
    
    // update and render defaults
    
    update(md) {
        this.alive = this.hp > 0.0;
        if (this.alive) {
            // update distance to target metrics
            this.updateToTarget();
            // make an AI decision on what to do in this circumstance.
            this.ai(this, md);
        }
    }
    
    render(ctx) {
        // default rendering
        if (this.alive) {
            // hit box circle
            //draw.circle(ctx, this.x, this.y, this.color, 8);
            draw.arrow(ctx, this.x, this.y,
                this._angle, this.color, this.sizebot,
                this.sizelen);
            // draw a health bar on top if damaged
            if (this.hp < this.MAX_HP && IS_HP_DISPLAYED) {
                draw.healthbar(ctx, this.x, this.y - 6, this.hp / this.MAX_HP);
            }
        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }
    }

}
