Engine.module('behaviors.AnimationBehavior',
	[
		'behaviors.BehaviorSystem'
	],
	function (BehaviorSystem) {
		'use strict';

		function AnimationBehavior() {

		}

		AnimationBehavior.prototype.name = 'animation';

		AnimationBehavior.prototype.update = function (world, inputState, entities) {
			for (var i = 0, l = entities.length; i < l; i++) {
				var entity = entities[i];
				var spriteComponent = entity.getComponent('sprite');
				spriteComponent.sprite = entity.getComponent('animation').nextFrame().sprite;
			}
		};

		return BehaviorSystem.register(AnimationBehavior.prototype.name, AnimationBehavior);
	});
