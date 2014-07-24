Engine.module('behaviors.CollideBehavior',
	[
		'physics.CollisionDetector',
		'behaviors.BehaviorSystem'
	],
	function (CollisionDetector, BehaviorSystem) {
		'use strict';

		function CollideBehavior() {
			this.collisionDetector = new CollisionDetector();
		}

		CollideBehavior.prototype.name = 'collide';

		CollideBehavior.prototype.update = function (world, inputState, entities) {
			var i, l = entities.length;

			for (i = 0; i < l; i++) {
				entities[i].getComponent('collider').collisions = [];
			}

			this.collisionDetector.detectCollisions(entities, function (collision) {
				collision.entityA.getComponent('collider').collisions.push(collision);
				collision.entityB.getComponent('collider').collisions.push(collision);
			});
		};

		return BehaviorSystem.register(CollideBehavior.prototype.name, CollideBehavior);
	});
