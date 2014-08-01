Engine.module('cake.game.Director',
	[
		'loop.Plugin',
		'ecs.World',
		'ecs.EntityFactory',
		'maps.MapRepository',
		'cake.game.MapLoader',
		'cake.systems.AnimationSystem',
		'cake.systems.BackgroundDisplaySystem',
		'cake.systems.CameraFollowSystem',
		'cake.systems.CollideSystem',
		'cake.systems.MovementSystem',
		'cake.systems.PlayerMoveSystem',
		'cake.systems.SpriteDisplaySystem',
		'cake.systems.HitboxDisplaySystem',
		'cake.systems.StopOnCollideSystem'
	],
	/**
	 *
	 * @param {Plugin} Plugin
	 * @param {World} World
	 * @param {EntityFactory} EntityFactory
	 * @param {MapRepository} MapRepository
	 * @param {MapLoader} MapLoader
	 * @param AnimationSystem
	 * @param BackgroundDisplaySystem
	 * @param CameraFollowSystem
	 * @param CollideSystem
	 * @param MovementSystem
	 * @param PlayerMoveSystem
	 * @param SpriteDisplaySystem
	 * @param HitboxDisplaySystem
	 * @param StopOnCollideSystem
	 * @returns {Director}
	 */
	function (Plugin, World, EntityFactory, MapRepository, MapLoader, AnimationSystem, BackgroundDisplaySystem,
			  CameraFollowSystem, CollideSystem, MovementSystem, PlayerMoveSystem, SpriteDisplaySystem,
			  HitboxDisplaySystem, StopOnCollideSystem) {
		'use strict';

		function Director() {
		}

		Director.prototype = Object.create(Plugin.prototype);

		Director.prototype.start = function () {

//			EntityFactory.createEntityArchetype('yellow')
//				.addComponent('cake.components.Body', {w: 192, h: 48, x: 640, y: 288})
//				.addComponent('cake.components.Collider', 'obstacle')
//				.addComponent('cake.components.Sprite', new DebugSprite('#ff0', 192, 96))
//				.register();
//			EntityFactory.createEntityArchetype('green')
//				.addComponent('cake.components.Body', {w: 96, h: 48, x: 480, y: 480})
//				.addComponent('cake.components.Collider', 'obstacle')
//				.addComponent('cake.components.Sprite', new DebugSprite('#0f0', 96, 96))
//				.register();

			var player = EntityFactory.create('player');
			player.getComponent('body').transform.translate({x: 480, y: 768});

			var game = {};
			var world = new World(game);
			MapLoader.load(MapRepository.retrieve('test'), world, game);
			world.addSystem(new PlayerMoveSystem());
			world.addSystem(new AnimationSystem());
			world.addSystem(new MovementSystem());
			world.addSystem(new CollideSystem());
			world.addSystem(new StopOnCollideSystem());
			world.addSystem(new CameraFollowSystem());
			world.addSystem(new BackgroundDisplaySystem());
			world.addSystem(new SpriteDisplaySystem());
//			world.addSystem(new HitboxDisplaySystem());

			world.addEntity(player);
//			world.addEntity(EntityFactory.create('yellow'));
//			world.addEntity(EntityFactory.create('green'));
			Engine.setScene(world);
		};

		return new Director();
	});
