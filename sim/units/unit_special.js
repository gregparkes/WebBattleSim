
class B1Battledroid extends Unit {
    constructor(x, y, ai) {
        super(x, y, UNIT.B1Battledroid.ATK,
            UNIT.B1Battledroid.DEX, UNIT.B1Battledroid.CON,
            UNIT.B1Battledroid.MVS, UNIT.B1Battledroid.RANGE,
            TEAM.CIS, UNIT.B1Battledroid.FIRERATE,
            UNIT.B1Battledroid.DEFLECT, ai);
    }
}

class B2Battledroid extends Unit {

    constructor(x, y, ai) {
        super(x, y, UNIT.B2Battledroid.ATK,
            UNIT.B2Battledroid.DEX, UNIT.B2Battledroid.CON,
            UNIT.B2Battledroid.MVS, UNIT.B2Battledroid.RANGE,
            TEAM.CIS, UNIT.B2Battledroid.FIRERATE,
            UNIT.B2Battledroid.DEFLECT, ai);
        this.sizebot = 13;
        this.sizelen = 18;
    }

}

class CloneTrooper extends Unit {
    constructor(x, y, ai) {
        super(x, y, UNIT.CloneTrooper.ATK,
            UNIT.CloneTrooper.DEX, UNIT.CloneTrooper.CON,
            UNIT.CloneTrooper.MVS, UNIT.CloneTrooper.RANGE,
            TEAM.REPUBLIC, UNIT.CloneTrooper.FIRERATE,
            UNIT.CloneTrooper.DEFLECT, ai);
    }
}