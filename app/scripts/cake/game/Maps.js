Engine.module('cake.game.Maps',
	[
		'world.maps.MapRepository'
	],
	function (MapRepository) {
		'use strict';

		MapRepository.addTiledJson('test', 'maps/test.json');

//		addTerrainSprite('tiles/level1', 'tiles/test.png', 96, 10, 10, []);
	});
