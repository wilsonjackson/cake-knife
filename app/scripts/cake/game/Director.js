Engine.module('cake.game.Director',
	[
		'loop.Plugin',
		'world.World',
		'entities.EntityManager',
		'behaviors.BehaviorSystem',
		'displays.DisplaySystem',
		'graphics.sprite.DebugSprite',
		'world.maps.MapRepository'
	],
	/**
	 *
	 * @param {Plugin} Plugin
	 * @param {World} World
	 * @param {EntityManager} EntityManager
	 * @param {BehaviorSystem} BehaviorSystem
	 * @param {DisplaySystem} DisplaySystem
	 * @param {DebugSprite} DebugSprite
	 * @param {MapRepository} MapRepository
	 * @returns {Director}
	 */
	function (Plugin, World, EntityManager, BehaviorSystem, DisplaySystem, DebugSprite, MapRepository) {
		'use strict';

		function Director() {
		}

		Director.prototype = Object.create(Plugin.prototype);

		Director.prototype.start = function () {
			BehaviorSystem.add('playerMove', 10);
			BehaviorSystem.add('animation', 8);
			BehaviorSystem.add('movement', 5);
			BehaviorSystem.add('collide', 4);
			BehaviorSystem.add('stopOnCollide', 3);
			DisplaySystem.add('cameraFollow');
			DisplaySystem.add('background');
			DisplaySystem.add('sprite');
//			DisplaySystem.add('hitbox');

			EntityManager.createType('yellow')
				.category('obstacle')
				.addComponent('entities.components.Transform', 192, 48)
				.addComponent('entities.components.Collider')
				.addComponent('entities.components.Sprite', new DebugSprite('#ff0', 192, 96))
				.addBehavior('collide')
				.addDisplay('sprite')
				.build();
			EntityManager.createType('green')
				.category('obstacle')
				.addComponent('entities.components.Transform', 96, 48)
				.addComponent('entities.components.Collider')
				.addComponent('entities.components.Sprite', new DebugSprite('#0f0', 96, 96))
				.addBehavior('collide')
				.addDisplay('sprite')
				.build();

			var player = EntityManager.create('player');
			player.getComponent('transform').translate({x: 96, y: 192});

			var yellow = EntityManager.create('yellow');
			yellow.getComponent('transform').translate({x: 640, y: 288});

			var green = EntityManager.create('green');
			green.getComponent('transform').translate({x: 480, y: 480});

			var world = new World();
//			world.loadMap({
//				width: 16,
//				tileSize: 96,
//				terrain: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 3, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
//				entities: []
//			});
			world.addEntity(player);
			world.addEntity(yellow);
			world.addEntity(green);
			MapRepository.retrieve('test').load(world);
			Engine.setScene(world);
		};

		return new Director();
	});
