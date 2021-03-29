const unit_group = {

    make_gaussian: function(unit, n, xstart, xend, ystart, yend,
                            ai_type=AI.aggressive) {
        let x = utils.gaussianArray(n, xstart, xend),
            y = utils.gaussianArray(n, ystart, yend),
            s = [];

        for (let i = 0; i < n; i++) {
            let u = new unit(x[i], y[i], ai_type);
            s.push(u);
        }
        return s;
    },

    random_spawn: function(unit, n, level, ai_type) {
        let X = [];

        for (let i = 0; i < n; i ++) {
            let x = utils.randomInt(10, level.width - 10),
                y = utils.randomInt(10, level.height - 10),
                u = new unit(x, y, ai_type);

            X.push(u);
        }
        return X;
    },

    random_tile_spawn: function(unit, n, level, ai_type) {
        let X = [];

        for (let i = 0; i < n; i ++) {

            let [xt, yt, tile] = level.getRandomPassableTile();
            let u = new unit(xt*level.size + 5 + Math.random()*5.,
                             yt*level.size + 5 + Math.random()*5.,
                            ai_type);
            X.push(u);
        }
        return X;
    },

    random_tile_group_spawn: function(unit, n, level, ai_type) {
        // spawns units in a gaussian blob on one tile.

        let X = [],
            [xt, yt, tile] = level.getRandomPassableTile(),
            halfL = level.size / 2,
            px = xt*level.size + halfL,
            py = yt*level.size + halfL;

        for (let i = 0; i < n; i ++) {
            let gx = utils.gauss1(px-halfL, px+halfL),
                gy = utils.gauss1(py-halfL, py+halfL),
                u = new unit(gx, gy, ai_type);
            X.push(u);
         }
        return X;
    }


};