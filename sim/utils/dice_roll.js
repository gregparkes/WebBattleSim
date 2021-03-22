const Dice = {
    /* Rolls a 1d6 */
    d1d6: function(){
        return utils.randomInt(0, 6) + 1;
    },

    /* Rolls a 1d8 */
    d1d8: function(){
        return utils.randomInt(0, 8) + 1;
    },

    d2d6: function(){
        return (utils.randomInt(0, 6) + 1) + (utils.randomInt(0, 6) + 1);
    },

    d2d8: function(){
        return (utils.randomInt(0, 8) + 1) + (utils.randomInt(0, 8) + 1);
    },

    /**
     * Rolls a number of dice, each with so many sides.
     * @param ndie : int
     * @param nsides : int
     * @returns {number}
     */
    roll: function(ndie, nsides) {
        // given number of die and number of sides on these die, roll some random number.
        let _sum = 0.0;
        for (let i = 0; i < ndie; i++) {
            _sum += (utils.randomInt(0, nsides) + 1);
        }
        return _sum;
    },

    /**
     * uses the D&D roll number system, e.g "1d20", for one 20-sided die, "2d8" for 8-sided 2 dice
     * @param rname : string
     * @returns {number}
     */
    ddroll: function(rname) {
        let res = rname.split("d", 2),
            ndie = parseInt(res[0]),
            nsides = parseInt(res[1]),
            _sum = 0.0;

        for (let i = 0; i < ndie; i++) {
            _sum += (utils.randomInt(0, nsides) + 1);
        }
        return _sum;
    },

}
