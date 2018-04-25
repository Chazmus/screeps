var roleHarvester = require('role.harvester');
var screepUtilities = require('screep.utilities');

let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

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
                    // Equal
                    if (targetA.structureType === targetB.structureType) {
                        return creep.pos.getRangeTo(targetA) - creep.pos.getRangeTo(targetB)
                    }
                    // Extensions go first
                    if (targetA.structureType === STRUCTURE_EXTENSION) {
                        return -1;
                    }
                    if (targetB.structureType === STRUCTURE_EXTENSION) {
                        return 1;
                    }

                    // Then containers
                    if (targetA.structureType === STRUCTURE_CONTAINER) {
                        return -1;
                    }
                    if (targetB.structureType === STRUCTURE_CONTAINER) {
                        return 1;
                    }

                    // Then roads
                    if (targetA.structureType === STRUCTURE_ROAD) {
                        return -1;
                    }
                    if (targetB.structureType === STRUCTURE_ROAD) {
                        return 1;
                    }
                    return creep.pos.getRangeTo(targetA) - creep.pos.getRangeTo(targetB)
                });
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                roleHarvester.run(creep);
            }
        }
        else {
            //Carry on harvesting
            let containerOrStorages = creep.room.find(FIND_STRUCTURES, {
                filter: structure => (structure.structureType === STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > 0
            });
            if (containerOrStorages.length > 0) {
                screepUtilities.harvestFromContainerOrStorage(creep, creep.pos.findClosestByPath(containerOrStorages));
                return;
            } else {
                screepUtilities.harvestFromSourceInRoom(creep);
                return;
            }
        }
    }
};

module.exports = roleBuilder;