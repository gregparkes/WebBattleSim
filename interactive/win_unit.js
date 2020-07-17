// this script populates the HTML table
// with information from UNIT templates for unit.html

window.onload = function() {

    let canvas_set = [],
        units = [];

    // populate the table on loading the html document.

    function drawLiveUnit(uname, cw, ch) {
        if (uname === "CloneTrooper") {
            return new CloneTrooper(0, cw / 2, ch / 2, null);
        } else if (uname === "B1Battledroid") {
            return new B1Battledroid(0, cw / 2, ch / 2, null);
        } else if (uname === "B2Battledroid") {
            return new B2Battledroid(0, cw / 2, ch / 2, null);
        } else if (uname === "CloneSharpshooter") {
            return new CloneSharpshooter(0, cw / 2, ch / 2, null);
        } else if (uname === "Jedi") {
            return new Jedi(0, cw / 2, ch / 2, null);
        }
    }

    function generateTableHead(table) {
        let thead = table.createTHead(),
            row = thead.insertRow();

        // insert a row for the appearance of the unit..
        let th = document.createElement("th"),
            text = document.createTextNode("DISPLAY");
        th.appendChild(text);
        row.appendChild(th);

        for (let i = 0; i < unitattrs.length; i++) {
            let th = document.createElement("th"),
                text = document.createTextNode(unitattrs[i]);
            th.appendChild(text);
            row.appendChild(th);
        }
    }

    function generateTable(table) {

        let unit_key = Object.keys(UNIT);

        unit_key.forEach((u, index) => {
            let elem_obj = UNIT[u],
                row = table.insertRow();
            // insert a canvas cell and render the unit.
            let cell = row.insertCell(),
                canv = document.createElement("canvas"),
                canv_contx = canv.getContext("2d"),
                pos_info = canv.getBoundingClientRect(),
                cw = 50,
                ch = 30;

            canv.width = cw;
            canv.height = ch;
            // add our canvas contexts to the set
            canvas_set.push(canv_contx);
            // firstly draw an example unit
            let live_u = drawLiveUnit(u, cw, ch);
            units.push(live_u);
            // now add this canvas into the appropriate cell.
            cell.appendChild(canv);
            // now draw the unit INTO this canvas.
            live_u.render(canv_contx);

            for (let i = 0; i < unitattrs.length; i++) {
                // attr is a string key
                let cell = row.insertCell(),
                    text = document.createTextNode(elem_obj[unitattrs[i]]);
                cell.appendChild(text);
            }
        });
    }

    let unittab = document.getElementById("unit_table"),
        unitattrs = ["NAME","TEAM","HP","DAMAGE","MVS",
                     "RANGE", "FIRERATE", "DEFLECT"];

    generateTableHead(unittab);
    generateTable(unittab);
    // start animating the units
    animate_canvases();

    // now provide a callback to animate all the canvases
    function animate_canvases() {

        // update the rotate of all the fake units
        for (let i = 0; i < units.length; i++) {
            // clear the canvas
            canvas_set[i].fillStyle = "#ffffff";
            canvas_set[i].fillRect(0, 0, 50, 30);
            // update the units angle and then render
            units[i]._angle += 0.05;
            if (units[i]._angle > 360.0) {
                units[i]._angle -= 360.0;
            }
            // render using correct canvas set
            units[i].render(canvas_set[i]);
        }

        // now request an animation frame into this function
        requestAnimationFrame(animate_canvases);

    }

};