const utils = {
    distanceXY: function(x1, y1, x2, y2) {
        let dx = x2 - x1,
            dy = y2 - y1;
        return Math.sqrt(dx*dx + dy*dy);
    },
    rotate: function(cx, cy, x, y, angle) {
        // rotate clockwise x, y around central point cx, cy by degrees angle
        let radians = (Math.PI / 180.0) * angle,
            cos = Math.cos(radians),
            sin = Math.sin(radians),
            dx = x - cx,
            dy = y - cy,
            nx = (cos * dx) + (sin * dy) + cx,
            ny = (cos * dy) - (sin * dx) + cy;
        return [nx, ny];
    },
    randomInt: function(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },
    fisher_yates: function(points) {
        // shuffles an array
        for (let i = points.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * i),
                k = points[i];

            points[i] = points[j]
            points[j] = k
        }
        return points;
    },
    norm: function(value, min, max) {
        return (value - min) / (max - min);
    },
    lerp: function(norm, min, max) {
        return (max - min) * norm + min;
    },
    map: function(value, sourceMin, sourceMax, destMin, destMax) {
        return utils.lerp(utils.norm(value, sourceMin, sourceMax), destMin, destMax);
    },
    gauss1: function(start, end) {
        let n = 10,
            rand = utils.repeatn(Math.random, n).reduce((x, y) => x + y);
        return Math.floor(start + (rand / n) * (end - start + 1)) + 1;
    },
    uniformArray: function(n, a=0, b=1) {
        // @ts-ignore
        return Array.from({length: n}, () => Math.random() * (b - a) + a);
    },
    gaussianArray: function(n, m = 0, sd  = 1) {
        let e = [];
        for (let i = 0; i < n; i++) {
            e.push(utils.gauss1(m, sd));
        }
        return e;
    },
    repeatn: function(f, n) {
        // repeat function call f, n times
        let e = [];
        for (let i = 0; i < n; i++) {
            e.push(f());
        }
        return e;
    }
};

String.prototype.format = function (args) {
    let str = this;
    // @ts-ignore
    return str.replace(String.prototype.format.regex, function(item) {
        let intVal = parseInt(item.substring(1, item.length - 1)),
            replace;
        if (intVal >= 0) {
            replace = args[intVal];
        } else if (intVal === -1) {
            replace = "{";
        } else if (intVal === -2) {
            replace = "}";
        } else {
            replace = "";
        }
        return replace;
    });
};

String.prototype.format.regex = new RegExp("{-?[0-9]+}", "g");
