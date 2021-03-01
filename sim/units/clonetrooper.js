// constructor

class CloneTrooper extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.CloneTrooper.ATTACK,
            UNIT.CloneTrooper.DEX, UNIT.CloneTrooper.CON,
            UNIT.CloneTrooper.MVS, UNIT.CloneTrooper.RANGE,
            UNIT.CloneTrooper.TEAM, UNIT.CloneTrooper.FIRERATE,
            UNIT.CloneTrooper.DEFLECT, ai);
    }
}
