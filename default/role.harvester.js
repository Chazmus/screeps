var roleUpgrader = require('role.upgrader');
var screepUtilities = require('screep.utilities');

let roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // If creep is in the middle of upgrading... carry on
        if (creep.memory.upgrading) {
            roleUpgrader.run(creep);
            return;
        }
        if (creep.carry.energy === 0) {
            creep.memory.harvesting = true;
        }
        // if creep is harvesting, carry on
        if (creep.memory.harvesting) {
            if (creep.carry.energy === creep.carryCapacity) {
                delete creep.memory.harvesting;
                return;
            }
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

        // Creep needs to drop off
        delete creep.memory.targetSource;
        // Find structures to fill up
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN)
                    //|| structure.structureType === STRUCTURE_TOWER)
                    && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length === 0) {
            // drop in container
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType === STRUCTURE_STORAGE &&
                        structure.energy < structure.energyCapacity;
                }
            });
        }

        if (targets.length > 0) {
            let target = creep.pos.findClosestByPath(targets);
            // Has something to drop off to
            let result = creep.transfer(target, RESOURCE_ENERGY);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (result === OK) {
                if (creep.carry.energy === 0) {
                    creep.memory.harvesting = true;
                    return;
                }
                return;
            }
        } else {
            // Nothing to drop, so turn into an upgrader;
            roleUpgrader.run(creep);
        }
    }
};

module.exports = roleHarvester;