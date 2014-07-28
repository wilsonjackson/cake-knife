Engine.module('physics.Collision', function () {
	'use strict';

	/**
	 *
	 * @param {object} bodyA
	 * @param {object} bodyB
	 * @param intersection
	 * @constructor
	 */
	function Collision(bodyA, bodyB, intersection) {
		this.bodyA = bodyA;
		this.bodyB = bodyB;
		this.intersection = intersection;
	}

	Collision.prototype.getBodyWithoutProperty = function (name, value) {
		if (this.bodyA[name] !== value) {
			return this.bodyA;
		}
		if (this.bodyB[name] !== value) {
			return this.bodyB;
		}
		return null;
	};

	return Collision;
});
