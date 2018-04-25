const roleHarvester = require('role.harvester');

const roleDefender = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name !== 'W6N8') {
            const exitDir = Game.map.findExit(creep.room, 'W6N8');
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        } else {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleDefender;