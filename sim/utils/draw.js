const draw = {
    // a library of rendering functions, given context.

    arrow: function(ctx, x, y, angle, color, bottom=8, length=13) {
        // this function draws full arrows of fixed size
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        // @ts-ignore
        ctx.fillStyle = "rgba({0}, {1}, {2}, 0.9)".format(color);

        // calculate how to draw arrow
        let _arr_len = length / 2,
            _arr_bot = bottom / 2;

        ctx.moveTo(_arr_len, 0);
        ctx.lineTo(-_arr_len, -_arr_bot);
        ctx.lineTo(-_arr_len, _arr_bot);
        ctx.lineTo(_arr_len, 0);
        ctx.fill();
        ctx.restore();
    },

    healthbar: function(ctx, x, y, hp_ratio, size=12) {
        // get the HP per pixel to draw the bar the correct length
        let hppx = Math.floor(size * hp_ratio);

        ctx.fillStyle = "#3da73d";
        ctx.fillRect(x, y, hppx, 3);
        // now draw remaining as white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x + hppx, y, size-hppx, 3);
    },

    circle: function(ctx, x, y, color, size=8) {
        ctx.beginPath();
        // @ts-ignore
        ctx.fillStyle = "rgba({0}, {1}, {2}, 1.0)".format(color);
        ctx.arc(x, y, size, 0, Math.PI*2, false);
        ctx.fill();
    },

    crit: function(ctx, x, y) {
        /* Writes CRIT over the specific unit */
        ctx.font = "10px Arial";
        ctx.fillStyle = "rgba(255, 153, 51, 1.0)";
        ctx.fillText("CRIT", x, y);
    },

    cross: function(ctx, x, y, color, size=8) {
        // this function draws a full cross (dead) of fixed size
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        // @ts-ignore
        ctx.fillStyle = "rgba({0}, {1}, {2}, 0.2)".format(color);

        // calculate true size
        let _true_size = size / 2;

        ctx.moveTo(_true_size, 0);
        ctx.lineTo(-_true_size, 0);
        ctx.moveTo(0, _true_size);
        ctx.lineTo(0, -_true_size);
        ctx.stroke();
        ctx.restore();
    },

    cls: function(ctx, w, h) {
        // clears the battle screen
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "rgb(230, 230, 255)";
        ctx.fillRect(0, 0, w, h);
    }

};