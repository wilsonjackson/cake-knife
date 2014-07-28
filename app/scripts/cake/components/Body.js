Engine.module('cake.components.Body',
	[
		'math.Transform',
		'math.Vector'
	],
	/**
	 *
	 * @param {Transform} Transform
	 * @param {Vector} Vector
	 * @returns {BodyComponent}
	 */
	function (Transform, Vector) {
		'use strict';

		function BodyComponent(config) {
			config = config || {};
			this.transform = new Transform();
			this.lastTransform = this.transform;
			if (config.w !== undefined && config.h !== undefined) {
				this.transform.scale(new Vector(config.w, config.h));
			}
			if (config.x && config.y) {
				this.transform.translate(new Vector(config.x, config.y));
			}

			this.runSpeed = config.runSpeed || 5;
			this.walkSpeed = config.walkSpeed || 3;
			this.run = false;

			this.motion = new Transform();
			this.lastMotion = new Transform();
		}

		BodyComponent.prototype.name = 'body';

		return BodyComponent;
	});
