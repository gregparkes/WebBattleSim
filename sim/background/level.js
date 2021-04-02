
class Level {

    constructor(ctx, width, height) {
        // where width and height are the size of the canvas.
        this.w = width;
        this.h = height;

        // define an image and imageData handle
        this.image = ctx.createImageData(width, height);
        this.imgData = this.image.data;
        // define a 'pixel' array - this will hold the 'heightmap' value at each pixel, or tile.
        this.pixels = null;
    }

    render(ctx) {
        if (this.image !== null) ctx.putImageData(this.image, 0, 0);
    }

}

class PerlinLevel extends Level {

    constructor(ctx, width, height, perlin) {
        super(ctx, width, height);
        this.perlin = perlin;
        this.seed = 0;
        // save a copy of seed
    }

    create(terrain) {
        /* Creates the perlin level.
        *
        * Perlin: {seed, scale, octaves, persistance, lacunarity}
        * terrain must be an instance of Tile_layer.*
        * */
        this.make_image_array(this.w, this.h);

        // go through and assign to imgData
        for (let y = 0; y < this.h; y ++) {
            let off = y*this.w;
            for (let x = 0; x < this.w; x ++) {
                let i = off + x,
                    j = i * 4,
                    nrgb = this.get_terrain_colour(this.pixels[i], terrain);
                // set RGBA
                this.imgData[j] = nrgb[0];
                this.imgData[j+1] = nrgb[1];
                this.imgData[j+2] = nrgb[2];
                this.imgData[j+3] = 255;
            }
        }
    }

    make_image_array(nw, nh) {

        this.pixels = new Float32Array(nw*nh);
        // recalculate seed values.
        this.seed = (this.perlin.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : -this.perlin.seed;

        let pix_min = Number.MAX_VALUE,
            pix_max = Number.MIN_VALUE,
            halfW = nw / 2,
            halfH = nh / 2;

        // copy pixels over to DATA
        for (let y = 0; y < nh; y ++) {
            let offs = y*nw;
            for (let x = 0; x < nw; x ++) {
                let amplitude = 1.0,
                    freq = 1.0,
                    noiseHeight = 0.0;

                for (let i = 0; i < this.perlin.octaves; i ++) {
                    let sx = (((x - halfW) / nw) * this.perlin.scale * freq) + this.seed,
                        sy = (((y - halfH) / nh) * this.perlin.scale * freq) + this.seed,
                        p = PerlinNoise(sx, sy, 0.8);

                    noiseHeight += p * amplitude;
                    amplitude *= this.perlin.persistance;
                    freq *= this.perlin.lacunarity;
                }

                if (noiseHeight < pix_min) {
                    pix_min = noiseHeight;
                } else if (noiseHeight > pix_max) {
                    pix_max = noiseHeight;
                }

                this.pixels[offs + x] = noiseHeight;
            }
        }

        // normalize pixels
        // normalize using min-max scaling
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i] = utils.minmax(this.pixels[i], pix_min, pix_max);
        }
    }

    get_terrain_colour(value, terrain = null) {
        /* assumes this.pixels is full, converts 'value' to RGB array */
        if (terrain === null) {
            return utils.rgb_greyscale(value);
        } else {
            for (let i = 0; i < terrain.tiles.length - 1; i++) {
                if (value < (terrain.weights[i])) {
                    return terrain.tiles[i].color;
                }
            }
            // check if its the last level also
            return terrain.tiles[terrain.tiles.length - 1].color;
        }
    }

    render(ctx) {
        super.render(ctx);
        // add a label in the corner for the level seed.
        draw.text(ctx, 20, this.h - 20, "seed: " + this.seed, [0, 0, 0]);
    }

}

class TilePerlinLevel extends PerlinLevel {

    constructor(ctx, width, height, perlin, tile_size, layers) {
        /* Creates a perlin map which is tiled, more computationally efficient and basis for making nodes. */
        super(ctx, width, height, perlin);
        this.size = tile_size;
        this.layers = layers;
        // set number of x tiles and y tiles
        this.xtiles = Math.floor(width / tile_size) + 1;
        this.ytiles = Math.floor(height / tile_size) + 1;

        // define a graph to use Astar with
        this.graph = new Graph(this.xtiles, this.ytiles);
    }

