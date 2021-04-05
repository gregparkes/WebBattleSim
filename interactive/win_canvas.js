// whether HP are shown on units.
let IS_HP_DISPLAYED = true;
let IS_GRID_DISPLAYED = false;
let IS_TILE_DISPLAYED = false;

// cached inside the loading function to make it cleaner.
window.onload = function() {
    let canvas = document.getElementById("canvas"),
        start_but = document.getElementById("play"),
        pause_but = document.getElementById("pause"),
        loop_but = document.getElementById("loop"),
        update_but = document.getElementById("update_sim"),
        hp_check = document.getElementById("hp_bar"),
        grid_check = document.getElementById("disp_grid"),
        tilegrid_check = document.getElementById("disp_tile"),
        sim_templ = document.getElementById("sel1"),
        terrain_sel = document.getElementById("terrain1"),
        // variables to do with terrain generation
        perlin_scale = document.getElementById("perlin_scale"),
        text_scale = document.getElementById("perlin_text"),
        perlin_octave = document.getElementById("perlin_octave"),
        text_octave = document.getElementById("octave_text"),
        perlin_persist = document.getElementById("perlin_persistance"),
        text_persist = document.getElementById("persistance_text"),
        perlin_lacur = document.getElementById("perlin_lacunarity"),
        text_lacur = document.getElementById("lacunarity_text"),
        seed_check = document.getElementById("seed_check"),
        seed_text = document.getElementById("perlin_seed"),
        tile_check = document.getElementById("tile_check"),
        tile_text = document.getElementById("tile_text"),
        tile_scale = document.getElementById("tile_size"),
        map_gen_check = document.getElementById("map_gen_check"),
        // button variables
        looping = false,
        paused = false,
        // set the canvas size
        pos_info = canvas.getBoundingClientRect(),
        width = canvas.width = Math.floor(pos_info.width),
        height = canvas.height = Math.floor(pos_info.height),
        // get context.
        ctx = canvas.getContext("2d"),
        // terrain default
        terra_def = terrain_map[terrain_sel.options[terrain_sel.selectedIndex].value],
        use_template = BATTLE_TEMPLATE.OPPOSITE_AGGRESSIVE,
        map_level = createLevel(),
        battle = use_template(canvas, map_level);

    // load information into HTML selections for simulation templates
    load_templates();

    // starts/resets the simulation
    start_but.addEventListener("click", reset_sim);
    // pauses the simulation
    pause_but.addEventListener("click", pause_sim);
    // sets the loop flag for the simulation
    loop_but.addEventListener("click", loop_sim);
    // updates/stops the simulation with new parameters
    update_but.addEventListener("click", update_sim);
    // pass this on to the global var which units can access w/out needing to use DOM every time
    hp_check.addEventListener("click", function(e) {
        IS_HP_DISPLAYED = hp_check.checked;
    });
    grid_check.addEventListener("click", function(e) {
        IS_GRID_DISPLAYED = grid_check.checked;
    });
    tilegrid_check.addEventListener("click", function(e) {
        IS_TILE_DISPLAYED = tilegrid_check.checked;
    });
    seed_check.addEventListener("click", () => {
        seed_text.disabled = !seed_text.disabled;
    });
    perlin_scale.addEventListener("input", () => {
        text_scale.innerText = "" + Math.floor(perlin_scale.value);
    });
    perlin_octave.addEventListener("input", () => {
        text_octave.innerText = "" + Math.floor(perlin_octave.value);
    });
    perlin_persist.addEventListener("input", () => {
        text_persist.innerText = "" + Math.floor(perlin_persist.value) / 10.0;
    });
    perlin_lacur.addEventListener("input", () => {
        text_lacur.innerText = "" + Math.floor(perlin_lacur.value) / 10.0;
    });
    tile_scale.addEventListener("input", () => {
        tile_text.innerText = "" + Math.floor(Math.pow(2, tile_scale.value));
    });
    tile_check.addEventListener("click", () => {
        tile_scale.disabled = !tile_scale.disabled;
    });
    // add an event that enables or disables all of the options with class 'map-gen'.
    map_gen_check.addEventListener("click", () => {
        if (map_gen_check.checked) {
            $(".map-gen").prop("disabled", false);
            seed_text.disabled = !seed_check.checked;
            tile_scale.disabled = !tile_check.checked;
        } else {
            $(".map-gen").prop("disabled", true);
        }
    })

    /**
     * Add a canvas event listener for when we click, and create a little circle where we did.
     */
    canvas.addEventListener("click", function(e) {
        // push a new unit on to the stack
        battle.units.push(new CloneTrooper(e.offsetX, e.offsetY, AI.aggressive));
    });

    // first draw
    battle.render();

    /**
     * Here we describe our global functions that handle the simulation start, and level creation.
     */

    function load_templates() {
        Object.keys(btemplate_map).forEach((element, i) => {
            let elem = document.createElement("option"),
                node = document.createTextNode(element);
            elem.appendChild(node);
            sim_templ.appendChild(elem);
        });
    }

    function getPerlin() {
        return {
            scale: perlin_scale.value,
            seed: seed_check.checked ? seed_text.value : Number.MAX_VALUE,
            octaves: perlin_octave.value,
            persistance: perlin_persist.value / 10.0,
            lacunarity: perlin_lacur.value / 10.0
        };
    }

    /**
     * Function that creates a PerlinLevel depending on what the perlin parameters are.
     * @returns {PerlinLevel}
     */
    function createLevel() {
        // also, if the seed is the same, do not re-create the level.
        let level = null,
            perl = getPerlin();

        if (tile_check.checked) {
            // the level is tiled, create a TilePerlinLevel
            let tile_size = Math.floor(Math.pow(2, tile_scale.value));
            level = new TilePerlinLevel(ctx, width, height, perl, tile_size, terra_def);
            // now we create it
            level.create();
        }
        else {
            // create a normal perlin level.
            level = new PerlinLevel(ctx, width, height, perl);
            level.create(terra_def);
        }
        return level;
    }


    /**
     * Resets the simulation to the start when called.
     */
    function reset_sim(e) {
        // only reset if we haven't ran before, or still fighting, or time exceeded.
        if (!battle.running) {
            terra_def = terrain_map[terrain_sel.options[terrain_sel.selectedIndex].value]
            // create a level here!
            map_level = createLevel();
            // initialise battle
            battle = use_template(canvas, map_level);
            battle.start();

            pause_but.style.backgroundColor = start_but.style.backgroundColor;

            // log
            console.log(battle);

            // call the animate loop now
            animate_loop();
            // final render
            battle.render();
        }
    }

    /**
     * Pauses the simulation inplace.
     */
    function pause_sim(e) {
        if (battle.running) {
            battle.running = false;
            // change color
            pause_but.style.backgroundColor = "#a23f3f";
            paused = true;
        } else if (battle.anim_continue()){
            battle.running = true;
            pause_but.style.backgroundColor = start_but.style.backgroundColor;
            animate_loop();
            paused = false;
        } else {
            paused = false;
        }
        // prevent page top jump
    }

    function loop_sim(e) {
        if (!looping) {
            loop_but.style.backgroundColor = "#69b869";
        } else {
            loop_but.style.backgroundColor = start_but.style.backgroundColor;
        }
        looping = !looping;
        // prevent page top jump
    }

    /**
     * This is called when to start the animation, and auto-calls itself while the battle runs.
     */
    function animate_loop() {
        // call update
        battle.update();
        // call to render
        battle.render();

        if (battle.running && battle.anim_continue()) {
            requestAnimationFrame(animate_loop);
        } else {
            battle.running = false;
            if (looping && !battle.anim_continue()) {
                reset_sim();
            }
        }
    }

    /**
     * This function is called when the simulation parameters are updated.
     */
    function update_sim(e) {
        // pause the sim
        pause_sim(e);
        // should have access to 'var' variables as declared in win_canvas.js
        use_template = btemplate_map[sim_templ.options[sim_templ.selectedIndex].value];

        draw.cls(ctx, battle.field.width, battle.field.height);
    }

};