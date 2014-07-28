Engine.module('cake.systems.HitboxDisplaySystem',
	[
		'ecs.System',
		'ecs.EntityMatcher'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @returns {HitboxDisplaySystem}
	 */
	function (System, EntityMatcher) {
		'use strict';

		function HitboxDisplaySystem() {
			System.call(this, new EntityMatcher('body', 'collider'));
		}

		HitboxDisplaySystem.prototype = Object.create(System.prototype);

		HitboxDisplaySystem.prototype.render = function (game, time, viewport) {
			var layer = viewport.getLayer(0);
			for (var i = 0, l = this.entities.length; i < l; i++) {
				var body = this.entities[i].getComponent('body');
				var transform = body.lastTransform.clone();
				transform.interpolate(body.transform, time.alpha);
				layer.getGraphics().drawRect(
						transform.position.x + 0.5,
						transform.position.y + 0.5,
					transform.size.x,
					transform.size.y,
					{stroke: '#f00'});
			}
		};

		return HitboxDisplaySystem;
	});

