const unit_group = {

    make_gaussian: function(unit, n, xmean, xstd, ymean, ystd,
                            ai_type=AI.aggressive) {
        let x = utils.gaussianArray(n, xmean, xstd),
            y = utils.gaussianArray(n, ymean, ystd),
            s = [];

        for (let i = 0; i < n; i++) {
            //let u = unit(x[i], y[i]);
            let u = new unit(i, x[i], y[i], ai_type);
            // u.ai = ai_type;
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
            // let u = unit(x[i], y[i]);
            let u = new unit(i, x[i], y[i], ai_type);
            // u.ai = ai_type;
            s.push(u);
        }
        return s;
    },
};