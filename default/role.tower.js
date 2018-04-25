const structureUtilities = require("structure.utilities");
/**
 * Created by Chaz on 23-May-17.
 */
let roleTower = {
    run: function (tower) {
        return this.defendRoom(tower) ||
            this.healInRoom(tower) ||
            this.repairInRoom(tower);
    },

    defendRoom: function (tower) {
        let hostiles = Game.rooms[tower.room.name].find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            let username = hostiles[0].owner.username;
            Game.notify('User: ' + username + ' spotted in room');
            let towers = Game.rooms[tower.room.name].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(hostiles[0]));
            return true;
        }
    },

    repairInRoom: function (tower) {
        let structures = structureUtilities.getDamagedStructures(tower.room);
        let targets = this.findValidTargets(structures);
        _.sortBy(targets, function (targetA, targetB) {
            return targetA.hits - targetB.hits
        });

        if (targets) {
            tower.repair(targets[0]);
            return true;
        }
    },

    healInRoom: function (tower) {
        _.forEach(Game.creeps, function (creep) {
            if (creep.hits < creep.hitsMax) {
                tower.heal(creep);
                return true;
            }
        });
    },

    findValidTargets(structures) {
        return _.filter(structures, function (structure) {
            let isValid = true;
            if (structure.structureType === STRUCTURE_WALL && structure.hits > 20000) {
                isValid = false;
            }
            if (structure.structureType === STRUCTURE_RAMPART && structure.hits > 20000) {
                isValid = false;
            }
            if (structure.structureType === STRUCTURE_CONTROLLER) {
                isValid = false;
            }
            return isValid
        });
    }
};

module.exports = roleTower;