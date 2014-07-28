Engine.module('cake.systems.CollideSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher',
		'physics.CollisionDetector',
		'math.Vector'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @param {CollisionDetector} CollisionDetector
	 * @param {Vector} Vector
	 * @returns {CollideSystem}
	 */
	function (System, EntityMatcher, CollisionDetector, Vector) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function CollideSystem() {
			System.call(this, new EntityMatcher('collider', 'body'));
			this.collisionDetector = new CollisionDetector();
		}

		CollideSystem.prototype = Object.create(System.prototype);

		CollideSystem.prototype.update = function () {
			var i, l = this.entities.length;

			for (i = 0; i < l; i++) {
				this.entities[i].getComponent('collider').collisions = [];
			}

			this.collisionDetector.detectCollisions(wrapEntities(this.entities), function (collision) {
				collision.bodyA.entity.getComponent('collider').collisions.push(collision);
				collision.bodyB.entity.getComponent('collider').collisions.push(collision);
			});
		};

		function wrapEntities(entities) {
			var wrapped = [];
			for (var i = 0, l = entities.length; i < l; i++) {
				var entity = entities[i];
				var collider = entity.getComponent('collider');
				var transform = entity.getComponent('body').transform;
				var bounds = transform.getBounds();
				// Adjust bounds to a top/left coordinate system
				bounds.move(new Vector(0, -bounds.height()));
				wrapped.push({
					entity: entity,
					id: entity.id,
					bounds: bounds,
					category: collider.category,
					collidesWith: collider.collidesWith
				});
			}
			return wrapped;
		}

		return CollideSystem;
	});
