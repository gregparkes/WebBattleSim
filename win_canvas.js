// define some globals here

// whether HP are shown on units.
let IS_HP_DISPLAYED = false;

// global function to choose which template to run.
function choose_template() {
    let temp_obj = document.getElementById("sel1"),
        temp_opt = temp_obj.options[temp_obj.selectedIndex].value;

    if (temp_opt === "Opposite Aggressive") {
        return BATTLE.OPPOSITE_AGGRESSIVE;
    } else if (temp_opt === "Aggressor Defender") {
        return BATTLE.ATTACKER_DEFENDER;
    } else if (temp_opt === "Snipers' Nest") {
        return BATTLE.SNIPERS_NEST;
    } else if (temp_opt === "Jedi Defenders") {
        return BATTLE.JEDI_DEFENDERS;
    } else if (temp_opt === "Guerrilla Warfare") {
        return BATTLE.GUERRILLA_WARFARE;
    } else if (temp_opt === "Tower Defence") {
        return BATTLE.TOWER_DEFENCE;
    }
}

// cached inside the loading function to make it cleaner.
window.onload = function() {
    var canvas = document.getElementById("canvas"),
        start_but = document.getElementById("play"),
        pause_but = document.getElementById("pause"),
        loop_but = document.getElementById("loop"),
        update_but = document.getElementById("update_sim"),
        hp_check = document.getElementById("hp_bar"),
        // button variables
        looping = false,
        paused = false,
        // set the canvas size
        pos_info = canvas.getBoundingClientRect(),
        width = canvas.width = pos_info.width,
        height = canvas.height = pos_info.height,
        ctx = canvas.getContext("2d"),
        nrep_field = document.getElementById("nrep"),
        ncis_field = document.getElementById("ncis"),
        // size of armies
        n1 = nrep_field.value,
        n2 = ncis_field.value,
        use_template = choose_template(),
        battle = use_template(ctx, n1, n2);

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

    // log
    console.log(battle.units);
    console.log(battle.droids);
    console.log(battle.clones);

    // first draw
    battle.render();

    function reset_sim(e) {
        // only reset if we haven't ran before, or still fighting, or time exceeded.
        if (!battle.running) {
            // initialise battle
            battle = use_template(ctx, n1, n2);
            battle.start();
            pause_but.style.backgroundColor = start_but.style.backgroundColor;
            // call the animate loop now
            animate_loop();
            // final render
            battle.render();
        }
        // prevent page top jump
    }

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

    function animate_loop() {
        // call update
        battle.update();

        if (battle.running && battle.anim_continue()) {
            requestAnimationFrame(animate_loop);
        } else {
            battle.running = false;
            if (looping && !battle.anim_continue()) {
                reset_sim();
            }
        }
    }

    function update_sim(e) {
        // pause the sim
        pause_sim(e);
        // should have access to 'var' variables as declared in win_canvas.js
        n1 = nrep_field.value;
        n2 = ncis_field.value;
        use_template = choose_template();

        draw.cls(ctx, battle.field.width, battle.field.height);
    }

};