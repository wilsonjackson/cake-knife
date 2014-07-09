/* jshint bitwise: false */
Engine.module('physics.NodeCategory', function () {
	'use strict';

	function NodeCategory(value, id) {
		this.value = value;
		this.id = id;
	}

	NodeCategory.prototype.isA = function (type) {
		return !!(this.value & type.value);
	};

	NodeCategory.prototype.toString = function () {
		return 'NodeCategory(id=' + this.id + ', value=' + this.value + ')';
	};

	var nextType = 1;
	var types = {};

	NodeCategory.add = function (id/*, parents...*/) {
		var type = nextType;
		for (var i = 1, len = arguments.length; i < len; i++) {
			type |= arguments[i].value;
		}
		nextType = nextType << 1;
		return (types[id] = new NodeCategory(type, id));
	};

	NodeCategory.retrieve = function (id) {
		return types[id];
	};

	NodeCategory.retrieveMatching = function (type) {
		var matching = [];
		for (var i in types) {
			//noinspection JSUnfilteredForInLoop
			if (type.isA(types[i])) {
				matching.push(type);
			}
		}
		return matching;
	};

	NodeCategory.ACTOR = NodeCategory.add('actor');
	NodeCategory.PLAYER = NodeCategory.add('player', NodeCategory.ACTOR);
	NodeCategory.ENEMY = NodeCategory.add('enemy', NodeCategory.ACTOR);
	NodeCategory.NPC = NodeCategory.add('npc', NodeCategory.ACTOR);
	NodeCategory.OBSTACLE = NodeCategory.add('obstacle');
	NodeCategory.WALL = NodeCategory.add('wall', NodeCategory.OBSTACLE);
	NodeCategory.EDGE = NodeCategory.add('edge', NodeCategory.OBSTACLE);
	NodeCategory.ITEM = NodeCategory.add('item');
	NodeCategory.PROJECTILE = NodeCategory.add('projectile');
	NodeCategory.DECORATION = NodeCategory.add('decoration');

	return NodeCategory;
});
