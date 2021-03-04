// a turret class which stays still, turns on the spot and attacks at nearby enemy units

class Turret extends Combative {

    constructor(x, y, hp, damage, range, team, fr) {
        super(x, y, team);
        // attributes
        this.hp = this.MAX_HP = hp;
        this.range = range;
        this.damage = damage;
        this.fire_rate = fr;
        // hitbox
        this.hit_radius = 15.0;
    }

    isTargetInRange() {
        return (this._dist <= this.range);
    }

    attack(md) {
        if (Math.random() < this.fire_rate) {
            md.projectiles.push(new Projectile(
                this, this.damage,5., 5.));
        }
    }

    update(md) {
        // update the turret logic here
        this.updateToTarget();
        // use the 'stand AI' as a turret does not move
        AI.stand(this, md);
    }

    render(ctx) {
        // draw a turret looking thing
        // first a circle...?
        ctx.fillStyle = "rgba({0}, {1}, {2}, 0.4)".format(this.color);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.hit_radius, 0, 2*Math.PI);
        ctx.fill();
        // now the turret gun part
        ctx.fillStyle = "rgba({0}, {1}, {2}, 1.0)".format(this.color);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this._angle);
        ctx.fillRect(0, -2.5, 20, 5);
        ctx.restore();
    }

}