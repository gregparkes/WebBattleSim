class B2Battledroid extends Unit {

    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.B2Battledroid.HP, UNIT.B2Battledroid.DAMAGE,
            UNIT.B2Battledroid.MVS, UNIT.B2Battledroid.RANGE,
            UNIT.B2Battledroid.TEAM, UNIT.B2Battledroid.FIRERATE,
            UNIT.B2Battledroid.DEFLECT, ai);
        this.sizebot = 13;
        this.sizelen = 18;
    }

}