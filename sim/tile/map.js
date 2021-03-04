
const TileLevel = (xn, yn, field) => ({
    /* Divides the canvas into xn * yn tiles.
     */

    tiles: [],
    xn: xn,
    yn: yn,
    N: (xn * yn),
    field: field,

    create: function() {
        let dx = this.field.width / this.xn,
            dy = this.field.height / this.yn;

        /*
        for (let y = 0; y < yn; y++) {
            for (let x = 0; x < xn; x++) {
                // create a perlin noise value
                let p = utils.perlin(x, y, this.field.width, this.field.height, 10);
                // this.tiles.push(new Tile(x*dx, y*dy, dx, dy, p))
            }
        }
        */

    },

    render: function(ctx) {
        /*
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].render(ctx);
        }

         */

    }
})

