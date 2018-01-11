var spawn1 = Game.spawns['Spawn1']
var Creeps = []
var Harvesters = []
var Controllers = []

for(let name in Game.creeps) {
    Creeps.push(name)
}

Creeps.forEach(name => {
    let creep = Game.creeps[name]
    if(creep.memory.job === 'harvester') Harvesters.push(name)
    else if(creep.memory.job === 'controller') Controllers.push(name)
})

Controllers.forEach(name => {
    let creep = Game.creeps[name]
    if(creep.carry.energy < creep.carryCapacity) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1]);
        }
    }else {
        if(creep.upgradeController(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
        }
    }
})

Harvesters.forEach((name, index) => {
    let creep = Game.creeps[name]
    let sources = creep.room.find(FIND_SOURCES)
    if(index % 2 === 0) {
        harvestEnergy(creep, sources[0])
    }else {
        harvestEnergy(creep, sources[1])
    }
})

function harvestEnergy(creep, source) {
    if(creep.carry.energy < creep.carryCapacity) {
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }else {
        if(creep.transfer(spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn1)
        }
    }
}



if(spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY], genCreepName(), {memory: {job: 'harvester', dryRun: true}})) {
    if(i % 2 == 0) {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY], genCreepName(), {memory: {job: 'harvester'}})
    }else {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY], genCreepName(), {memory: {job: 'controller'}})
    }
}

/*
for(let name in Game.creeps) {
    let creep = Game.creeps[name]
    var sources = creep.room.find(FIND_SOURCES);

    if(creep.memory.job === 'harvester') {
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if( creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    }else if(creep.memory.job === 'controller') {
        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }else {
            if(creep.upgradeController(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller)
            }
        }
    }
}
*/

function genCreepName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
