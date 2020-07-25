// constructor

class B1Battledroid extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.B1Battledroid.ATTACK,
            UNIT.B1Battledroid.DEX, UNIT.B1Battledroid.CON,
            UNIT.B1Battledroid.MVS, UNIT.B1Battledroid.RANGE,
            UNIT.B1Battledroid.TEAM,UNIT.B1Battledroid.FIRERATE,
            UNIT.B1Battledroid.DEFLECT, ai);
    }
}
