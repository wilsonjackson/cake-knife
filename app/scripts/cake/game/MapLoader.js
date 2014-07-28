Engine.module('cake.game.MapLoader',
	[
		'ecs.EntityFactory',
		'math.Transform',
		'math.Vector'
	],
	/**
	 *
	 * @param {EntityFactory} EntityFactory
	 * @param {Transform} Transform
	 * @param {Vector} Vector
	 * @returns {MapLoader}
	 */
	function (EntityFactory, Transform, Vector) {
		'use strict';

		EntityFactory.createEntityArchetype('mapObstacle')
			.addComponent('cake.components.Body')
			.addComponent('cake.components.Collider', 'obstacle')
			.register();

		/**
		 *
		 * @constructor
		 */
		function MapLoader() {
		}

		/**
		 *
		 * @param {Map} map
		 * @param {World} world
		 * @param {Object} game
		 */
		MapLoader.prototype.load = function (map, world, game) {
			var collisionBounds = map.getCollisionBounds();
			for (var i = 0, l = collisionBounds.length; i < l; i++) {
				var entity = EntityFactory.create('mapObstacle');
				var transform = Transform.fromRect(collisionBounds[i]);
				transform.translate(new Vector(0, transform.size.y));
				entity.getComponent('body').transform.transform(transform);
				world.addEntity(entity);
			}
			game.map = map;
		};

		return new MapLoader();
	});
