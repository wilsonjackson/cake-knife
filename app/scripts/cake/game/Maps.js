Engine.module('cake.game.Maps',
	[
		'maps.MapRepository'
	],
	function (MapRepository) {
		'use strict';

		MapRepository.addTiledJson('test', 'maps/test.json');
	});
