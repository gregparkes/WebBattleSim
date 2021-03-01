// a (class) for handling melee attack

class Melee extends Attack {
    constructor(source, damage, target) {
        // call constructor of attack
        super(source, damage, false);
        this.target = target;
        this.tick = 0;
    }

    update(md) {
        if (this.alive) {
            this.tick++;
            this.x = this.target.x;
            this.y = this.target.y;
            if (this.tick === 6) {
                this.target.dealDamageFrom(this.source, this.damage);
            }
            if (this.tick >= 10) {
                this.alive = false;
            }
        }
    }

    render(ctx) {
        if (this.alive) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            // @ts-ignore
            ctx.fillStyle = "rgba({0}, {1}, {2}, 0.4)".format(this.color);
            ctx.moveTo(4, 4);
            ctx.lineTo(-4, -4);
            if (this.tick >= 3) {
                ctx.moveTo(4, -4);
                ctx.lineTo(-4, 4);
            }
            if (this.tick >= 7) {
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
