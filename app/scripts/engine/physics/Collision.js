Engine.module('physics.Collision', function () {
	'use strict';

	function Collision(node, intersection) {
		this.node = node;
		this.intersection = intersection;
	}

	return Collision;
});
