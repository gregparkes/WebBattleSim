
class Tile extends Sprite {

    constructor(x, y, w, h, color) {
        super(x, y, null);
        this.w = w;
        this.h = h;
        this.color = color;
    }

    render(ctx) {
        ctx.fillStyle = "rgb(" + this.color + "," + this.color + "," + this.color + ")";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

}