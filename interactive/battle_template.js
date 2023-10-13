
const BATTLE_TEMPLATE = {
    // default templates
    OPPOSITE_AGGRESSIVE: function(canvas, level) {
        let g1 = unit_group.random_tile_spawn(CloneTrooper, 2, level, AI.aggressive),
            g2 = unit_group.random_tile_spawn(B1Battledroid, 4, level, AI.aggressive),
            // now concat to form units
            units = g1.concat(g2);
        return battle(canvas, units, level);
    },
    SNIPERS_NEST: function(canvas, level) {
        let g1 = unit_group.random_tile_group_spawn(CloneTrooper, 15, level, AI.stand),
            g2 = unit_group.random_tile_spawn(B1Battledroid, 50, level, AI.aggressive),
            g3 = unit_group.random_tile_group_spawn(CloneSharpshooter, 4, level, AI.aggressive),
            units = g1.concat(g2, g3);
        return battle(canvas, units, level);
    },
    OVERWHELMING_ODDS: function(canvas, level) {
        let w = canvas.width,
            h = canvas.height;
        let clones = unit_group.random_tile_group_spawn(CloneTrooper, 25, level, AI.aggressive),
            droids = unit_group.random_tile_group_spawn(B1Battledroid, 5, level, AI.aggressive),
            jedi = unit_group.random_tile_spawn(Jedi, 2, level, AI.aggressive),
            droid_spawner = [new RandomTileSpawner(UNIT.B1Battledroid, 0.03)],
            objs = clones.concat(droids, jedi, droid_spawner);
        return battle(canvas, objs, level);
    },
}