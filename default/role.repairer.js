const structureUtilities = require('structure.utilities');
const roleBuilder = require('role.builder');
const screepUtilities = require('screep.utilities');

let roleRepairer = {

    /** @param {Creep} creep **/
    run: function (creep) {
        // If creep is harvesting, continue
        if (creep.memory.harvest === true) {
            if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.harvest = false;
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

        // Not harvesting, repair stuff.
        let targets = structureUtilities.getDamagedStructures(creep.room);

        targets = targets.filter(function (target) {
            return !((target.structureType === 'rampart')
                || (target.structureType === 'constructedWall'));
        });
        let target = creep.pos.findClosestByPath(targets);
        if (target) {
            if (creep.carry.energy === 0) {
                creep.memory.harvest = true;
                return;
            }
            if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
        } else {
            roleBuilder.run(creep);
        }
    }
};

module.exports = roleRepairer;