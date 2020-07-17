// constructor

class B1Battledroid extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.B1Battledroid.HP, UNIT.B1Battledroid.DAMAGE,
            UNIT.B1Battledroid.MVS, UNIT.B1Battledroid.RANGE,
            UNIT.B1Battledroid.TEAM,UNIT.B1Battledroid.FIRERATE,
            UNIT.B1Battledroid.DEFLECT, ai);
    }
}
