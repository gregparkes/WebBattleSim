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

    make_uniform: function(unit, n, xmin, xmax, ymin, ymax,
                           ai_type=AI.aggressive) {
        let x = utils.uniformArray(n, xmin, xmax),
            y = utils.uniformArray(n, ymin, ymax),
            s = [];

        for (let i = 0; i < n; i++) {
            let u = new unit(x[i], y[i], ai_type);
            s.push(u);
        }
        return s;
    },
};