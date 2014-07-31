Engine.module('maps.MapWall',
	[
		'math.Vector',
		'math.BoundingRect',
		'maps.MapNode'
	],
	/**
	 *
	 * @param {Vector} Vector
	 * @param {BoundingRect} BoundingRect
	 * @param {MapNode} MapNode
	 * @returns {MapWall}
	 */
	function (Vector, BoundingRect, MapNode) {
		'use strict';

		/**
		 *
		 * @param {string} axis
		 * @constructor
		 */
		function MapWall(axis) {
			this.axis = axis;
			this.nodes = [];
		}

		MapWall.prototype.addNode = function (node) {
			this.nodes[this.nodes.length] = node;
		};

		MapWall.prototype.removeNode = function (node) {
			// Intentionally not using remove to preserve node order (and this doesn't need to be that fast)
			var i = Engine.util.Arrays.indexOf(this.nodes, node);
			this.nodes.splice(i, 1);
		};

		MapWall.prototype.isMiddleNode = function (node) {
			var i = Engine.util.Arrays.indexOf(this.nodes, node);
			return i !== 0 && i !== this.nodes.length - 1;
		};

		MapWall.prototype.createBoundingRect = function (tileWidth) {
			var size = new Vector(
					this.axis === MapNode.AXIS_X ? this.nodes.length : 1,
					this.axis === MapNode.AXIS_Y ? this.nodes.length : 1);
			return new BoundingRect(this.nodes[0].position.multiply(tileWidth), size.multiply(tileWidth));
		};

		MapWall.prototype.toString = function () {
			var start = this.nodes.length > 0 ? this.nodes[0].position : null;
			return 'MapWall(axis=' + this.axis + ', length=' + this.nodes.length + ', start=' + start + ')';
		};

		return MapWall;
	});
