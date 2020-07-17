// a (class) for handling melee attack

class Melee extends Attack {
    constructor(x, y, team, dmg, target) {
        // call constructor of attack
        super(x, y, team, dmg);
        this.target = target;
        this.tick = 0;
    }

    update(md) {
        if (this.active) {
            this.tick++;
            this.x = this.target.x;
            this.y = this.target.y;
            if (this.tick >= 10) {
                this.active = false;
            }
            if (this.tick === 6) {
                this.target.dealDamageFrom(this.damage);
            }
        }
    }

    render(ctx) {
        if (this.active) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            // @ts-ignore
            ctx.fillStyle = "rgba({0}, {1}, {2}, 0.4)".format(this.color);
            ctx.moveTo(4, 4);
            ctx.lineTo(-4, -4);
            if (this.tick < 3) {
                // do nothing
            } else if (this.tick < 7) {
                ctx.moveTo(4, -4);
                ctx.lineTo(-4, 4);
            } else if (this.tick < 10) {
                ctx.moveTo(4, -4);
                ctx.lineTo(-4, 4);
                ctx.moveTo(4, 0);
                ctx.lineTo(-4,-6);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

}
