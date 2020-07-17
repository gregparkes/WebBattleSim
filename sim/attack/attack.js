// a generic attack object
class Attack extends Spritable {
    // defines a temporary Attack object which exists to be seen then die
    constructor(x, y, team, damage) {
        super(x, y, team);
        this.damage = damage;
        this.active = true;
    }
}
