/* This script defines some pre-calculated stacks to determine interesting
terrains.
 */

/* A tile factory object */
const Tile = (name, r, color) => ({
    name: name,
    r: r,
    color: color,
})

/* Static pre-defined tile values */
const TILE = {
    WATER: Tile("water", 0.35, [0, 102, 255]),
    SAND: Tile("sand", 0.4, [255, 255, 102]),
    GRASS_LIGHT: Tile("grass_light", 0.5, [51, 153, 51]),
    GRASS_DARK: Tile("grass_dark", 1.0, [0, 102, 0]),
}


const TILESTACK = {
    Grassland: [
        TILE.WATER, TILE.SAND, TILE.GRASS_LIGHT, TILE.GRASS_DARK
    ],
    Tundra: [
        {r: 0.2, color: [51, 204, 255]},
        {r: 0.35, color: [0, 255, 255]},
        {r: 0.5, color: [204, 238, 255]},
        {r: 1.0, color: [250, 250, 250]}
    ],
    Desert: [
        {r: 0.3, color: [255, 102, 0]},
        {r: 0.5, color: [230, 115, 0]},
        {r: 0.75, color: [255, 195, 77]},
        {r: 1.0, color: [255, 230, 179]}
    ],
    Alien: [
        {r: 0.2, color: [153, 0, 153]},
        {r: 0.5, color: [198, 83, 198]},
        {r: 0.8, color: [179, 128, 255]},
        {r: 1.0, color: [179, 198, 255]}
    ],
}

