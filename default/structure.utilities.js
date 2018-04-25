module.exports = {

    getDamagedStructures: function getDamagedStructures(room) {

        return Game.rooms[room.name].find(FIND_STRUCTURES, {
            filter: structure => structure.hits < structure.hitsMax
        });
    },

    getAllStructures: function getAllStructures(room) {
        return Game.rooms[room.name].find(FIND_STRUCTURES);
    }
};