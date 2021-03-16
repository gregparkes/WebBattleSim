
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

    constructor(ctx, width, height) {
        super(ctx, width, height);
    }

    create(perlin, terrain) {
        /* Creates the perlin level.
        *
        * Perlin: {seed, scale, octaves, persistance, lacunarity}
        * terrain must be an instance of Tile_layer.*
        * */
        this.make_image_array(this.w, this.h, perlin);

        // go through and assign to imgData
        for (let y = 0; y < this.h; y ++) {
            for (let x = 0; x < this.w; x ++) {
                let i = (y*this.w) + x,
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

    make_image_array(nw, nh, perlin) {

        this.pixels = new Float32Array(nw*nh);

        let xoff = (perlin.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : -perlin.seed,
            yoff = (perlin.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : -perlin.seed,
            pix_min = Number.MAX_VALUE,
            pix_max = Number.MIN_VALUE,
            halfW = nw / 2,
            halfH = nh / 2;

        // copy pixels over to DATA
        for (let y = 0; y < nh; y ++) {
            for (let x = 0; x < nw; x ++) {
                let amplitude = 1.0,
                    freq = 1.0,
                    noiseHeight = 0.0;

                for (let i = 0; i < perlin.octaves; i ++) {
                    let sx = (((x - halfW) / nw) * perlin.scale * freq) + xoff,
                        sy = (((y - halfH) / nh) * perlin.scale * freq) + yoff,
                        p = PerlinNoise(sx, sy, 0.8);

                    noiseHeight += p * amplitude;
                    amplitude *= perlin.persistance;
                    freq *= perlin.lacunarity;
                }

                if (noiseHeight < pix_min) {
                    pix_min = noiseHeight;
                } else if (noiseHeight > pix_max) {
                    pix_max = noiseHeight;
                }

                this.pixels[y*nw + x] = noiseHeight;
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

}

class TilePerlinLevel extends PerlinLevel {

    constructor(ctx, width, height, tile_size) {
        /* Creates a perlin map which is tiled, more computationally efficient and basis for making nodes. */
        super(ctx, width, height);
        this.size = tile_size;
        // set number of x tiles and y tiles
        this.xtiles = Math.floor(width / tile_size) + 1;
        this.ytiles = Math.floor(height / tile_size) + 1;
    }

    create(perlin, terrain) {
        /* Creates the perlin tile level.
        *
        * Perlin: {seed, scale, octaves, persistance, lacunarity}
        * terrain must be an instance of Tile_layer.*
        * */
        this.make_image_array(this.xtiles, this.ytiles, perlin);

        // draw tiles from xtiles - 1, ytiles - 1
        this._draw_tile_array(this.xtiles - 1, this.ytiles - 1, this.size, this.size, terrain);

        /* distance remaining to fill in for a tile */
        let x_dist = this.w - ((this.xtiles - 1) * this.size),
            y_dist = this.h - ((this.ytiles - 1) * this.size);

        // draw along the bottom.
        for (let xt = 0; xt < this.xtiles-1; xt ++) {
            let yt = this.ytiles - 1,
                nrgb = this.get_terrain_colour(this.pixels[yt*(this.xtiles) + xt], terrain),
                i = (yt*this.w*this.size) + xt*this.size;
            this._draw_inner_image(i, nrgb, this.size, y_dist);
        }
        //draw along the right
        for (let yt = 0; yt < this.ytiles-1; yt ++) {
            let xt = this.xtiles - 1,
                nrgb = this.get_terrain_colour(this.pixels[yt*(this.xtiles) + xt], terrain),
                i = (yt*this.w*this.size) + xt*this.size;

            this._draw_inner_image(i, nrgb, x_dist, this.size);
        }
        // draw bottom-right square.
        let k = (((this.ytiles - 1) * this.w * this.size)) + ((this.xtiles - 1) * this.size),
            nrgb = this.get_terrain_colour(this.pixels[(this.ytiles - 1)*(this.xtiles) + (this.xtiles - 1)], terrain);
        this._draw_inner_image(k, nrgb, x_dist, y_dist);
    }

    tileAt(x, y, terrain) {
        /* Returns the tile type at pixel (x, y) */
        return this.getTile(this.pixels[Math.floor(y / this.size) * this.xtiles + Math.floor(x / this.size)], terrain);
    }

    getTile(value, terrain = null) {
        /* assumes this.pixels is full, converts 'value' to RGB array */
        for (let i = 0; i < terrain.tiles.length - 1; i++) {
            if (value < (terrain.weights[i])) {
                return terrain.tiles[i];
            }
        }
        // check if its the last level also
        return terrain.tiles[terrain.tiles.length - 1];
    }

    _draw_tile_array(xtiles, ytiles, xsize, ysize, terrain) {

        for (let yt = 0; yt < ytiles; yt ++) {
            for (let xt = 0; xt < xtiles; xt ++) {
                let nrgb = this.get_terrain_colour(this.pixels[yt*this.xtiles + xt], terrain),
                    i = (yt*this.w*this.size) + xt*this.size;
                // draw tile
                this._draw_inner_image(i, nrgb, xsize, ysize);
            }
        }
    }

    _draw_inner_image(i_start, nrgb, xsize, ysize) {
        for (let y = 0; y < ysize; y ++) {
            for (let x = 0; x < xsize; x ++) {
                let j = (i_start + (y*this.w) + x) * 4;
                this.imgData[j] = nrgb[0];
                this.imgData[j+1] = nrgb[1];
                this.imgData[j+2] = nrgb[2];
                this.imgData[j+3] = 255;
            }
        }
    }

}