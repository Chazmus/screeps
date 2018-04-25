let someGuy = {

    /** @param {Creep} creep **/
    run: function (creep) {
        let extractor = creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_EXTRACTOR
        })[0];

        if (creep.carry.energy === 0) {
            creep.memory.mode = 'pickup';
        }
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'dropoff';
        }

        if (creep.memory.mode = 'pickup') {
            return this.pickup(creep, extractor);
        } else {
            let lab = this.getLabForDropoff();
            return this.dropoff(creep, lab);
        }
    },

    getLabForDropoff() {
        //todo;
    },

    dropoff(creep, lab) {
        // todo
    },

    pickup(creep, extractor) {
        let harvestResult = creep.harvest(extractor);
        if (harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(extractor);
        }
    }
};

module.exports = someGuy;