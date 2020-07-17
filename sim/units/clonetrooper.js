// constructor

class CloneTrooper extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.CloneTrooper.HP, UNIT.CloneTrooper.DAMAGE,
            UNIT.CloneTrooper.MVS, UNIT.CloneTrooper.RANGE,
            UNIT.CloneTrooper.TEAM,UNIT.CloneTrooper.FIRERATE,
            UNIT.CloneTrooper.DEFLECT, ai);
    }
}
