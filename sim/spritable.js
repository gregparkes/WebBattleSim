// A spritable refers to a generic object which exists in
// the canvas, has coordinates and can be drawn

class Spritable {
    // call the constructor
    constructor(x, y, team) {
        this.x = x;
        this.y = y;
        this.team = team;
        // other parameters for position and team
        this.color = (team === "Republic") ? [255, 0, 0] : [0, 0, 255];
    }

    _switch_team() {
        if (this.team === "CIS") {
            this.team = "Republic";
            this.color = [255, 0, 0];
        } else {
            this.team = "CIS";
            this.color = [0, 0, 255];
        }
    }

    // automatic bounds checking method to field
    bounds_check(md) {
        if (this.x < 10) {this.x = 10; }
        if (this.y < 10) {this.y = 10; }
        if (this.x > md.field.width - 20) {this.x = md.field.width - 20; }
        if (this.y > md.field.height - 20) {this.y = md.field.height - 20; }
    }

    render(ctx) {
    }

    update(md) {
    }
}

// combative objects have an identifier,
// and a *Target* as well as
// positional, team and color coordinates from Spritable

class Combative extends Spritable {

    constructor(i, x, y, team, hp) {
        super(x, y, team);
        // set ID and hit points
        this.id = i;
        this.hp = hp;
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
        } else {
            alert("Combative " + this.id + " has no valid target attr.")
        }
    }

    moveToTarget(md, modifier, towards=true) {
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

    update(md) {
        // perform action
        this.updateToTarget();
    }

    render(ctx) {
        // draw something here...
    }

}