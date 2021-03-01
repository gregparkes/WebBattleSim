class B1Battledroid extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.B1Battledroid.ATTACK,
            UNIT.B1Battledroid.DEX, UNIT.B1Battledroid.CON,
            UNIT.B1Battledroid.MVS, UNIT.B1Battledroid.RANGE,
            UNIT.B1Battledroid.TEAM,UNIT.B1Battledroid.FIRERATE,
            UNIT.B1Battledroid.DEFLECT, ai);
    }
}

class B2Battledroid extends Unit {

    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.B2Battledroid.ATTACK,
            UNIT.B2Battledroid.DEX, UNIT.B2Battledroid.CON,
            UNIT.B2Battledroid.MVS, UNIT.B2Battledroid.RANGE,
            UNIT.B2Battledroid.TEAM, UNIT.B2Battledroid.FIRERATE,
            UNIT.B2Battledroid.DEFLECT, ai);
        this.sizebot = 13;
        this.sizelen = 18;
    }

}

class CloneTrooper extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.CloneTrooper.ATTACK,
            UNIT.CloneTrooper.DEX, UNIT.CloneTrooper.CON,
            UNIT.CloneTrooper.MVS, UNIT.CloneTrooper.RANGE,
            UNIT.CloneTrooper.TEAM, UNIT.CloneTrooper.FIRERATE,
            UNIT.CloneTrooper.DEFLECT, ai);
    }
}