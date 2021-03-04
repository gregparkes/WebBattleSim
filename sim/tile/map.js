
const TileLevel = (width, height) => ({
    /* Divides the canvas into xn * yn tiles.
     */
    width: width,
    height: height,
    image: null,
    imgData: null,
    // a TILESTACK.* option.

    create_simple1: function(ctx, stack) {
        // create imagebuffer here, not to calculate every render step
        this.image = ctx.createImageData(this.width, this.height);
        this.imgData = this.image.data;

        // copy pixels over to DATA
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                let i_data = (this.width * y + x) * 4,
                    p = utils.perlin(x, y, this.width, this.height, 10);

                let nrgb = this.get_stack_level(p, stack);

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

    get_stack_level: function(p, stack) {
        if (stack === null) {
            return [p*255, p*255, p*255];
        } else {
            for (let i = 0; i < stack.length - 1; i++) {
                if (p < stack[i].r) {
                    return stack[i].color;
                }
            }
            // check if its the last level also
            return stack[stack.length - 1].color;
        }
    },

    render: function(ctx) {
        // swap the buffer
        if (this.image !== null) ctx.putImageData(this.image, 0, 0);

    }
})

