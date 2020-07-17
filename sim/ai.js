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
            let best_distance = 1500.0,
                best_index = 0;
            for (let j = 0; j < L_b; j++) {
                let d = utils.distanceXY(a.x, a.y, b.x, b.y);
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

        if (enemy_L > 0) {
            // calculate distance from each enemy.
            let closest_dist = 1500.0,
                closest_index = 0;
            for (let i = 0; i < enemy_L; i++) {
                let d = utils.distanceXY(u.x, u.y, enemy[i].x, enemy[i].y);
                if (d < closest_dist) {
                    closest_dist = d;
                    closest_index = i;
                }
            }
            return enemy[closest_index];
        } else if (enemy_L === 1) {
            return enemy[0];
        } else {
            return null;
        }
    },

    nearest_notarget: function(u, md) {
        // chooses the nearest enemy with nobody else targeting them.
        let enemy = md.get_enemies(u.team),
            enemy_L = enemy.length,
            ally = md.get_allies(u.team),
            ally_L = ally.length;

        if (ally_L <= 0) {
            return ai_next_target.nearest(u, md);
        } else {
            if (enemy_L > 1) {
                // calculate distance from each enemy.
                let closest_dist = 1500.0,
                    closest_index = 0;
                for (let i = 0; i < enemy_L; i++) {
                    // filter out enemy units that are already targeted
                    let d = utils.distanceXY(u.x, u.y, enemy[i].x, enemy[i].y),
                        is_targeted = ally.filter(a => u.target === a.target);
                    // if is_targeted > 0, we pass
                    if (is_targeted.length === 0 && d < closest_dist) {
                        closest_dist = d;
                        closest_index = i;
                    }
                }
                return enemy[closest_index];
            } else if (enemy_L === 1) {
                return enemy[0];
            } else {
                return null;
            }
        }
    }

};

const AI = {
    // determines the choices a unit should be making

    _aggressive_pursue: function(u, md) {
        // attack if in range, else move towards
        if (u.isTargetInRange()) {
            // AI does it's main attack - whether melee or attack
            u.attack(md);
        } else {
            // AI moves towards its opponent
            u.move(md, true);
        }
    },

    // the public AI types: aggressive, hit and run, stand (ground)

    aggressive: function(u, md, next_target=ai_next_target.nearest) {
        // an aggressive AI stance to pursue enemies and attack
        // occasionally pick a new target#
        if (Math.random() >= 0.01 && u.isTargetAlive()) {
            AI._aggressive_pursue(u, md);
        } else {
            u.target = next_target(u, md)
        }
    },

    hit_and_run: function(u, md, next_target=ai_next_target.nearest) {
        // a hit-and-run style which relies on faster speed and longer range
        if (Math.random() >= 0.01 && u.isTargetAlive()) {
            if ((u.mvs > u.target.mvs) && (u.range > u.target.range)) {
                // we can use hit and run
                if (u._dist > u.range) {
                    // if we're not in range, move closer.
                    u.move(md, true);
                } else if (u._dist <= u.target.range) {
                    // if the opponent is in range, move back.
                    u.move(md, false);
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
        // perform check every 5 frames or so
        if (md.t % 5 === 0) {
            u.target = next_target(u, md)
        }
    },

    defensive: function(u, md) {

    }

};