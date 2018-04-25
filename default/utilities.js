module.exports = {

    // function to return a good source to check out from a list of sources
    viableSource: function (sourcesList) {

    },

    clearMemory: function clearMemory() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    bodyCost: function bodyCost(body) {
        return body.reduce(function (cost, part) {
            return cost + BODYPART_COST[part];
        }, 0);
    }
};