    create() {
        /* Creates the perlin tile level.
        *
        * Perlin: {seed, scale, octaves, persistance, lacunarity}
        * terrain must be an instance of Tile_layer.*
        * */
        this.make_image_array(this.xtiles, this.ytiles);

        // draw tiles from xtiles - 1, ytiles - 1
        this._draw_tile_array(this.xtiles - 1, this.ytiles - 1, this.size, this.size);

        /* fill our Graph with node information about whether the tile is passable or not. */
        for (let yt = 0; yt < this.ytiles; yt ++) {
            let off = yt*this.xtiles;
            for (let xt = 0; xt < this.xtiles; xt ++) {
                let t = this.getTile(this.pixels[off+xt]);
                this.graph.addNode(xt, yt, t.passable ? t.mvs : 0);
            }
        }
        this.graph.init();

        /* distance remaining to fill in for a tile */
        let x_dist = this.w - ((this.xtiles - 1) * this.size),
            y_dist = this.h - ((this.ytiles - 1) * this.size);

        // draw along the bottom.
        for (let xt = 0; xt < this.xtiles-1; xt ++) {
            let yt = this.ytiles - 1,
                nrgb = this.get_terrain_colour(this.pixels[yt*(this.xtiles) + xt], this.layers),
                i = (yt*this.w*this.size) + xt*this.size;
            this._draw_inner_image(i, nrgb, this.size, y_dist);
        }
        //draw along the right
        for (let yt = 0; yt < this.ytiles-1; yt ++) {
            let xt = this.xtiles - 1,
                nrgb = this.get_terrain_colour(this.pixels[yt*(this.xtiles) + xt], this.layers),
                i = (yt*this.w*this.size) + xt*this.size;

            this._draw_inner_image(i, nrgb, x_dist, this.size);
        }
        // draw bottom-right square.
        let k = (((this.ytiles - 1) * this.w * this.size)) + ((this.xtiles - 1) * this.size),
            nrgb = this.get_terrain_colour(this.pixels[(this.ytiles - 1)*(this.xtiles) + (this.xtiles - 1)], this.layers);
        this._draw_inner_image(k, nrgb, x_dist, y_dist);
    }

    /**
     * Gets the tile using the pixel coordinates.
     * @param x : number
     * @param y : number
     * @returns {Tile|*}
     */
    tileAt(x, y) {
        let tx = Math.floor(x / this.size),
            ty = Math.floor(y / this.size);
        /* Returns the tile type at pixel (x, y) */
        return this.getTile(this.pixels[ty*this.xtiles + tx]);
    }

    tileFromGridNode(node) {
        return this.getTile(this.pixels[node.y*this.xtiles + node.x]);
    }

    tileCoord(tx, ty) {
        return this.getTile(this.pixels[ty*this.xtiles + tx]);
    }

    getGridNode(x, y) {
        let tx = Math.floor(x / this.size),
            ty = Math.floor(y / this.size);
        return this.graph.grid[ty*this.xtiles + tx];
    }

    /**
     * Fetches the correct tile corresponding to it's given weight.
     * @param value : float
     *  The weight value corresponding to the height map.
     * @returns {{color: *, passable: *, name: *}|*}
     */
    getTile(value) {
        let terrain = this.layers,
            t = terrain.tiles,
            l = t.length;
        /* assumes this.pixels is full, converts 'value' to RGB array */
        for (let i = 0; i < l - 1; i++) {
            if (value < (terrain.weights[i])) {
                return t[i];
            }
        }
        // check if its the last level also
        return t[l - 1];
    }

    /** Randomly selects a passable tile from the level. */
    getRandomPassableTile() {
        let xt = 0,
            yt = 0,
            tile = null;

        do {
            xt = utils.randomInt(0, this.xtiles-1);
            yt = utils.randomInt(0, this.ytiles-1);
            tile = this.tileCoord(xt, yt);
        } while (!tile.passable);

        return [xt, yt, tile];
    }

    _draw_tile_array(xtiles, ytiles, xsize, ysize) {

        for (let yt = 0; yt < ytiles; yt ++) {
            let offt = yt*this.xtiles,
                offp = yt*this.w*this.size;
            for (let xt = 0; xt < xtiles; xt ++) {
                let nrgb = this.get_terrain_colour(this.pixels[offt + xt], this.layers),
                    i = offp + xt*this.size;
                // draw tile
                this._draw_inner_image(i, nrgb, xsize, ysize);
            }
        }
    }

    _draw_inner_image(i_start, nrgb, xsize, ysize) {
        for (let y = 0; y < ysize; y ++) {
            let off = y*this.w;
            for (let x = 0; x < xsize; x ++) {
                let j = (i_start + off + x) * 4;
                this.imgData[j] = nrgb[0];
                this.imgData[j+1] = nrgb[1];
                this.imgData[j+2] = nrgb[2];
                this.imgData[j+3] = 255;
            }
        }
    }

}