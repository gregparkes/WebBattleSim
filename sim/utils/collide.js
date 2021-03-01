const collide = {
    // different collision methods
    _distanceXY: function(p1x, p1y, p2x, p2y) {
        let dx = p2x - p1x,
            dy = p2y - p1y;
        return Math.sqrt(dx*dx + dy*dy);
    },
    _in_range: function(v, min, max) {
        return v > Math.min(min,max) && v <= Math.max(min, max);
    },
    _range_intersect: function(min0, max0, min1, max1) {
        return Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1);
    },

    point_triangle: function(point, triangle) {
        // determines whether a point is inside a triangle
        //compute vectors & dot products
        let cx = point[0], cy = point[1],
            t0 = triangle[0], t1 = triangle[1], t2 = triangle[2],
            v0x = t2[0]-t0[0], v0y = t2[1]-t0[1],
            v1x = t1[0]-t0[0], v1y = t1[1]-t0[1],
            v2x = cx-t0[0], v2y = cy-t0[1],
            dot00 = v0x*v0x + v0y*v0y,
            dot01 = v0x*v1x + v0y*v1y,
            dot02 = v0x*v2x + v0y*v2y,
            dot11 = v1x*v1x + v1y*v1y,
            dot12 = v1x*v2x + v1y*v2y

        // Compute barycentric coordinates
        let b = (dot00 * dot11 - dot01 * dot01),
            inv = b === 0 ? 0 : (1 / b),
            u = (dot11*dot02 - dot01*dot12) * inv,
            v = (dot00*dot12 - dot01*dot02) * inv;

        return u>=0 && v>=0 && (u+v < 1)
    },

    point_circle: function(point, circle, r) {
        // determines if a point is inside a circle
        if (r===0) return false;
        let dx = circle[0] - point[0],
            dy = circle[1] - point[1];
        return dx * dx + dy * dy <= r * r
    },

    point_rect: function(point, r_point, r_size) {
        return collide._in_range(point[0], r_point[0], r_point[0]+r_size[0]) &&
            collide._in_range(point[1], r_point[1], r_point[1]+r_size[1]);
    },

    line_circle: function(a, b, circle, radius, nearest=null) {
        //check to see if start or end points lie within circle
        if (collide.point_circle(a, circle, radius)) {
            if (nearest) {
                nearest[0] = a[0]
                nearest[1] = a[1]
            }
            return true
        } if (collide.point_circle(b, circle, radius)) {
            if (nearest) {
                nearest[0] = b[0]
                nearest[1] = b[1]
            }
            return true
        }

        let x1 = a[0],
            y1 = a[1],
            x2 = b[0],
            y2 = b[1],
            cx = circle[0],
            cy = circle[1];

        //vector d
        let dx = x2 - x1,
            dy = y2 - y1,
            //vector lc
            lcx = cx - x1,
            lcy = cy - y1;

        //project lc onto d, resulting in vector p
        let dLen2 = dx * dx + dy * dy, //len2 of d
            px = dx,
            py = dy;

        if (dLen2 > 0) {
            let dp = (lcx * dx + lcy * dy) / dLen2;
            px *= dp;
            py *= dp;
        }

        if (!nearest)
            nearest = [0, 0];
        nearest[0] = x1 + px;
        nearest[1] = y1 + py;

        //len2 of p
        let pLen2 = px * px + py * py;

        //check collision
        return collide.point_circle(nearest, circle, radius)
            && pLen2 <= dLen2 && (px * dx + py * dy) >= 0
    },

    triangle_circle: function(triangle, circle, radius) {
        // detects if a circle collides with or is fully inside of a triangle
        // accepts as [[350, 300], [450, 450], [350, 450]], [25, 15], 15
        if (collide.point_triangle(circle, triangle))
            return true
        if (collide.line_circle(triangle[0], triangle[1], circle, radius))
            return true
        if (collide.line_circle(triangle[1], triangle[2], circle, radius))
            return true
        if (collide.line_circle(triangle[2], triangle[0], circle, radius))
            return true
        return false;
    },

    circle_circle: function(p1x, p1y, r1, p2x, p2y, r2) {
        return collide._distanceXY(p1x, p1y, p2x, p2y) <= r1 + r2;
    },

    rect_rect: function(rp1, rs1, rp2, rs2) {
        // checks for collision between two rectangles.
        return collide._range_intersect(rp1[0], rp1[0] + rs1[0], rp2[0], rp2[0]+rs2[0]) &&
            collide._range_intersect(rp1[1], rp1[1] + rs1[1], rp2[1], rp2[0]+rs2[1]);
    },

    circle_rect: function(c_point, c_radius, r_point, r_size) {
        let dx = Math.abs(c_point[0] - r_point[0] - r_size[0] / 2),
            dy = Math.abs(c_point[1] - r_point[1] - r_size[1] / 2);
        // in this case half-circle is too far away
        if (dx > (r_size[0] / 2 + c_radius))
            return false;
        if (dy > (r_size[1] / 2 + c_radius))
            return false;
        if (dx <= (r_size[0] / 2))
            return true;
        if (dy <= (r_size[1]/2))
            return true;
        // use pythagoras theorem to deal with rect corners
        let cx = dx - r_size[0] / 2,
            cy = dy - r_size[1] / 2;
        return (cx*cx + cy*cy <= (c_radius*c_radius));
    },
};