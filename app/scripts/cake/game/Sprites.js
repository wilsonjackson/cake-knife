Engine.module('cake.game.Sprites',
	[
		'graphics.sprite.SpriteRepository'
	],
	function (SpriteRepository/*, FontSprite, BoxSprite*/) {
		'use strict';

		SpriteRepository.createSpriteSheetBuilder()
			.withName('littlepants')
			.usingImage('sprites/pantstest.png')
			.withGridSize(96, 96)
//			.atPosition(5, 4).define('aero/the-extended-farewell', [14, 0, 8, 1])
			.build();
	});
