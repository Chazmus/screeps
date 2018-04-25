const screepUtilities = require('screep.utilities');

let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // If creep upgrading and is empty
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            delete creep.memory.targetSource;
            delete creep.memory.upgrading;
            creep.say('🔄 harvest');
        }
        // If creep not upgrading and is full
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            // Reset it's targetSource
            delete creep.memory.targetSource;
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            let containerStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_STORAGE ||
                        structure.structureType === STRUCTURE_CONTAINER)
                        && structure.store[RESOURCE_ENERGY] > creep.carryCapacity;
                }
            });
            let targetContainerOrStorage = creep.pos.findClosestByPath(containerStructures);
            if (targetContainerOrStorage) {
                screepUtilities.harvestFromContainerOrStorage(creep, targetContainerOrStorage, true)
            } else {
                screepUtilities.harvestFromSourceInRoom(creep);
            }
        }
    }
};

module.exports = roleUpgrader;