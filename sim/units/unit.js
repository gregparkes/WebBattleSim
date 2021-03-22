// A Unit is an object that can move, attack, defend and in general has a large, diverse set of
// capabilities.

/*
Units are the main object of reference which contain the D&D stats of ATK, DEX, CON, etc.
they can move and attack primarily, towards a target of reference, using a selection
of AI capabilities.
 */

class Unit extends Combative {

    /**
     * Creates a new unit object.
     * @param x : float
     * @param y : float
     * @param atk : number
     * @param dex : number
     * @param con : number
     * @param mvs : float
     * @param range : float
     * @param team : number
     * @param fire_rate : float
     * @param dflr : float
     * @param ai : function
     * @param move_mode : string
     */
    constructor(x, y, atk, dex, con, mvs, range,
                team, fire_rate, dflr, ai) {
        // call element
        super(x, y, team, con);
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

        this.tile_hover = null;
        // a boolean for determining whether we have clicked this.
        this.is_selected = false;
        // a cache for astar search
        this._astar_result = null;

    }


    _unit_collision_check(md, s) {
        // iterate over every alive unit and check (assuming not us) whether there is a single circle collision
        let collision_units = md._alive.filter(e =>
            ((e !== this) && collide.circle_circle(this.x, this.y, this.hit_radius * .7,
                e.x, e.y, e.hit_radius * .7))
        );
        // oscillate
        if (collision_units.length > 0) {
            this.updateToTarget(collision_units[0], false, true);
            this.translate(md, this.speed*-.3*s);
            this.updateToTarget();
            return true;
        }
        return false;
    }
    // public functions

    _tile_collision_check(md, s) {
        /* check to see if the updated position moves onto an unpassable tile, and if so return true.
         */
        // check if, after translation, we move onto another tile
        let fx = this.x + (this._nddx * s),
            fy = this.y + (this._nddy * s),
            tile_other = md.level.tileAt(fx, fy, md.terrain_type);

        return !tile_other.passable;
    }

    move(md, speed=1.0) {
        // check what tile we are currently on.
        this.tile_hover = md.level.tileAt(this.x, this.y, md.terrain_type);

        // if we have tile collision on
        if (md.TILE_COLLISION && this._tile_collision_check(md, speed)) {
            // AND we collide with a tile, block
            return;
        }
        // if we collide with another unit..
        if (md.UNIT_COLLISION && this._unit_collision_check(md, speed)) {
            return;
        }
        // else translate.
        this.translate(md, this.speed*speed);
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

            /*
            If the unit's movement is euclidean, we update to the target, else we derive derivatives
            from the A* star aglorithms' next tile in the path.
             */
            if (md.UNIT_MOVE_MODE === "euclidean")
            {
                // update distance to target metrics
                this.updateToTarget();
                // make an AI decision on what to do in this circumstance.
                this.ai(this, md);
            }
            else if (md.UNIT_MOVE_MODE === "astar")
            {
                let ls = this.level.size;

                if ((this._astar_result === null) || Math.random() < 0.005)
                {
                    let tx = Math.floor(this.x / ls),
                        ty = Math.floor(this.y / ls),
                        ox = Math.floor(this.target.x / ls),
                        oy = Math.floor(this.target.y / ls),
                        start = md.level.graph.grid[ty*this.level.xtiles + tx],
                        end = md.level.graph.grid[oy*this.level.xtiles + ox];
                    // perform a-star search.
                    this._astar_result = astar.search(md.level.graph, start, end);
                    // fetch the first node and move
                }
                let node = this._astar_result[0],
                    halfLevel = ls / 2.0,
                    pix_x = (node.x * ls) - halfLevel,
                    pix_y = (node.y * ls) - halfLevel;

                // now use the node position to update to target
                this.updateToTarget({x: pix_x, y: pix_y}, false, false);
                this.ai(this, md);
            }
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
            draw.arrow_edge(ctx, this.x, this.y, this._angle, this.sizebot, this.sizelen);
            // draw a health bar on top if damaged
            if (this.hp < this.MAX_HP && IS_HP_DISPLAYED) {
                draw.healthbar(ctx, this.x, this.y - 6, this.hp / this.MAX_HP);
            }
            /*
            if (this.tile_hover) {
                draw.text(ctx, this.x, this.y, this.tile_hover.name, [255, 0, 255]);
            }
             */

        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }

    }

}
