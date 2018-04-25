const roleUpgrader = require('role.upgrader');
const screepUtilities = require('screep.utilities');

let roleRunner = {
    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.carry.energy === 0) {
            creep.memory.mode = 'pickup';
        }
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.mode = 'dropoff';
        }

        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => ((structure.structureType === STRUCTURE_STORAGE ||
                structure.structureType === STRUCTURE_CONTAINER))
        });

        let allMiners = creep.room.find(FIND_MY_CREEPS, {
            filter: miner => miner.memory.role === "miner"
        });

        let containersForMinersIds = _.map(allMiners, 'memory.containerToSitOnId');

        let pickupContainers = _.filter(containers, function (container) {
            return _.includes(containersForMinersIds, container.id)
        });

        let dropContainers = _.filter(containers, function (container) {
            return !_.includes(containersForMinersIds, container.id)
        });

        if (creep.memory.mode === 'pickup') {
            if (!creep.memory.targetPickupId) {
                creep.memory.targetPickupId = _.sample(pickupContainers).id;
            }
            let targetContainer = Game.getObjectById(creep.memory.targetPickupId);
            screepUtilities.harvestFromContainerOrStorage(creep, targetContainer);
            return
        }
        if (creep.memory.mode === 'dropoff') {
            if (creep.memory.action === 'transfer') {
                return this.transferEnergy(creep, dropContainers);
            }
            return this.fillExtensions(creep) ||
                this.fillTowers(creep) ||
                this.activateTransfer(creep);
        }
    },
    activateTransfer: function (creep) {
        creep.memory.action = 'transfer';
        return true
    },

    fillExtensions: function (creep) {
        let extensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => (structure.structureType === STRUCTURE_EXTENSION ||
                structure.structureType === STRUCTURE_SPAWN) &&
                structure.energy < structure.energyCapacity
        });

        if (extensions.length > 0) {
            let targetExtension = creep.pos.findClosestByPath(extensions);
            if (creep.transfer(targetExtension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(targetExtension, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        return false;
    },

    fillTowers: function (creep) {
        let towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_TOWER &&
                structure.energy < structure.energyCapacity - creep.carryCapacity
        });

        if (towers.length === 0) {
            return false;
        }

        towers = _.sortBy(towers, function (tower) {
            return tower.energy;
        });

        if (creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(towers[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    },

    transferEnergy: function (creep, dropContainers) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType === STRUCTURE_STORAGE ||
                structure.structureType === STRUCTURE_CONTAINER)
        });

        let fillableContainers = _.filter(dropContainers, function (container) {
            return container.store[RESOURCE_ENERGY] < (container.storeCapacity - creep.carryCapacity)
        });

        if (containers.length <= 1) {
            return creep.moveTo(creep.room.find(FIND_MY_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_SPAWN
            }));
        }

        let targetContainer = creep.pos.findClosestByRange(fillableContainers);
        if (!targetContainer) {
            roleUpgrader.run(creep);
        }
        let resultsOfTransfer = creep.transfer(targetContainer, RESOURCE_ENERGY);
        if (resultsOfTransfer === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        delete creep.memory.action;
    }
};

module.exports = roleRunner;