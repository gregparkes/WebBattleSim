const battle = (canvas, objects, terrain) => ({
    /*
    our Battle object contains everything in the instance needed
    to update our game logic for a single Battle instance.

    Given the canvas object to work with, a context is made.

    Arguments:
        canvas : a canvas object
        objects : list of [CanvObj] objects
     */
    // information about the battlefield, including w and h
    field: {width: canvas.width, height: canvas.height},
    // drawing context
    ctx: canvas.getContext("2d"),
    // game logic mechanics from simulation params
    UNIT_COLLISION: false,
    TILE_COLLISION: false,
    // frames
    t: 0,
    // time
    now: Date.now(),
    then: Date.now(),
    delta: 1.,
    freezedelta: 1.,
    // running / frame-based
    running: false,
    // define a minimum and maximum frame run
    T_MIN: 100,
    T_MAX: 2000,
    // define the number of xtiles and ytiles
    _xtiles: 5,
    _ytiles: 5,
    // define a perlin object to hold all these parameters.
    perlin: {
        scale: document.getElementById("perlin_scale").value,
        seed: document.getElementById("seed_check").checked ? document.getElementById("perlin_seed").value : Number.MAX_VALUE,
        octaves: document.getElementById("perlin_octave").value,
        persistance: document.getElementById("perlin_persistance").value / 10.0,
        lacunarity: document.getElementById("perlin_lacunarity").value / 10.0
    },
    terrain_type: terrain,
    // define a map object - we will instantiate in the start method.
    level: null,
    // whether we have a map or not to draw.
    is_map_drawn: document.getElementById("map_gen_check").checked,
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

    // START FUNCTION to START the BATTLE
    start: function() {
        if (!this.running) {
            // check whether mechanics are set
            this.UNIT_COLLISION = document.getElementById("unit_collision").checked;
            this.TILE_COLLISION = document.getElementById("tile_collision").checked;
            // set the t_max
            this.T_MAX = document.getElementById("sim_max").value;
            // start running
            this.running = true;
            this.t = 0;

            // only draw a map if the map generation checkbox is checked
            if (this.is_map_drawn) {
                // create background map.
                if (document.getElementById("tile_check").checked) {
                    let tile_size = Math.floor(Math.pow(2, document.getElementById("tile_size").value));
                    // create our map
                    this.level = new TilePerlinLevel(this.ctx, this.field.width, this.field.height, tile_size);
                    //this.map.create_simple2(this.ctx, terrain);
                    this.level.create(this.perlin, this.terrain_type);
                } else {
                    this.level = new PerlinLevel(this.ctx, this.field.width, this.field.height);
                    this.level.create(this.perlin, this.terrain_type);
                }
            }

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
            console.log(this.map);

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
            this.projectiles = this.projectiles.filter(p => p.alive);
            this.melees = this.melees.filter(m => m.alive);
            this.crits = this.crits.filter(m => m.alive);
        }
    },

    setDelta: function() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000.; // for seconds
        this.then = this.now;
        if (this.t % 20 === 0) {
            this.freezedelta = this.delta;
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

        // filter out obsolete objects.
        this.filter_objects();
        // finally, draw
        this.render();
    },

    // render the battlefield.
    render: function() {
        // clears the screen
        draw.cls(this.ctx, this.field.width, this.field.height);

        let render_f = (element, i) => element.render(this.ctx);
        // render tilemap first
        if (this.is_map_drawn) {
            this.level.render(this.ctx);
        }

        // render obstacles first
        this.obstacles.forEach(render_f);
        // render in this order
        this.units.forEach(render_f);
        this.turrets.forEach(render_f);
        this.projectiles.forEach(render_f);
        this.melees.forEach(render_f);
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
            + this._c_alive.length + " t: " + this.t + " fps: " + Math.floor(1. / this.freezedelta)
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