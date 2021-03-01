// constants for base unit values.
const UNIT = {
    CloneTrooper: {
        NAME: "Clone Trooper", DESC: "The standard infantry of the Grand Army of the Republic.",
        TEAM: "Republic",
        ATK: 2, DEX: 3, CON: 2, MVS: 1.2, RANGE: 115.,
        FIRERATE: 0.03, DEFLECT: 0, OBJ: CloneTrooper
    },
    B1Battledroid: {
        NAME: "B1 Battledroid",
        DESC: "These droids are awfully chatty.",
        TEAM: "CIS",
        ATK: 2, DEX: 2, CON: 1, MVS: 1., RANGE: 100.,
        FIRERATE: 0.025, DEFLECT: 0, OBJ: B1Battledroid
    },
    B2Battledroid: {
        NAME: "B2 Battledroid",
        DESC: "An upgrade to the B1's.",
        TEAM: "CIS",
        ATK: 4, DEX: 2, CON: 4, MVS: .9, RANGE: 120.,
        FIRERATE: 0.03, DEFLECT: 2, OBJ: B2Battledroid
    },
    CloneSharpshooter: {
        NAME: "Clone Sharpshooter",
        DESC: "Extra-precise and long-range clones.",
        TEAM: "Republic",
        ATK: 5, DEX: 1, CON: 0, MVS: .9, RANGE: 400.,
        FIRERATE: 0.01, DEFLECT: 0, OBJ: CloneSharpshooter
    },
    Jedi: {
        NAME: "Jedi Knight",
        DESC: "Guardians of peace and justice throughout the galaxy.",
        TEAM: "Republic",
        ATK: 7, DEX: 3, CON: 6, MVS: 1.4, RANGE: 18.,
        FIRERATE: 0.5, DEFLECT: 12, OBJ: Jedi
    },
}