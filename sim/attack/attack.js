// a generic attack object
class Attack extends Sprite {
    // defines a temporary Attack object which exists to be seen then die
    constructor(x, y, team, damage) {
        super(x, y, team);
        this.damage = damage;
    }
}
