
class RectObstacle extends CanvObj {

    constructor(x, y, w, h) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    render(ctx) {
        ctx.fillStyle = "rgba({0}, {1}, {2}, 0.4)".format([255, 125, 64]);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

}