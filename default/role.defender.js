const roleHarvester = require('role.harvester');

const roleDefender = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            //roleHarvester.run(creep);
        }
    }
};

module.exports = roleDefender;