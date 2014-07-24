Engine.module('behaviors.MovementBehavior',
	[
		'input.Input',
		'behaviors.BehaviorSystem'
	],
	function (Input, BehaviorSystem) {
		'use strict';

		function MovementBehavior() {

		}

		MovementBehavior.prototype.name = 'movement';

		MovementBehavior.prototype.update = function (world, inputState, entities) {
			for (var i = 0, l = entities.length; i < l; i++) {
				var transform = entities[i].getComponent('transform');
				var motion = entities[i].getComponent('motion');
				transform.lastMotion = motion.transform.clone();
				transform.transform(motion.transform);

				var animation = entities[i].getComponent('animation');
				if (animation !== null) {
					animation.setParam('motionX', motion.transform.position.x);
					animation.setParam('motionY', motion.transform.position.y);
					animation.setParam('run', motion.run);
				}

				motion.transform.zero();
			}
		};

		return BehaviorSystem.register(MovementBehavior.prototype.name, MovementBehavior);
	});
