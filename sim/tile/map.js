
const TileLevel = (width, height) => ({
    /* Divides the canvas into xn * yn tiles.
     */
    width: width,
    height: height,
    image: null,
    imgData: null,

    create: function(ctx) {
        // create imagebuffer here, not to calculate every render step
        this.image = ctx.createImageData(this.width, this.height);
        this.imgData = this.image.data;

        // copy pixels over to DATA
        for (let y = 0; y < this.height; y ++) {
            for (let x = 0; x < this.width; x ++) {
                let i_data = (this.width * y + x) * 4,
                    p = utils.perlin(x, y, this.width, this.height, 3);

                // data is of size w*h*4, representing rgba_1, rgba_2, ..., rgba_w*h
                // rgb channels
                this.imgData[i_data] = p*255;
                this.imgData[i_data+1] = p*255;
                this.imgData[i_data+2] = p*255;
                // alpha channel
                this.imgData[i_data+3] = 255;
            }
        }

    },

    render: function(ctx) {
        // swap the buffer
        if (this.image !== null) ctx.putImageData(this.image, 0, 0);

    }
})

