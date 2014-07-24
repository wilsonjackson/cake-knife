Engine.module('util.Path',
	[],
	function () {
		'use strict';

		function Path() {
		}

		Path.prototype.resolve = function (context, path) {
			var c = context.split('/');
			var p = path.split('/');
			// Pop filename
			if (c[c.length - 1].indexOf('.') !== -1) {
				c.pop();
			}
			for (var i = 0, l = p.length; i < l; i++) {
				if (p[i] === '.') {
					continue;
				}
				if (p[i] === '..') {
					c.pop();
				}
				else {
					c.push(p[i]);
				}
			}
			return c.join('/');
		};

		return new Path();
	});
