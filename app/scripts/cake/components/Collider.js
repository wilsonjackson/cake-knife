Engine.module('cake.components.Collider',
	[],
	function () {
		'use strict';

		function Collider(category, collidesWith) {
			this.category = category;
			this.collidesWith = collidesWith || [];
			this.collisions = [];
		}

		Collider.prototype.name = 'collider';

		return Collider;
	});
