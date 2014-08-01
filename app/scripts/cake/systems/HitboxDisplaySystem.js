Engine.module('cake.systems.HitboxDisplaySystem',
	[
		'ecs.System',
		'ecs.EntityMatcher',
		'math.Vector',
		'graphics.DebugLayer'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @param {Vector} Vector
	 * @param {DebugLayer} DebugLayer
	 * @returns {HitboxDisplaySystem}
	 */
	function (System, EntityMatcher, Vector, DebugLayer) {
		'use strict';

		function HitboxDisplaySystem() {
			System.call(this, new EntityMatcher('body', 'collider'));
			DebugLayer.enable();
		}

		HitboxDisplaySystem.prototype = Object.create(System.prototype);

		HitboxDisplaySystem.prototype.render = function (game, time, viewport) {
			for (var i = 0, l = this.entities.length; i < l; i++) {
				var body = this.entities[i].getComponent('body');
				var transform = body.lastTransform.clone();
				transform.interpolate(body.transform, time.alpha);

				var position = new Vector(
						transform.position.x + 0.5,
						transform.position.y - transform.size.y + 0.5)
					.subtract(viewport.sceneOffset);
				DebugLayer.drawRect(
					position.x,
					position.y,
					transform.size.x,
					transform.size.y,
					{stroke: '#f00'});
			}
		};

		return HitboxDisplaySystem;
	});

