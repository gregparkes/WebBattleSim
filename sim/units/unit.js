// types of AI for units

const UNITAITYPE = {
    AGRESSIVE: 0, HIT_AND_RUN: 1, STAND: 2, DEFENSIVE: 3
}

// A Unit is an object that can move, attack, defend and in general has a large, diverse set of
// capabilities.

/*
Units are the main object of reference which contain the D&D stats of ATK, DEX, CON, etc.
they can move and attack primarily, towards a target of reference, using a selection
of AI capabilities.
 */

class Unit extends Combative {

    constructor(i, x, y, atk, dex, con, mvs, range,
                team, fire_rate, dflr, ai) {
        // call element
        super(i, x, y, team, con);
        // attributes
        this.hit_radius = 8;
        this.atk = atk;
        this.dex = dex;
        this.speed = mvs;
        this.range = range;
        this.fire_rate = fire_rate;
        this.dflr = dflr;
        this.ai = ai;
        // default attack type
        this.atk_type = AttackType.PROJECTILE;
        // a critical modifier of 2 is default
        this.crit_modifier = 2.0;
        // default unit size
        this.sizebot = 10;
        this.sizelen = 17;

        this._crit_this_round = false;
    }
    
    _unit_collision_check(md, speed_modifier) {
        // iterate over every alive unit and check (assuming not us) whether there is a single circle collision
        let collision_objs = md._alive.filter(e =>
            ((this.id !== e.id) && collide.circle_circle(this.x, this.y, this.hit_radius * .7,
                e.x, e.y, e.hit_radius*.7))
        )
        if (collision_objs.length > 0) {
            // move away from the first collided object
            let e = collision_objs[0];
            // update dx, dy, _dist, nddx and nddy to target
            this.updateToTarget(e, false, true);
            // collision has occurred
            this.translate(md, this.speed * -0.3 * speed_modifier);
        } else {
            // collision has not occured
            this.translate(md, this.speed * speed_modifier);
        }
    }
    
    // public functions
    
    move(md, speed_modifier=1.0) {
        if (md.UU_COLLISION) {
            this._unit_collision_check(md, speed_modifier);
        } else {
            this.translate(md, this.speed * speed_modifier);
        }
    }
    
    isTargetInRange() {
        return (this._dist <= this.range);
    }

    roll_damage() {
        /* Calculates the damage roll for this round.
         */
        this._crit_this_round = false;
        let mod_damage = 0.0;
        /* Rolls attack chance as
            (BASE ATTACK + 1d6) > Opp. BASE DEX
         */
        if ((this.atk + Dice.d1d6()) >= this.target.dex) {
            // attack proceeds

            /*
            Calculate damage as:
                (BASE ATTACK + 2d8) - (Opp BASE DEX + 1d8) OR 1.
             */
            mod_damage = (this.atk + Dice.d2d8()) - (this.target.dex + Dice.d1d8());
            // make sure mod_damage is at least 1
            if (mod_damage <= 0.0) {
                mod_damage = 1.0;
            }
            /* 3% crit chance */
            if (Math.random() < 0.03)
            {
                mod_damage *= this.crit_modifier;
                this._crit_this_round = true;
            }
        }
        return mod_damage;
    }
    
    attack(md) {
        let mod_damage = this.roll_damage();

        if (mod_damage > 0.0)
        {
            // create an object to handle this damage output
            if (this.atk_type === AttackType.PROJECTILE) {
                if (Math.random() < this.fire_rate) {
                    md.projectiles.push(new Projectile(this, mod_damage, 5., 2.5, this._crit_this_round));
                }
            } else if (this.atk_type === AttackType.MELEE) {
                if (Math.random() < this.fire_rate) {
                    // do a swing attack..
                    md.melees.push(new Melee(this, mod_damage, this.target));
                }
            } else {
                alert("Attack type'" + this.atk_type + "' not recognized");
            }
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
