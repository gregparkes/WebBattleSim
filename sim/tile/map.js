
const TileLevel = (width, height, stack, scale, seed,
                   octaves, persistance, lacunarity) => ({
    /* Divides the canvas into xn * yn tiles.
     */
    width: width,
    height: height,
    scale: scale,
    seed: seed,
    octaves: octaves,
    persistance: persistance / 10.0,
    lacunarity: lacunarity / 10.0,
    terrain: stack,
    pixels: null,
    image: null,
    imgData: null,
    tiled: false,
    xtiles: 0,
    ytiles: 0,
    // a TILESTACK.* option.

    create_simple1: function(ctx) {
        // create imagebuffer here, not to calculate every render step
        this.image = ctx.createImageData(this.width, this.height);
        this.imgData = this.image.data;

        // normalize to [0..1] by keeping track of min and max.
        let xoff = (this.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : this.seed,
            yoff = (this.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : this.seed;

        // copy pixels over to DATA
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                let i_data = (this.width * y + x) * 4,
                    sx = x / this.width * this.scale + xoff,
                    sy = y / this.height * this.scale + yoff,
                    p = PerlinNoise(sx, sy, 0.8);

                let nrgb = this.get_stack_level(p, this.terrain);

                // data is of size w*h*4, representing rgba_1, rgba_2, ..., rgba_w*h
                // rgb channels
                this.imgData[i_data] = nrgb[0];
                this.imgData[i_data+1] = nrgb[1];
                this.imgData[i_data+2] = nrgb[2];
                // alpha channel
                this.imgData[i_data+3] = 255;
            }
        }

    },

    create_simple2: function(ctx) {
        // create imagebuffer here, not to calculate every render step
        this.image = ctx.createImageData(this.width, this.height);
        this.imgData = this.image.data;

        // declare pixel array for perlins
        this.construct_pixel_array(this.width, this.height);

        // go through and assign to imgData
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                let nrgb = this.get_stack_level(this.pixels[y*this.width + x]),
                    i = (this.width * y + x) * 4;
                // set RGBA
                this.imgData[i] = nrgb[0];
                this.imgData[i+1] = nrgb[1];
                this.imgData[i+2] = nrgb[2];
                this.imgData[i+3] = 255;
            }
        }

    },

    create_tiles: function(ctx, square) {
        /* Create a small subsection of xtiles*ytiles and draw as fillrects, significantly more efficient */
        this.tiled = true;
        this.xtiles = Math.floor(this.width / square);
        this.ytiles = Math.floor(this.height / square);
        // construct a pixel array where each pixel refers to a TILE color rather than the full canvas.
        this.construct_pixel_array(this.xtiles, this.ytiles);
    },

    construct_pixel_array: function(w, h) {
        this.pixels = new Float32Array(w*h);

        let xoff = (this.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : this.seed,
            yoff = (this.seed === Number.MAX_VALUE) ? utils.randomInt(-100000,100000) : -this.seed,
            pix_min = Number.MAX_VALUE,
            pix_max = Number.MIN_VALUE,
            halfW = w / 2,
            halfH = h / 2;

        // copy pixels over to DATA
        for (let y = 0; y < h; y ++) {
            for (let x = 0; x < w; x ++) {
                let amplitude = 1.0,
                    freq = 1.0,
                    noiseHeight = 0.0;

                for (let i = 0; i < octaves; i ++) {
                    let sx = (((x - halfW) / w) * this.scale * freq) + xoff,
                        sy = (((y - halfH) / h) * this.scale * freq) + yoff,
                        p = PerlinNoise(sx, sy, 0.8);

                    noiseHeight += p * amplitude;
                    amplitude *= persistance;
                    freq *= lacunarity;
                }

                if (noiseHeight < pix_min) {
                    pix_min = noiseHeight;
                } else if (noiseHeight > pix_max) {
                    pix_max = noiseHeight;
                }

                this.pixels[y*w + x] = noiseHeight;
            }
        }

        // normalize pixels
        // normalize using min-max scaling
        for (let i = 0; i < this.pixels.length; i++) {
            this.pixels[i] = utils.minmax(this.pixels[i], pix_min, pix_max);
        }
        // now the pixel array should be ready in the range [0..1]
    },

    get_stack_level: function(p) {
        if (this.terrain === null) {
            return [Math.floor(p*255), Math.floor(p*255), Math.floor(p*255)];
        } else {
            for (let i = 0; i < this.terrain.length - 1; i++) {
                if (p < (this.terrain[i].r)) {
                    return this.terrain[i].color;
                }
            }
            // check if its the last level also
            return this.terrain[this.terrain.length - 1].color;
        }
    },

    render: function(ctx) {
        // swap the buffer
        if (this.tiled) {
            let xs = this.width / this.xtiles,
                ys = this.height / this.ytiles;
            // draw tiles as an array of rects
            for (let y = 0; y < this.ytiles; y++) {
                for (let x = 0; x < this.xtiles; x++) {
                    ctx.fillStyle = "rgb({0},{1},{2})".format(this.get_stack_level(this.pixels[y*this.xtiles+x]));
                    ctx.fillRect(x*xs,y*ys,xs,ys);
                }
            }

        } else {
            if (this.image !== null) ctx.putImageData(this.image, 0, 0);
        }
    }
})

