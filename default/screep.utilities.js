/**
 * Created by Chaz on 23-May-17.
 */
let screepUtilities = {

    getRandomSource: function (sources) {
        return sources[Math.floor(Math.random() * sources.length)];
    },
    getFullestSource: function (sources) {
        return _.sortBy(sources, function (source) {
            return source.energy
        })[sources.length - 1];
    },
    harvestFromContainerOrStorage: function (creep, containerOrStorage, ignoreDropped) {
        if (!ignoreDropped) {
            let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => resource.resourceType === RESOURCE_ENERGY
            });
            if (droppedEnergies.length > 0 && creep.pos.findClosestByPath(droppedEnergies)
                && creep.pos.findClosestByPath(droppedEnergies).amount >= creep.carryCapacity
            ) {
                return this.collectFromClosestDroppedResource(creep, droppedEnergies);
            }
        }
        if (creep.withdraw(containerOrStorage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            return creep.moveTo(containerOrStorage);
        }
    },

    collectFromClosestDroppedResource: function (creep, droppedEnergies) {
        let targetEnergy = creep.pos.findClosestByPath(droppedEnergies);
        let pickupResult = creep.pickup(targetEnergy);
        if (pickupResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return;
    },

    harvestFromSourceInRoom: function (creep) {
        let sources = creep.room.find(FIND_SOURCES,
            {filter: object => object.energy > 0});
        let targetSourceId = creep.memory.targetSource;
        // If creep has no target source set, set a random one from the room
        if (!targetSourceId) {
            let droppedEnergies = creep.room.find(FIND_DROPPED_RESOURCES, {filter: resource => resource.resourceType === RESOURCE_ENERGY});
            if (droppedEnergies.length > 0) {
                return this.collectFromClosestDroppedResource(creep, droppedEnergies);
            }
            if (sources.length > 0) {
                targetSourceId = this.getRandomSource(sources).id;
                creep.memory.targetSource = targetSourceId;
            }
        }
        // Harvest, or move towards target if not in range
        let targetSource = Game.getObjectById(targetSourceId);
        let harvestResult = creep.harvest(targetSource);
        if (harvestResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(targetSource, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if (harvestResult === ERR_NOT_ENOUGH_RESOURCES) {
            delete creep.memory.targetSource;
        }
    },
};

module.exports = screepUtilities;