const roleMineralMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.carry.energy === 0) {
            creep.memory.mode = 'pickup';
        }
        if (_.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.mode = 'dropoff';
        }
        if (creep.memory.mode === "pickup") {
            this.harvestFromMinerals(creep);
        } else if (creep.memory.mode === "dropoff") {
            this.dropOffToLab(creep)
        }
    },

    dropOffToLab(creep) {
        let labs = creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_LAB &&
                structure.mineralAmount < structure.mineralCapacity
        });
        let closestLab = creep.pos.findClosestByPath(labs);

        let mineralType = _.find(_.keys(creep.carry), function (carryKey) {
            return carryKey !== 'energy'
        });

        if (creep.transfer(closestLab, mineralType) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestLab);
        }
    },

    harvestFromMinerals: function (creep) {
        // only ever one mineral drop
        let target = creep.room.find(FIND_MINERALS)[0];
        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
};

module.exports = roleMineralMiner;