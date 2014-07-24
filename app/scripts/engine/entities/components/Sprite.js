Engine.module('entities.components.Sprite',
	[
		'math.Vector',
		'graphics.sprite.SpriteRepository',
		'graphics.Viewport'
	],
	function (Vector, SpriteRepository, Viewport) {
		'use strict';

		function Sprite(sprite, offsetX, offsetY, targetLayer) {
			this.sprite = typeof sprite === 'string' ? SpriteRepository.retrieve(sprite) : sprite;
			this.offset = new Vector(offsetX || 0, offsetY || 0);
			this.targetLayer = targetLayer || Viewport.LAYER_MAIN;
		}

		Sprite.prototype.name = 'sprite';

		return Sprite;
	});
