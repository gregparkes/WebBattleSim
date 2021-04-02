const ai_init_target = {
    // assigns all units an enemy from initialization.
    random: function(a, b) {
        // where a, b is a list of enemies opposing.
        // assign a random b to each a, and vice versa.
        let L_a = a.length,
            L_b = b.length;
        for (let i = 0; i < L_a; i++) {
            a[i].target = b[utils.randomInt(0, L_b - 1)];
        }
        for (let i = 0; i < L_b; i++) {
            b[i].target = a[utils.randomInt(0, L_a - 1)];
        }
    },

    _nearest_subgroup: function(a, b) {
        let L_a = a.length,
            L_b = b.length;

        for (let i = 0; i < L_a; i++) {
            let best_distance = Infinity,
                best_index = 0;
            for (let j = 0; j < L_b; j++) {
                let d = utils.sqDistanceXY(a.x, a.y, b.x, b.y);
                if (d < best_distance) {
                    best_distance = d;
                    best_index = j;
                }
            }
            a[i].target = b[best_index];
        }
    },

    nearest: function(a, b) {
        // where a, b is a list of enemies opposing.
        // assign each a to the closest b, and vice versa
        ai_init_target._nearest_subgroup(a, b);
        // repeat for b
        ai_init_target._nearest_subgroup(b, a);
    }
};

const ai_next_target = {
    // assigns a new enemy for a particular unit u.

    random: function(u, md) {
        let enemy = md.get_enemies(u.team),
            L_enemy = enemy.length;

        if (L_enemy > 1) {
            return enemy[utils.randomInt(0, L_enemy - 1)];
        } else if (L_enemy === 1) {
            return enemy[0];
        } else {
            return null;
        }
    },

    nearest: function(u, md) {
        let enemy = md.get_enemies(u.team),
            enemy_L = enemy.length;
        if (enemy_L > 1) {
            // calculate distances
            let dst = enemy.map(v => utils.sqDistance(v, u));
            // now retrieve the argmin of the distance array, this is the enemy.
            return enemy[utils.argmin(dst)];
        } else if (enemy_L === 1) {
            return enemy[0];
        } else {
            return null;
        }
    },

};

const AI = {
    // determines the choices a unit should be making

    /* Assumes target is alive */
    _aggressive_pursue: function(u, md) {
        // attack if in range, else move towards
        if (u.isTargetInRange()) {
            // AI does it's main attack - whether melee or attack
            u.attack(md);
        } else {
            // AI moves towards its opponent
            u.move(md);
        }
    },

    // the public AI types: aggressive, hit and run, stand (ground)

    aggressive: function(u, md, next_target=ai_next_target.nearest) {
        // an aggressive AI stance to pursue enemies and attack
        // occasionally pick a new target#
        if (Math.random() > 0.01 && u.isTargetAlive()) {
            AI._aggressive_pursue(u, md);
        } else {
            u.target = next_target(u, md)
            // update A* here if necessary
            if (md.parameters.UNIT_MOVE_MODE === "astar") {
                u.update_astar(md);
            }
        }
    },

    hit_and_run: function(u, md, next_target=ai_next_target.nearest) {
        // a hit-and-run style which relies on faster speed and longer range
        if (Math.random() > 0.01 && u.isTargetAlive()) {
            if ((u.speed > u.target.speed) && (u.range > u.target.range)) {
                // we can use hit and run
                if (u._dist > u.range) {
                    // if we're not in range, move closer.
                    u.move(md);
                } else if (u._dist <= u.target.range) {
                    // if the opponent is in range, move back.
                    u.move(md, -1.0);
                } else {
                    // otherwise attack
                    u.attack(md);
                }
            } else {
                AI._aggressive_pursue(u, md);
            }
        } else {
            u.target = next_target(u, md)
        }
    },

    stand: function(u, md, next_target=ai_next_target.nearest) {
        // check nearest target
        if (u.isTargetAlive() && u.isTargetInRange()) {
            u.attack(md);
        }
        // perform check and update next closest target every 5 frames or so
        if (md.t % 5 === 0) {
            u.target = next_target(u, md)
        }
    },

};