Engine.module('cake.systems.SpriteDisplaySystem',
	[
		'ecs.System',
		'ecs.EntityMatcher',
		'math.Vector'
	],
	/**
	 *
	 * @param {System} System
	 * @param {EntityMatcher} EntityMatcher
	 * @param {Vector} Vector
	 * @returns {SpriteDisplaySystem}
	 */
	function (System, EntityMatcher, Vector) {
		'use strict';

		function SpriteDisplaySystem() {
			System.call(this, new EntityMatcher('body', 'sprite'));
		}

		SpriteDisplaySystem.prototype = Object.create(System.prototype);

		SpriteDisplaySystem.prototype.render = function (game, time, viewport) {
			var spriteComponent;
			var transform;
			viewport.getLayer(0).clear();
			this.sortEntities();
			for (var i = 0, l = this.entities.length; i < l; i++) {
				var body = this.entities[i].getComponent('body');
				transform = body.lastTransform.clone();
				transform.interpolate(body.transform, time.alpha);
				var position = new Vector(Math.round(transform.position.x), Math.round(transform.position.y));
				if (false && this.entities[i].hasComponent('player')) {
					console.log('x1=' + body.transform.position.x + ', x2=' + body.lastTransform.position.x +
						', x3=' + position.x + ', alpha=' + time.alpha);
				}
				spriteComponent = this.entities[i].getComponent('sprite');
				viewport.getLayer(spriteComponent.targetLayer).getGraphics().drawSprite(
					spriteComponent.sprite,
					position.add(spriteComponent.offset),
					transform.rotation);
			}
		};

		SpriteDisplaySystem.prototype.sortEntities = function () {
			// Insertion sort — good for non-volatile data. (It lots of stuff moves around all the time, another sort
			// might be better.)
			for (var i = 1, len = this.entities.length; i < len; i++) {
				var object = this.entities[i];
				for (var j = i - 1; j >= 0; j--) {
					if (this.entities[j].getComponent('body').transform.position.y <= object.getComponent('body').transform.position.y) {
						break;
					}
					this.entities[j + 1] = this.entities[j];
				}
				this.entities[j + 1] = object;
			}
		};

		return SpriteDisplaySystem;
	});
