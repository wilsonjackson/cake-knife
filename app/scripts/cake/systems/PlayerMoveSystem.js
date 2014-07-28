Engine.module('cake.systems.PlayerMoveSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher',
		'math.Vector',
		'input.Input'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @param {Vector} Vector
	 * @param {Input} Input
	 * @returns {PlayerMoveSystem}
	 */
	function (System, EntityMatcher, Vector, Input) {
		'use strict';

		function PlayerMoveSystem() {
			System.call(this, new EntityMatcher('player', 'body'));
			this.lastMovement = new Vector(0, 0);
		}

		PlayerMoveSystem.prototype = Object.create(System.prototype);

		PlayerMoveSystem.prototype.update = function (game, time, inputState) {
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

			for (var i = 0, l = this.entities.length; i < l; i++) {
				var body = this.entities[i].getComponent('body');
				var walk = inputState.isDown(Input.TOGGLE1);
				var speed = walk ? body.walkSpeed : body.runSpeed;
				body.motion.translate(movement.multiply(speed));
				body.run = !walk;
			}

			this.lastMovement = movement;
		};

		return PlayerMoveSystem;
	});
