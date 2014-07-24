Engine.module('cake.entity.LittlePants',
	[
		'entities.EntityManager',
		'graphics.sprite.SpriteRepository',
		'graphics.animation.Animation',
		'entities.components.Transform',
		'entities.components.Sprite',
		'entities.components.Collider',
		'cake.game.Sprites'
	],
	/**
	 *
	 * @param EntityManager
	 * @param {Animation} Animation
	 * @param SpriteRepository
	 */
	function (EntityManager, SpriteRepository, Animation) {
		'use strict';

		var spriteSheet = SpriteRepository.retrieveSheet('littlepants');

		function standardAnimationTransitions(stateMachine, params) {
			var action = params.motionX === 0 && params.motionY === 0 ? 'idle' : params.run ? 'run' : 'walk';
			if (params.motionY < 0) {
				stateMachine.direction = 'n';
			}
			else if (params.motionY > 0) {
				stateMachine.direction = 's';
			}
			else if (params.motionX < 0) {
				stateMachine.direction = 'w';
			}
			else if (params.motionX > 0) {
				stateMachine.direction = 'e';
			}
			if (action && stateMachine.direction) {
				stateMachine.changeState(action + '-' + stateMachine.direction);
			}
		}

		var animations = {};
		function addAnimation(name, animation) {
			animations[name] = {
				update: standardAnimationTransitions,
				enter: function (stateMachine) {
					animation.reset();
					stateMachine.setAnimation(animation);
				}
			};
		}

		addAnimation('idle-n', new Animation()
			.setDefaultDuration(5)
			.addFrames([spriteSheet.position(0, 2)]));
		addAnimation('idle-s', new Animation()
			.setDefaultDuration(5)
			.addFrames([spriteSheet.position(0, 1)]));
		addAnimation('idle-w', new Animation()
			.setDefaultDuration(5)
			.addFrames([spriteSheet.position(0, 4)]));
		addAnimation('idle-e', new Animation()
			.setDefaultDuration(5)
			.addFrames([spriteSheet.position(0, 3)]));
		addAnimation('walk-n', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(5, 2), spriteSheet.position(6, 2), spriteSheet.position(7, 2), spriteSheet.position(8, 2)]));
		addAnimation('walk-s', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(5, 1), spriteSheet.position(6, 1), spriteSheet.position(7, 1), spriteSheet.position(8, 1)]));
		addAnimation('walk-w', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(5, 4), spriteSheet.position(6, 4), spriteSheet.position(7, 4), spriteSheet.position(8, 4)]));
		addAnimation('walk-e', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(5, 3), spriteSheet.position(6, 3), spriteSheet.position(7, 3), spriteSheet.position(8, 3)]));
		addAnimation('run-n', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(1, 2), spriteSheet.position(2, 2), spriteSheet.position(3, 2), spriteSheet.position(4, 2)]));
		addAnimation('run-s', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(1, 1), spriteSheet.position(2, 1), spriteSheet.position(3, 1), spriteSheet.position(4, 1)]));
		addAnimation('run-w', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(1, 4), spriteSheet.position(2, 4), spriteSheet.position(3, 4), spriteSheet.position(4, 4)]));
		addAnimation('run-e', new Animation()
			.setDefaultDuration(7)
			.addFrames([spriteSheet.position(1, 3), spriteSheet.position(2, 3), spriteSheet.position(3, 3), spriteSheet.position(4, 3)]));
		// SPINZ
//		addAnimation('run-n', new Animation()
//			.setDefaultDuration(5)
//			.addFrames([spriteSheet.position(2, 1), spriteSheet.position(2, 2), spriteSheet.position(2, 3), spriteSheet.position(2, 4)]));
//		addAnimation('run-s', new Animation()
//			.setDefaultDuration(5)
//			.addFrames([spriteSheet.position(1, 1), spriteSheet.position(1, 2), spriteSheet.position(1, 3), spriteSheet.position(1, 4)]));
//		addAnimation('run-w', new Animation()
//			.setDefaultDuration(5)
//			.addFrames([spriteSheet.position(4, 1), spriteSheet.position(4, 2), spriteSheet.position(4, 3), spriteSheet.position(4, 4)]));
//		addAnimation('run-e', new Animation()
//			.setDefaultDuration(5)
//			.addFrames([spriteSheet.position(3, 1), spriteSheet.position(3, 2), spriteSheet.position(3, 3), spriteSheet.position(3, 4)]));

		EntityManager.createType('player')
			.category('player')
			.addComponent('entities.components.Motion')
			.addComponent('entities.components.Transform', 48, 40)
			.addComponent('entities.components.Sprite', null, -24, 8)
			.addComponent('entities.components.Animation', animations, 'idle-s')
			.addComponent('entities.components.Collider', ['obstacle'])
			.addComponent('entities.components.StopOnCollide', ['obstacle'])
			.addBehavior('playerMove')
			.addBehavior('movement')
			.addBehavior('collide')
			.addBehavior('stopOnCollide')
			.addBehavior('animation')
			.addDisplay('cameraFollow')
			.addDisplay('sprite')
			.build();
	});
