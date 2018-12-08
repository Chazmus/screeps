var roleHarvester = require('role.harvester');
var screepUtilities = require('screep.utilities');

let roleBuilder = {

    TARGET_ROOM: "W8N4",

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name !== this.TARGET_ROOM) {
            const exitDir = Game.map.findExit(creep.room, this.TARGET_ROOM);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
            return;
        }

        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            delete creep.memory.targetSource;
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {

                targets = _.sortBy(targets, function (target) {
                    return target.id;
                });

                targets.sort(function (targetA, targetB) {
                    if (targetA.structureType === targetB.structureType) {
                        return targetA.id - targetB.id;
                    }
                    // Then roads
                    if (targetA.structureType === 'road') {
                        return -1;
                    }
                    if (targetB.structureType === 'road') {
                        return 1;
                    }
                    // Extensions go first
                    if (targetA.structureType === 'extension') {
                        return -1;
                    }
                    if (targetB.structureType === 'extension') {
                        return 1;
                    }

                    return targetA.id - targetB.id;
                });

                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleHarvester.run(creep);
            }
        }
        else {
            // Go harvest;
            screepUtilities.harvestFromSourceInRoom(creep);
        }
    }
};

module.exports = roleBuilder;