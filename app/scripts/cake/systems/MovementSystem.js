Engine.module('cake.systems.MovementSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @returns {MovementSystem}
	 */
	function (System, EntityMatcher) {
		'use strict';

		function MovementSystem() {
			System.call(this, new EntityMatcher('body'));
		}

		MovementSystem.prototype = Object.create(System.prototype);

		MovementSystem.prototype.update = function () {
			var entities = this.entities;
			for (var i = 0, l = entities.length; i < l; i++) {
				var body = entities[i].getComponent('body');
				body.lastTransform = body.transform.clone();
				body.lastMotion = body.motion.clone();
				body.transform.transform(body.motion);

				var animation = entities[i].getComponent('animated');
				if (animation !== null) {
					animation.setParam('motionX', body.motion.position.x);
					animation.setParam('motionY', body.motion.position.y);
					animation.setParam('run', body.run);
				}

				body.motion.zero();
			}
		};

		return MovementSystem;
	});
