
class CloneSharpshooter extends Unit {
    // The Sharpshooter is a projectile-firing sniper unit.

    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.CloneSharpshooter.ATK,
            UNIT.CloneSharpshooter.DEX, UNIT.CloneSharpshooter.CON,
            UNIT.CloneSharpshooter.MVS, UNIT.CloneSharpshooter.RANGE,
            TEAM.REPUBLIC, UNIT.CloneSharpshooter.FIRERATE,
            UNIT.CloneSharpshooter.DEFLECT, ai);
        this.crit_modifier = 3.0;
    }

    // sharpshooter projectiles move considerably faster.
    attack(md) {
        let update_damage = this.roll_damage();
        if ((update_damage > 0.0) && (Math.random() < this.fire_rate)) {
            md.projectiles.push(new Projectile(this, update_damage, 10., 2.));
        }
    }
    // draw a snipers crosshair on top
    render(ctx) {
        if (this.hp > 0.0) {
            // hit box circle
            //draw.circle(ctx, this.x, this.y, this.color, 8);
            draw.arrow(ctx, this.x, this.y,
                this.angleToTarget(this.target), this.color, this.sizebot,
                this.sizelen);
            // draw crosshair

            ctx.beginPath();
            ctx.fillStyle = "rgba({0}, {1}, {2}, 1.0)".format(this.color);
            ctx.arc(this.x, this.y, 4, 0, Math.PI*2, false);
            ctx.stroke();

            // lines
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this._angle+45);
            ctx.beginPath();
            ctx.fillStyle = "rgba({0}, {1}, {2}, 0.5)".format(this.color);

            let _true_size = 4;

            ctx.moveTo(_true_size, 0);
            ctx.lineTo(-_true_size, 0);
            ctx.moveTo(0, _true_size);
            ctx.lineTo(0, -_true_size);
            ctx.stroke();
            ctx.restore();

        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }
    }

}
