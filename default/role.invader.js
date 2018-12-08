const roleDefender = {

    TARGET_ROOM: "W8N4",

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.room.name !== this.TARGET_ROOM) {
            const exitDir = Game.map.findExit(creep.room, this.TARGET_ROOM);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        } else {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleDefender;