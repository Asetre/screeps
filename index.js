var spawn1 = Game.spawns['Spawn1']
var Creeps = []
var Harvesters = []
var Controllers = []

for(let name in Game.creeps) {
    let creep = Game.creeps[name]
    Creeps.push(creep)
}

Creeps.forEach(creep => {
    if(creep.memory.job === 'harvester') Harvesters.push(creep)
    else if(creep.memory.job === 'controller') Controllers.push(creep)
})

if(Controllers.length < 4 && Harvesters.length > 4) {
    let changed = Harvesters.slice(0, 3)
    changed.forEach(creep => {
        creep.memory.job = 'controller'
    })
}else if(Harvesters.length > 8) {
    let changed = Harvesters.slice(0, 6)
    changed.forEach(creep => {
        creep.memory.job = 'controller'
    })
}


Controllers.forEach(creep => {
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

Harvesters.forEach((creep, index) => {
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

function genCreepName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
