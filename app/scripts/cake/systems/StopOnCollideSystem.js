Engine.module('cake.systems.StopOnCollideSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @returns {StopOnCollideSystem}
	 */
	function (System, EntityMatcher) {
		'use strict';

		function StopOnCollideSystem() {
			System.call(this, new EntityMatcher('collider', 'stopOnCollide', 'body'));
		}

		StopOnCollideSystem.prototype = Object.create(System.prototype);

		StopOnCollideSystem.prototype.update = function () {
			for (var i = 0, l = this.entities.length; i < l; i++) {
				var entity = this.entities[i];
				var collider = entity.getComponent('collider');
				if (collider.collisions.length === 0) {
					continue;
				}

				for (var j = 0, m = collider.collisions.length; j < m; j++) {
					var collision = collider.collisions[j];
					var otherEntity = collision.getBodyWithoutProperty('entity', entity).entity;
					var otherEntityCategory = otherEntity.getComponent('collider').category;
					var stopOnCollide = entity.getComponent('stopOnCollide');

					if (Engine.util.Arrays.indexOf(stopOnCollide.collidesWith, otherEntityCategory) === -1) {
						continue;
					}

					var body = entity.getComponent('body');
					body.transform.translate(body.lastMotion.position.multiply(-1));
					break;
				}
			}
		};

		return StopOnCollideSystem;
	});
