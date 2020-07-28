// an animation object which handles the flow of drawing specific animations as needed

class Animate extends CanvObj {

    constructor(value_start, value_end, steps_taken, loop = false) {
        super();
        this.vs = this.value = value_start;
        this.ve = value_end;
        this.ts = steps_taken;
        this.loop = loop;
    }



}