Engine.module('behaviors.StopOnCollideBehavior',
	[
		'behaviors.BehaviorSystem'
	],
	function (BehaviorSystem) {
		'use strict';

		function StopOnCollideBehavior() {

		}

		StopOnCollideBehavior.prototype.name = 'stopOnCollide';

		StopOnCollideBehavior.prototype.update = function (world, inputState, entities) {
			for (var i = 0, l = entities.length; i < l; i++) {
				var entity = entities[i];
				var collider = entity.getComponent('collider');
				if (collider.collisions.length === 0) {
					continue;
				}

				for (var j = 0, m = collider.collisions.length; j < m; j++) {
					var collision = collider.collisions[j];
					var otherEntity = collision.getOtherEntity(entity);
					var stopOnCollide = entity.getComponent('stopOnCollide');

					if (Engine.util.Arrays.indexOf(stopOnCollide.collidesWith, otherEntity.category) === -1) {
						continue;
					}

					var transform = entity.getComponent('transform');
					transform.translate(transform.lastMotion.position.multiply(-1));
					break;
				}
			}
		};

		return BehaviorSystem.register(StopOnCollideBehavior.prototype.name, StopOnCollideBehavior);
	});
