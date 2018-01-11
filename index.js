var spawn1 = Game.spawns['Spawn1']
var Creeps = []
var Harvesters = []
var Controllers = []
var Builders = []
var MinHarvesters = 5

for(let name in Game.creeps) {
    let creep = Game.creeps[name]
    Creeps.push(creep)
}

Creeps.forEach(creep => {
    if(creep.memory.job === 'harvester') Harvesters.push(creep)
    else if(creep.memory.job === 'controller') Controllers.push(creep)
    else if(creep.memory.job === 'builder') Builders.push(creep)
})

var isSite = Creeps[0].pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

if(isSite && Builders.length === 0 && Controllers.length > 3) {
    Controllers[0].memory.job = 'builder'
    Controllers[1].memory.job = 'builder'
    Controllers[2].memory.job = 'builder'
}else if(!isSite && Builders.length === 3) {
    Builders[0].memory.job = 'controller'
    Builders[1].memory.job = 'controller'
    Builders[2].memory.job = 'controller'
}

Builders.forEach((creep, index) => {
    let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
    var sources = creep.room.find(FIND_SOURCES);
    if(constructionSite != undefined) {
        if(creep.memory.work === 'harvest') {
            if(creep.carry.energy === creep.carryCapacity) creep.memory.work = 'build'
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }else {
            if(creep.carry.energy === 0) creep.memory.work = 'harvest'
            if(creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite)
            }
        }
    }else {
        creep.memory.job = 'controller'
        creep.memory.work = 'upgrade'
    }
})

Controllers.forEach(creep => {
    var sources = creep.room.find(FIND_SOURCES);
    if(!creep.memory.work && creep.carry.energy === 0) creep.memory.work = 'harvest'

    if(creep.memory.work === 'harvest') {
        if(creep.carry.energy === creep.carryCapacity) creep.memory.work = 'upgrade'
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1]);
        }
    }else {
        if(creep.carry.enery === 0) creep.memory.work = 'harvest'
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
    if(creep.memory.work === 'harvest') {
        if(creep.carry.energy === creep.carryCapacity) creep.memory.work = 'transfer'
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source)
        }
    }else {
        if(creep.carry.energy == 0) creep.memory.work = 'harvest'
        if(creep.transfer(spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn1)
        }
    }
}

var alternate = 1

if(spawn1.energy === 300) {
    if(Harvesters.length < MinHarvesters) {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY, CARRY], genCreepName(), {memory: {job: 'harvester', work: 'harvest'}})
    }else {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY, CARRY], genCreepName(), {memory: {job: 'controller', work: 'harvest'}})
    }
}

function genCreepName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
