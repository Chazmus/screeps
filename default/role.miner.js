const roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (!creep.memory.miningSourceId) {
            creep.memory.miningSourceId = this.getAvailableMiningSourceId(creep);
        }
        let miningSource = Game.getObjectById(creep.memory.miningSourceId);
        if (!creep.memory.containerToSitOnId && miningSource) {
            creep.memory.containerToSitOnId = this.getContainerToSitOnId(creep, miningSource);
        }
        let containerToSitOn = Game.getObjectById(creep.memory.containerToSitOnId);
        if (creep.pos.getRangeTo(containerToSitOn)) {
            creep.moveTo(containerToSitOn);
            return;
        }
        if (creep.harvest(miningSource) === ERR_NOT_IN_RANGE) {
            delete creep.memory.miningSourceId;
        }
    },

    getContainerToSitOnId: function (creep, miningSource) {
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        });
        let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        });
        containers = containers.concat(constructionSites);
        if (containers.length !== 0) {
            return miningSource.pos.findClosestByRange(containers).id;
        }
    },

    getAvailableMiningSourceId: function (creep) {
        let sources = creep.room.find(FIND_SOURCES);
        let minersInRoom = creep.room.find(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.role === "miner"
        });

        _.forEach(minersInRoom, function (miner) {
            _.remove(sources, function (source) {
                return miner.memory.miningSourceId === source.id
            })
        });
        if (sources.length !== 0) {
            return sources[0].id;
        }
    }
};

module.exports = roleMiner;