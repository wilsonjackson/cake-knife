Engine.module('behaviors.PlayerMoveBehavior',
	[
		'math.Vector',
		'input.Input',
		'behaviors.BehaviorSystem'
	],
	function (Vector, Input, BehaviorSystem) {
		'use strict';

		function PlayerMoveBehavior() {
			this.lastMovement = new Vector(0, 0);
		}

		PlayerMoveBehavior.prototype.name = 'playerMove';

		PlayerMoveBehavior.prototype.update = function (world, inputState, entities) {
			// A newly-pressed button takes precedence
			var movement = inputState.isPressed(Input.UP) && new Vector(0, -1) ||
				inputState.isPressed(Input.DOWN) && new Vector(0, 1) ||
				inputState.isPressed(Input.LEFT) && new Vector(-1, 0) ||
				inputState.isPressed(Input.RIGHT) && new Vector(1, 0);

			if (!movement) {
				movement = this.lastMovement.y < 0 && inputState.isDown(Input.UP) ||
					this.lastMovement.y > 0 && inputState.isDown(Input.DOWN) ||
					this.lastMovement.x < 0 && inputState.isDown(Input.LEFT) ||
					this.lastMovement.x > 0 && inputState.isDown(Input.RIGHT) ? this.lastMovement : new Vector(0, 0);
			}

			for (var i = 0, l = entities.length; i < l; i++) {
				var motionComponent = entities[i].getComponent('motion');
				var walk = inputState.isDown(Input.TOGGLE1);
				var speed = walk ? motionComponent.walkSpeed : motionComponent.runSpeed;
				motionComponent.transform.translate(movement.multiply(speed));
				motionComponent.run = !walk;
			}

			this.lastMovement = movement;
		};

		return BehaviorSystem.register(PlayerMoveBehavior.prototype.name, PlayerMoveBehavior);
	});
