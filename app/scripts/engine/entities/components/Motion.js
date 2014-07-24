Engine.module('entities.components.Motion',
	[
		'math.Transform'
	],
	function (Transform) {
		'use strict';

		function Motion() {
			this.runSpeed = 5;
			this.walkSpeed = 3;
			this.transform = new Transform();
			this.run = false;
		}

		Motion.prototype.name = 'motion';

		return Motion;
	});
