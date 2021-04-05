// a (class) for handling melee attack

class Melee extends Attack {
    constructor(source, damage, target) {
        // call constructor of attack
        super(source, damage, false);
        this.target = target;
        this.e = EventDelay(this.damage_unit, 0.5, 1);
    }
    /*
    Called by EventDelay
     */
    damage_unit() {
        if (this.target !== null) this.target.dealDamageFrom(this.source, this.damage);
        // once this is called, reset the event.
        this.alive = false;
    }

    update(md) {
        if (this.alive) {
            this.e.update(md);
        }
    }

}
