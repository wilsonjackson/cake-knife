Engine.module('displays.SpriteDisplay',
	[
		'displays.DisplaySystem'
	],
	function (DisplaySystem) {
		'use strict';

		function SpriteDisplay() {
		}

		SpriteDisplay.prototype.name = 'sprite';

		SpriteDisplay.prototype.render = function (world, viewport, entities) {
			var spriteComponent;
			var transform;
			for (var i = 0, l = entities.length; i < l; i++) {
				transform = entities[i].getComponent('transform');
				spriteComponent = entities[i].getComponent('sprite');
				viewport.getLayer(spriteComponent.targetLayer).getGraphics().drawSprite(
					spriteComponent.sprite,
					transform.position.add(spriteComponent.offset),
					transform.rotation);
			}
		};

		return DisplaySystem.register(SpriteDisplay.prototype.name, SpriteDisplay);
	});
