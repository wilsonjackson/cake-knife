Engine.module('cake.components.StopOnCollide',
	[],
	function () {
		'use strict';

		function StopOnCollide(collidesWith) {
			this.collidesWith = collidesWith || [];
		}

		StopOnCollide.prototype.name = 'stopOnCollide';

		return StopOnCollide;
	});
