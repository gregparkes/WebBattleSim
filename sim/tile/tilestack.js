/* This script defines some pre-calculated stacks to determine interesting
terrains.
 */

const TILESTACK = {
    Grassland: [
        {r: 0.4, color: [0, 102, 255]},
        {r: 1.0, color: [51, 153, 51]}
    ],
    Tundra: [
        {r: 0.2, color: [0, 255, 255]},
        {r: 0.65, color: [204, 238, 255]},
        {r: 1.0, color: [250, 250, 250]}
    ],
    Desert: [
        {r: 0.3, color: [255, 102, 0]},
        {r: 0.5, color: [230, 115, 0]},
        {r: 0.75, color: [255, 195, 77]},
        {r: 1.0, color: [255, 230, 179]}
    ],
}