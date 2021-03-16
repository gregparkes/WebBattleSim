
const TILE_LAYER = {
    Grassland: {
        tiles: [TILE.SEA, TILE.WATER, TILE.SAND, TILE.GRASS_LIGHT, TILE.GRASS_DARK],
        weights: [0.3, 0.35, 0.4, 0.5, 1.0]
    },
    Tundra: {
        tiles: [TILE.ICY_WATER, Tile("ice2", [0, 255, 255], true),
            Tile("ice3", [204, 238, 255], true), Tile("ice4", [250, 250, 250], true)],
        weights: [0.2, 0.35, 0.5, 1.0]
    },
    Desert: {
        tiles: TILE.color_array([255, 102, 0], [230, 115, 0], [255, 195, 77], [255, 230, 179]),
        weights: [0.3, 0.5, 0.75, 1.0]
    },
    Alien: {
        tiles: TILE.color_array([153, 0, 153], [198, 83, 198],[179, 128, 255], [179, 198, 255]),
        weights: [0.2, 0.5, 0.8, 1.0]
    },
}

