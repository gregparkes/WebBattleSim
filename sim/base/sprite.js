// an enum for teams

const TEAM = {
    REPUBLIC: 0, CIS: 1
}

// A spritable refers to a generic object which exists in
// the canvas, has coordinates and can be drawn

class CanvObj {
    // a canvas element or object which is updatable and 'maybe' renderable
    constructor() {
        // has an 'alive' property, usually as to whether to draw or not
        this.alive = true;
    }

    update(md) {
        // your code here
    }

    render(ctx) {
        // your code here
    }

}


/*
A sprite is something that has a position (x, y) with an associated 'color' or team, is drawable (contains render() function),
and performs bounds checking on its position.
 */

class Sprite extends CanvObj {
    // call the constructor

    /**
     * Creates a sprite.
     * @param x : float
     * @param y : float
     * @param team : number
     */
    constructor(x, y, team) {
        super();
        this.x = x;
        this.y = y;
        this.team = team;
        this.color = (team === TEAM.REPUBLIC) ? [255, 0, 0] : [0, 0, 255];
    }

    _switch_team() {
        if (this.team === TEAM.CIS) {
            this.team = TEAM.REPUBLIC;
            this.color = [255, 0, 0];
        } else {
            this.team = TEAM.CIS;
            this.color = [0, 0, 255];
        }
    }

    // automatic bounds checking method to field
    bounds_check(md) {
        if (md.field.fixed) {
            // if the battlefield has hard boundaries...
            if (this.x < 10) {this.x = 10; }
            if (this.y < 10) {this.y = 10; }
            if (this.x > md.field.width - 10) {this.x = md.field.width - 10; }
            if (this.y > md.field.height - 10) {this.y = md.field.height - 10; }
        } else {
            // we can 'loop' the units to the otherside of the field
            if (this.x < 10) {this.x = md.field.width - 10; }
            if (this.y < 10) {this.y = md.field.height - 10; }
            if (this.x > md.field.width - 10) {this.x = 10; }
            if (this.y > md.field.height - 10) {this.y = 10; }
        }
    }

}
