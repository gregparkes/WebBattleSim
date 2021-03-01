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

}


class Sprite extends CanvObj {
    // call the constructor
    constructor(x, y, team) {
        super();
        this.x = x;
        this.y = y;
        this.team = team;
        // other parameters for position and team
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

    render(ctx) {
        // your code here
    }

}

// combative objects have an identifier,
// and a *Target* as well as
// positional, team and color coordinates from Sprite

class Combative extends Sprite {

    constructor(i, x, y, team, con) {
        super(x, y, team);
        // set ID and hit points
        this.id = i;
        // constitution converted directly to HP
        this.hp = this.MAX_HP = 20 + (con * 7);
        // target set to null
        this.target = null;
        // a bunch of hidden parameters for direcitonal derivatives
        this.dx = 0.0;
        this.dy = 0.0;
        this._nddx = 0.0;
        this._nddy = 0.0;
        this._dist = 0.0;
        this._angle = 0.0;
    }

    // with target set, we can calculate distances and angles to this
    // target

    updateToTarget(other=this.target, update_angle=true) {
        // if we actually have a valid target..
        if (other) {
            this.dx = other.x - this.x;
            this.dy = other.y - this.y;
            this._dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
            this._nddx = this.dx / this._dist;
            this._nddy = this.dy / this._dist;
            if (update_angle) {
                this._angle = Math.atan2(this.dy, this.dx);
            }
        }
    }

    translate(md, modifier=1.0, towards=true) {
        if (towards) {
            this.x += this._nddx * modifier;
            this.y += this._nddy * modifier;
        } else {
            this.x -= this._nddx * modifier;
            this.y -= this._nddy * modifier;
        }
        // bounds check to edge of the map
        this.bounds_check(md);
    }

    angleToTarget() {
        return this._angle;
    }

    distanceToTarget() {
        return this._dist;
    }

    dealDamageFrom(dmg) {
        this.hp -= dmg;
    }

    isTargetAlive() {
        return (this.target && this.target.hp > 0.0);
    }

}