Engine.module('cake.systems.AnimationSystem',
	[
		'ecs.System',
		'ecs.EntityMatcher'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @returns {AnimationSystem}
	 */
	function (System, EntityMatcher) {
		'use strict';

		function AnimationSystem() {
			System.call(this, new EntityMatcher('sprite', 'animated'));
		}

		AnimationSystem.prototype = Object.create(System.prototype);

		AnimationSystem.prototype.update = function (game, time) {
			for (var i = 0, l = this.entities.length; i < l; i++) {
				var entity = this.entities[i];
				var spriteComponent = entity.getComponent('sprite');
				spriteComponent.sprite = entity.getComponent('animated').nextFrame(time.ticks).sprite;
			}
		};

		return AnimationSystem;
	});
