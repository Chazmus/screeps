const utilities = require('utilities');
module.exports = {

    spawn: null,

    allCreeps: null,

    setSpawn: function (spawn) {
        this.spawn = spawn;
        this.allCreeps = spawn.room.find(FIND_MY_CREEPS);
    },

    /**
     * Allows the autonomous creation of screeps of a simple type (WORK CARY MOVE) up to a maximum number.
     * @param role Type of screeps to create
     * @param number How many screeps of that type to be on the board
     *
     * @returns {String}
     */
    createSimpleScreeps: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, CARRY, MOVE];

        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createSimpleMule: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createHeavyMule: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createSimpleAttackScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [MOVE, ATTACK, ATTACK];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createAttackScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, CARRY, MOVE, MOVE, ATTACK, ATTACK];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    /**
     * Allows the autonomous creation of screeps of a double carry type (WORK CARRY, CARRY, MOVE, MOVE, MOVE) up to a maximum number.
     * @param role Type of screeps to create
     * @param number How many screeps of that type to be on the board
     * @param spawn The spawn to spit the screep out of
     *
     * @returns {String}
     */
    createDoubleCarryScreeps: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, CARRY, CARRY, MOVE, MOVE, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createEpicScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, WORK];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createSuperEpicScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createTurboMinerScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, WORK, WORK, WORK, WORK, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createSimpleMinerScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, WORK, WORK, WORK, WORK, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    /**
     * Allows the autonomous creation of screeps of a double carry type (WORK CARRY, CARRY, MOVE, MOVE, MOVE) up to a maximum number.
     * @param role Type of screeps to create
     * @param number How many screeps of that type to be on the board
     *
     * @returns {String}
     */
    createDoubleWorkScreeps: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    },

    createInvaderScreep: function (role, number) {
        let screepsOfType = _.filter(this.allCreeps, (creep) => creep.memory.role === role);
        let body = [CLAIM, MOVE, CARRY, WORK];
        if (screepsOfType.length < number &&
            utilities.bodyCost(body) <= this.spawn.room.memory.energyAvailable) {
            let newName = this.spawn.createCreep(body, role + Game.time, {role: role});
            console.log('Spawning new ' + role + ': ' + newName);
        }
    }
};