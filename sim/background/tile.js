/**
 * A tile factory for generating tiles.
 * @param name : string
 * @param color : Array
 * @param passable : boolean
 * @param mvs : number - Movement speed allowed on tile.
 * @returns {{color, passable, name}}
 * @constructor
 */
const Tile = (name, color, passable, mvs = 1.0) => ({
    name: name,
    color: color,
    passable: passable,
    mvs: mvs
})

// Now we have some pre-defined tiles.

const TILE = {

    SEA: Tile("sea", [0, 80, 240], false),
    WATER: Tile("water",  [0, 102, 255], false),
    ICY_WATER: Tile("icy_water", [51, 204, 255], false),
    SAND: Tile("sand", [255, 255, 102], true),
    GRASS_LIGHT: Tile("grass_light",  [51, 153, 51], true),
    GRASS_DARK: Tile("grass_dark",  [0, 102, 0], true),

    /* A method for generating lists of default boring Tiles with different colors */
    color_array: function(...colors) {
        let tiles = [];
        for (let i = 0; i < colors.length; i ++) {
            tiles.push(Tile("t" + i, colors[i], true));
        }
        return tiles;
    }
}
