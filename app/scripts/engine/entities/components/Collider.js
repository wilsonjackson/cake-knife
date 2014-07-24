Engine.module('entities.components.Collider',
	[],
	function () {
		'use strict';

		function Collider(collidesWith) {
			this.collidesWith = collidesWith || [];
			this.collisions = [];
		}

		Collider.prototype.name = 'collider';

		return Collider;
	});
