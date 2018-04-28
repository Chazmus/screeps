const screepCreator = require('screep.creator');
const utilities = require('utilities');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleForeignUpgrader = require('role.foreignupgrader');
const roleForeignBuilder = require('role.foreignbuilder');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleDefender = require('role.defender');
const roleRunner = require('role.runner');
const roleInvader = require('role.invader');
const roleMiner = require('role.miner');
const roleMineralMiner = require('role.mineralminer');
const roleSomeGuy = require('role.someguy');
const roleTower = require('role.tower');


module.exports.loop = function () {
    console.log("tick:", Game.time);

    // Clear memory
    utilities.clearMemory();

    for (const i in Game.spawns) {
        const spawn = Game.spawns[i];
        screepCreator.setSpawn(spawn);
        const allCreeps = spawn.room.find(FIND_MY_CREEPS);

        // Extinction recovery
        if (allCreeps.length < 2) {
            screepCreator.createSimpleScreeps('harvester', 2);
            continue;
        }

        // Mineral mining
        if (spawn.room.find(FIND_MY_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_LAB &&
                    structure.mineralAmount < structure.mineralCapacity
            }).length > 0) {
            screepCreator.createSuperEpicScreep('mineralMiner', 1);
        }

        // Set up screeps
        screepCreator.createSuperEpicScreep('builder', 3);
        screepCreator.createSuperEpicScreep('upgrader', 3);
        //screepCreator.createSuperEpicScreep('repairer', 2);

        //screepCreator.createEpicScreep('builder', 3);
        screepCreator.createEpicScreep('upgrader', 3);
        //screepCreator.createEpicScreep('repairer', 2);

        //screepCreator.createDoubleWorkScreeps('builder', 3);
        screepCreator.createDoubleCarryScreeps('upgrader', 3);
        //screepCreator.createDoubleWorkScreeps('repairer', 2);

        //screepCreator.createSimpleScreeps('builder', 3);
        screepCreator.createSimpleScreeps('upgrader', 3);

        //screepCreator.createSimpleScreeps('someGuy', 1);
        if (spawn.room.find(FIND_MY_STRUCTURES,
                {filter: structure => structure.structureType === STRUCTURE_TOWER}).length === 0) {
            screepCreator.createSimpleScreeps('repairer', 2);

            if (spawn.room.find(FIND_HOSTILE_CREEPS).length) {
                screepCreator.createSimpleAttackScreep('defender', 3);
            } else {
                screepCreator.createSimpleAttackScreep('defender', 1);
            }
        }

        if (spawn.room.find(FIND_MY_CREEPS, {
                filter: creep => creep.memory.role === 'miner'
            }).length > 0) {
            screepCreator.createSimpleMule('runner', 4);
        }
        //screepCreator.createSimpleScreeps('harvester', 2);

        createHarvestersOrMiners(spawn);

        //screepCreator.createAttackScreep('defender', 1);

        //screepCreator.createInvaderScreep('invader', 1);
        //screepCreator.createSuperEpicScreep('foreignUpgrader', 2);
        //screepCreator.createSuperEpicScreep('foreignBuilder', 2);
    }

    // Foreigners
    let foreignUpgraders = _.filter(Game.creeps, {memory: {role: 'foreignUpgrader'}});
    if (_.size(foreignUpgraders) < 2) {
        screepCreator.createSuperEpicScreep('foreignUpgrader', 1);
    }
    let foreignBuilders = _.filter(Game.creeps, {memory: {role: 'foreignBuilder'}});
    if (_.size(foreignBuilders) < 2) {
        screepCreator.createSuperEpicScreep('foreignBuilder', 1);
    }
    let invaders = _.filter(Game.creeps, {memory: {role: 'invader'}});
    if (_.size(invaders) < 1) {
        //screepCreator.createInvaderScreep('invader', 1)
    }


    _.forEach(Game.creeps, function (creep) {
        if (creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role === 'foreignBuilder') {
            roleForeignBuilder.run(creep);
        }
        if (creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role === 'foreignUpgrader') {
            roleForeignUpgrader.run(creep);
        }
        if (creep.memory.role === 'repairer') {
            roleRepairer.run(creep);
        }
        if (creep.memory.role === 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role === 'runner') {
            roleRunner.run(creep);
        }
        if (creep.memory.role === 'invader') {
            roleInvader.run(creep)
        }
        if (creep.memory.role === 'miner') {
            roleMiner.run(creep)
        }
        if (creep.memory.role === 'mineralMiner') {
            roleMineralMiner.run(creep)
        }
        if (creep.memory.role === 'someGuy') {
            roleSomeGuy.run(creep)
        }
    });

    _.forEach(Game.rooms, function (room) {
        room.memory.energyAvailable = room.energyAvailable;
        room.memory.energyCapacityAvailable = room.energyCapacityAvailable;
        let towers = Game.rooms[room.name].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        _.forEach(towers, function (tower) {
            roleTower.run(tower);
        });
    });

    // Helper method to create harvesters or miners depending on the rooms contents.
    function createHarvestersOrMiners(spawn) {
        let numberOfContainers = spawn.room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        }).length;

        let numberOfSources = spawn.room.find(FIND_SOURCES).length;
        let allCreeps = spawn.room.find(FIND_MY_CREEPS);

        if (spawn.room.controller.level > 1 && numberOfContainers >= numberOfSources) {
            screepCreator.createTurboMinerScreep('miner',
                numberOfContainers >= numberOfSources ? numberOfSources : numberOfContainers,
                spawn, allCreeps);
            screepCreator.createSimpleMinerScreep('miner',
                numberOfContainers >= numberOfSources ? numberOfSources : numberOfContainers,
                spawn, allCreeps);
        }
        else {
            screepCreator.createSuperEpicScreep('harvester', 3);
            screepCreator.createEpicScreep('harvester', 2);
            screepCreator.createDoubleWorkScreeps('harvester', 2);
            screepCreator.createSimpleScreeps('harvester', 3);
        }
    }

};