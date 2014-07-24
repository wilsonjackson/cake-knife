Engine.module('physics.Collision', function () {
	'use strict';

	/**
	 *
	 * @param {Entity} entityA
	 * @param {Entity} entityB
	 * @param intersection
	 * @constructor
	 */
	function Collision(entityA, entityB, intersection) {
		this.entityA = entityA;
		this.entityB = entityB;
		this.intersection = intersection;
	}

	Collision.prototype.getOtherEntity = function (entity) {
		return this.entityA === entity ? this.entityB : this.entityA;
	};

	return Collision;
});
