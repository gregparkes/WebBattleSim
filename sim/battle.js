/**
 * The main canvas object for simulating battles upon.
 * @param canvas : HTMLCanvasElement
 * @param objects : []
 * @param level
 * @returns {{objects: *[], obstacles: *[], delta: number, filter_objects: filter_objects, terrain_type: {tiles: [{color, passable, name}, {color, passable, name}, {color, passable, name}, {color, passable, name}, {color, passable, name}], weights: number[]}, update: update, T_MIN: number, units: *[], _c_alive: [], running: boolean, has_alive_units: (function()), T_MAX, now: number, render: render, get_enemies: (function(*): []), _xtiles: number, level: null, ctx: CanvasRenderingContext2D, start: start, setDelta: setDelta, then: number, _alive: [], spawners: *[], freezedelta: number, projectiles: [], get_allies: (function(*): []), crits: [], setCaches: setCaches, _render_grid: _render_grid, field: {width: number, fixed: boolean, height: number}, t: number, _ytiles: number, turrets: *[], anim_continue: (function()), perlin: {octaves, seed: (*|number), persistance: number, scale, lacunarity: number}, parameters: {IS_MAP_DRAWN: (boolean|boolean|*), IS_USING_TILES: (boolean|boolean|*), IS_UNIT_COLLISION: (boolean|boolean|*), UNIT_MOVE_MODE, IS_TILE_COLLISION: (boolean|boolean|*)}, _r_alive: [], melees: []}}
 */
