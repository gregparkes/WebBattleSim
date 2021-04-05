/**
Creates an event that triggers after a certain delay, n times.
 */
const EventDelay = (f, delay=1.0, n=1) => ({

    /* where delay is in seconds */
    delay: delay,
    /* the number of times to call the function */
    n: n,
    cooldown: 0.0,
    alive: true,
    /*
    This is a function that is called when the event delay is exceeded n times,
    no arguments are passed to this function.
     */
    func: f,

    update: function(md) {
        this.cooldown += md.time.delta;
        if (this.cooldown >= this.delay && this.n > 0) {
            this.func();
            this.n -= 1;
            this.cooldown = 0.0;
        } else {
            this.alive = false;
        }
    },

})