function set_dims() {
    const canvas = document.getElementById("canvas"),
        pos_info = canvas.getBoundingClientRect(),
        w = canvas.width = pos_info.width,
        h = canvas.height = pos_info.height;
    return [w, h];
}

const BATTLE = {
    // default templates
    OPPOSITE_AGGRESSIVE: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g1 = unit_group.make_gaussian(CloneTrooper, n1, w * .25, 300,
                h * .25, 300, AI.aggressive),
            g2 = unit_group.make_gaussian(B1Battledroid, n2, w * .75, w * .75 + 50,
                h * .75, h * .75 + 50, AI.aggressive),
            // now concat to form units
            units = g1.concat(g2);
        return battle(ctx, units, [], field);
    },
    ATTACKER_DEFENDER: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g1 = unit_group.make_gaussian(CloneTrooper, n1, w * .2, w * .2 + 100,
                h * .2, w * .2 + 100, AI.stand),
            g2 = unit_group.make_gaussian(B1Battledroid, n2, w * .8, w * .8 + 25,
                h * .8, h * .8 + 50, AI.aggressive),
            units = g1.concat(g2);
        return battle(ctx, units,[], field);
    },
    SNIPERS_NEST: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g1 = unit_group.make_gaussian(CloneTrooper, 20, w * .3, w * .3 + 50,
                h * .3, 150, AI.stand),
            g2 = unit_group.make_gaussian(B1Battledroid, 50, w * .9, w * .9 + 25,
                h * .8, 300, AI.aggressive),
            g3 = unit_group.make_uniform(CloneSharpshooter, 4, 150, 170,
                20, 40, AI.aggressive),
            units = g1.concat(g2, g3);
        return battle(ctx, units,[], field);
    },
    JEDI_DEFENDERS: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g2 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g3 = unit_group.make_uniform(Jedi, 10, 30, 150,
                20, 150, AI.aggressive),
            g4 = unit_group.make_uniform(B2Battledroid, 10, w * .8, w * .8 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            units = g2.concat(g3, g4);
        return battle(ctx, units,[], field);
    },
    GUERRILLA_WARFARE: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g2 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g3 = unit_group.make_uniform(CloneTrooper, 15, 30, 150,
                20, 150, AI.hit_and_run),
            g4 = unit_group.make_uniform(CloneTrooper, 15, w * .8, w * .8 + 50,
                h * .8, h * .8 + 50, AI.hit_and_run),
            g5 = unit_group.make_uniform(CloneSharpshooter, 2, w * .7, w * .8 + 50,
                h * .8, h * .8 + 50, AI.aggressive),
            g6 = unit_group.make_uniform(B2Battledroid, 10, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            units = g2.concat(g3, g4, g5, g6);
        return battle(ctx, units, [], field);
    },
    TOWER_DEFENCE: function(ctx, n1, n2) {
        let [w, h] = set_dims(),
            field = Field(w, h),
            g1 = unit_group.make_gaussian(B1Battledroid, 50, w * .5, w * .5 + 50,
                h * .5, h * .5 + 50, AI.aggressive),
            g2 = unit_group.make_uniform(CloneTrooper, 15, 30, 150,
                20, 150, AI.hit_and_run),
            units = g1.concat(g2),
            t1 = new Turret(0, 30, 30, 500, 5., 100., "Republic", 0.06),
            t2 = new Turret(1, 70, 30, 500, 5., 100., "Republic", 0.06),
            t3 = new Turret(2, 30, 70, 500, 5., 100., "Republic", 0.06),
            t4 = new Turret(3, 70, 70, 500, 5., 100., "Republic", 0.06),
            t5 = new Turret(3, w * .4, h * .4, 500, 5., 100., "Republic", 0.06),
            turrets = [t1, t2, t3, t4, t5];
        return battle(ctx, units, turrets, field);
    }
}