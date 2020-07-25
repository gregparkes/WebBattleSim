// constructor

class Jedi extends Unit {
    constructor(i, x, y, ai) {
        super(i, x, y, UNIT.Jedi.ATTACK,
            UNIT.Jedi.DEX, UNIT.Jedi.CON,
            UNIT.Jedi.MVS, UNIT.Jedi.RANGE,
            UNIT.Jedi.TEAM, UNIT.Jedi.FIRERATE,
            UNIT.Jedi.DEFLECT, ai);
        // override attributes
        this.atk_type = AttackType.MELEE;
        this.utype = "force_wielder";
        this.sizebot = 14;
        this.sizelen = 21;

        this.lightsaber_color = (Math.random() < 0.5) ? [106, 187, 252] : [52, 237, 68];

    }

    render(ctx) {
        // default rendering
        if (this.hp > 0.0) {
            // hit box circle
            // draw slightly adjusted arrow
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this._angle);
            ctx.beginPath();
            ctx.fillStyle = "rgba({0}, {1}, {2}, 0.9)".format(this.color);
            let arrlen = this.sizelen / 2,
                arrbot = this.sizebot / 2;
            ctx.moveTo(arrlen, 2);
            ctx.lineTo(arrlen, -2);
            ctx.lineTo(0, -arrbot);
            ctx.lineTo(-2, -arrbot+3);
            ctx.lineTo(-5, -arrbot);
            ctx.lineTo(-arrlen, -arrbot);
            ctx.lineTo(-arrlen, arrbot);
            ctx.lineTo(-5, arrbot);
            ctx.lineTo(-2, arrbot-3);
            ctx.lineTo(0, arrbot);
            ctx.lineTo(arrlen, 2);
            ctx.fill();
            ctx.restore();

            // draw lightsaber
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this._angle+20);
            // draw a long rectangle stick to represent lightsaber
            ctx.fillStyle = "rgba({0},{1},{2},0.8)".format(this.lightsaber_color);
            ctx.fillRect(0, -3, 15, 2.5);
            ctx.restore();

            // draw a health bar on top if damaged
            if (this.hp < this.MAX_HP && IS_HP_DISPLAYED) {
                draw.healthbar(ctx, this.x, this.y - 6, this.hp / this.MAX_HP);
            }

        } else {
            draw.cross(ctx, this.x, this.y, this.color, this.sizebot);
        }
    }

}