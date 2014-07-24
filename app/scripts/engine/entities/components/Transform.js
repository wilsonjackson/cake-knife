Engine.module('entities.components.Transform',
	[
		'math.Transform',
		'math.Vector'
	],
	function (Transform, Vector) {
		'use strict';

		function TransformComponent(w, h) {
			Transform.call(this);
			if (w !== undefined && h !== undefined) {
				this.scale(new Vector(w, h));
			}
			this.lastMotion = new Transform();
		}

		TransformComponent.prototype = Object.create(Transform.prototype);

		TransformComponent.prototype.name = 'transform';

		return TransformComponent;
	});