const battle = (canvas, objects, level) => ({
    /*
    our Battle object contains everything in the instance needed
    to update our game logic for a single Battle instance.

    Given the canvas object to work with, a context is made.

    Arguments:
        canvas : a canvas object
        objects : list of [CanvObj] objects
     */
    // information about the battlefield, including w and h
    field: {width: canvas.width, height: canvas.height, fixed: true},
    // drawing context
    ctx: canvas.getContext("2d"),

    HTMLElem: {
        /** Html elements that we access.*/
        __MOVE_MODE: document.getElementById("movemode"),
        __TILE_SIZE: document.getElementById("tile_size"),
        __TILE_CHECK: document.getElementById("tile_check"),
        __TILE_COLLIDE: document.getElementById("tile_collision"),
        __UNIT_COLLIDE: document.getElementById("unit_collision"),
        __MAP_GENERATOR: document.getElementById("map_gen_check")
    },

    parameters: {
        /**
         * Handle parameters drawn from the GUI.
         */
        IS_UNIT_COLLISION: false,
        IS_TILE_COLLISION: true,
        /* options of 'euclidean' and 'A*' */
        UNIT_MOVE_MODE: "Astar",
        IS_MAP_DRAWN: true,
        IS_USING_TILES: true,
    },

    // frames
    t: 0,
    // time
    time: {
        now: Date.now(),
        then: Date.now(),
        delta: 1.0,
        freezedelta: 1.0
    },
    // running / frame-based
    running: false,
    // define a minimum and maximum frame run
    T_MIN: 100,
    T_MAX: document.getElementById("sim_max").value,
    // define the number of xtiles and ytiles
    _xtiles: 5,
    _ytiles: 5,
    // define a map object - first thing created
    level: level,
    // object array for all objects
    objects: objects,
    // unit arrays
    units: objects.filter(u => u instanceof Unit),
    // alive unit roster
    _alive: [],
    // alive unit per team caches
    _c_alive: [],
    _r_alive: [],
    // projectiles
    projectiles: [],
    // melee attacks
    melees: [],
    // spawners
    spawners: objects.filter(s => s instanceof Spawner),
    // turrets
    turrets: objects.filter(u => u instanceof Turret),
    // crit texts
    crits: [],
    // obstacles
    obstacles: objects.filter(r => r instanceof RectObstacle),
    // list of events
    events: [],

    // START FUNCTION to START the BATTLE
    start: function() {
        if (!this.running) {
            // start running
            this.running = true;
            this.t = 0;

            // refresh parameters
            this.parameters.IS_MAP_DRAWN = this.HTMLElem.__MAP_GENERATOR.checked;
            this.parameters.IS_USING_TILES = this.HTMLElem.__TILE_CHECK.checked;
            this.parameters.IS_UNIT_COLLISION = this.HTMLElem.__UNIT_COLLIDE.checked;
            this.parameters.IS_TILE_COLLISION = this.HTMLElem.__TILE_COLLIDE.checked;
            this.parameters.UNIT_MOVE_MODE = this.HTMLElem.__MOVE_MODE[this.HTMLElem.__MOVE_MODE.selectedIndex].value;

            // set caches
            this.setCaches();
            // randomly assign start targets
            ai_init_target.nearest(this._c_alive, this._r_alive);
            // assign targets to turrets if possible
            for (let i = 0; i < this.turrets.length; i++) {
                let t = this.turrets[i],
                    enemy = this.get_enemies(t.team);
                t.target = enemy[utils.randomInt(0, enemy.length-1)];
            }

            // render once before update loop
            this.render();
        }
    },

    anim_continue: function() {
        return ((this.t < this.T_MIN) | (this.t < this.T_MAX && this.has_alive_units()));
    },

    has_alive_units: function() {
        // checks whether any alive units remain
        return (this._r_alive.length > 0 && this._c_alive.length > 0);
    },

    get_enemies: function(team) {
        return (team === TEAM.REPUBLIC) ? this._c_alive : this._r_alive;
    },

    get_allies: function(team) {
        return (team === TEAM.REPUBLIC) ? this._r_alive : this._c_alive;
    },

    filter_objects: function(every_t = 100) {
        // go through and filter out the non-alive objects every so often
        if (this.t % every_t === 0) {
            this.events = this.events.filter(e => e.alive);
            this.projectiles = this.projectiles.filter(p => p.alive);
            this.melees = this.melees.filter(m => m.alive);
            this.crits = this.crits.filter(m => m.alive);
        }
    },

    setDelta: function() {
        this.time.now = Date.now();
        this.time.delta = (this.time.now - this.time.then) / 1000.; // for seconds
        this.time.then = this.time.now;
        if (this.t % 20 === 0) {
            this.time.freezedelta = this.time.delta;
        }
    },

    setCaches: function() {
        this._alive = this.units.filter(u => u.hp > 0.);
        this._r_alive = this._alive.filter(u => u.team === TEAM.REPUBLIC);
        this._c_alive = this._alive.filter(u => u.team === TEAM.CIS);
    },

    update: function() {
        // add frame
        this.t++;
        // update clock
        this.setDelta();
        // update which units are alive...
        this.setCaches();

        let update_f = (element) => element.update(this);

        this.obstacles.forEach(update_f);
        // units updated first
        this.units.forEach(update_f);
        // then turrets
        this.turrets.forEach(update_f);
        // then spawners
        this.spawners.forEach(update_f);
        // finally attacks and projectiles.
        this.projectiles.forEach(update_f);
        this.melees.forEach(update_f);
        // crits
        this.crits.forEach(update_f);

        // events are not updated here and are responsibility of classes.

        // filter out obsolete objects.
        this.filter_objects();
    },

    // render the battlefield.
    render: function() {
        // clears the screen
        draw.cls(this.ctx, this.field.width, this.field.height);

        let render_f = (element, i) => element.render(this.ctx);

        // render tilemap first
        if (this.parameters.IS_MAP_DRAWN) {
            this.level.render(this.ctx);
        }

        // render obstacles first
        this.obstacles.forEach(render_f);
        // render in this order
        this.units.forEach(render_f);
        this.turrets.forEach(render_f);
        this.projectiles.forEach(render_f);

        // do not render
        // this.melees.forEach(render_f);

        // update crits
        this.crits.forEach(render_f);

        // display grid if set
        if (IS_GRID_DISPLAYED) {
            this._render_grid(this.ctx, this._xtiles, this._ytiles);
        }

        // add text to update timestep, number of units
        this.ctx.font = "30px Arial";
        this.ctx.strokeText("BattleSimulator", this.field.width - 220, 30);

        // add counter at bottom right
        let stats = ("Republic: " + this._r_alive.length + " CIS: "
            + this._c_alive.length + " t: " + this.t + " fps: " + Math.floor(1. / this.time.freezedelta)
            + " size(" + this.field.width + "," + this.field.height + ")");
        this.ctx.font = "12px Arial";
        this.ctx.strokeText(stats, this.field.width - 275, this.field.height - 20);

    },

    _render_grid: function(ctx) {
        // attempts to render a grid of squares over the domain.
        let xtiles = this.field.width / this.level.size;
        let ytiles = this.field.height / this.level.size;

        for (let gx = 1; gx < xtiles; gx++) {
            draw.line_single(ctx, gx*this.level.size, 0, gx*this.level.size, this.field.height);
        }
        for (let gy = 1; gy < ytiles; gy++) {
            draw.line_single(ctx, 0, gy*this.level.size, this.field.width, gy*this.level.size);
        }
    }

})