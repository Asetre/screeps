/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var spawn1 = Game.spawns['Spawn1'];
var Creeps = [];
var Harvesters = [];
var Controllers = [];
var Builders = [];
var MinHarvesters = 5;

for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    Creeps.push(creep);
}

Creeps.forEach(function (creep) {
    if (creep.memory.job === 'harvester') Harvesters.push(creep);else if (creep.memory.job === 'controller') Controllers.push(creep);
});

var site = Creeps[0].pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

if (Controllers.length > 4 && site != undefined) {
    Builders = Controllers.splice(0, 3);
}

Builders.forEach(function (creep, index) {
    var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    var sources = creep.room.find(FIND_SOURCES);
    if (constructionSite != undefined) {
        if (creep.memory.work === 'harvest') {
            if (creep.carry.energy === creep.carryCapacity) creep.memory.work = 'build';
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        } else {
            if (creep.carry.energy === 0) creep.memory.work = 'harvest';
            if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.moveTo(constructionSite);
            }
        }
    } else {
        creep.memory.job = 'controller';
        Builders.splice(index, 1);
    }
});

Controllers.forEach(function (creep) {
    var sources = creep.room.find(FIND_SOURCES);
    if (!creep.memory.work && creep.carry.energy === 0) creep.memory.work = 'harvest';

    if (creep.memory.work === 'harvest') {
        if (creep.carry.energy === creep.carryCapacity) creep.memory.work = 'upgrade';
        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1]);
        }
    } else {
        if (creep.carry.enery === 0) creep.memory.work = 'harvest';
        if (creep.upgradeController(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
});

Harvesters.forEach(function (creep, index) {
    var sources = creep.room.find(FIND_SOURCES);
    if (index % 2 === 0) {
        harvestEnergy(creep, sources[0]);
    } else {
        harvestEnergy(creep, sources[1]);
    }
});

function harvestEnergy(creep, source) {
    if (creep.memory.job === 'harvest') {
        if (creep.carry.energy === creep.carryCapacity) creep.memory.job = 'transfer';
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    } else {
        if (creep.carry.energy === 0) creep.memory.job = 'harvest';
        if (creep.transfer(spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn1);
        }
    }
}

var alternate = 1;

if (spawn1.energy === 300) {
    if (Harvesters.length < MinHarvesters) {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY, CARRY], genCreepName(), { memory: { job: 'harvester' } });
    } else {
        spawn1.spawnCreep([MOVE, MOVE, WORK, CARRY, CARRY], genCreepName(), { memory: { job: 'controller', work: 'harvest' } });
    }
}

function genCreepName() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }return text;
}

/***/ })
/******/ ]);