
class Crit extends CanvObj {

    constructor(x, y, ts) {
        super();
        this.x = x;
        this.y = y;
        this.t_start = ts;
        this.TIME_LENGTH = 60;
    }

    update(md) {
        if (md.t - this.t_start > this.TIME_LENGTH)
        {
            this.alive = false;
        }
    }

    render(ctx) {
        if (this.alive) {
            draw.crit(ctx, this.x, this.y);
        }
    }

}