const AttackType = {
    PROJECTILE: 0, MELEE: 1
}

// a generic attack object
class Attack extends Sprite {
    // defines a temporary Attack object which exists to be seen then die
    constructor(source, damage, is_crit=false) {
        super(source.x, source.y, source.team);
        //this.source = source;
        this.damage = damage;
        this.is_crit = is_crit;
    }
}
