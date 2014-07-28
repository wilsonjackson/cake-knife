Engine.module('maps.MapNode',
	[
		'math.Vector'
	],
	/**
	 *
	 * @param {Vector} Vector
	 * @returns {MapNode}
	 */
	function (Vector) {
		'use strict';

		var AXIS_X = 'x';
		var AXIS_Y = 'y';

		/**
		 *
		 * @param {Vector} position
		 * @param {MapGrid} grid
		 * @constructor
		 */
		function MapNode(position, grid) {
			// check top node, then left node for existing wall and add
			// if either is missing, initialize new wall(s)
			this.position = position;
			this.grid = grid;
			this.walls = {};

			var above = grid.getNodeAt(position.subtract(new Vector(0, 1)));
			this.walls[AXIS_Y] = above ? above.getWall(AXIS_Y) : grid.createWall(AXIS_Y);
			this.walls[AXIS_Y].addNode(this);

			var left = grid.getNodeAt(position.subtract(new Vector(1, 0)));
			this.walls[AXIS_X] = left ? left.getWall(AXIS_X) : grid.createWall(AXIS_X);
			this.walls[AXIS_X].addNode(this);

			var right = grid.getNodeAt(position.add(new Vector(1, 0)));
			if (right) {
				this.grid.mergeWalls(this.walls[AXIS_X], right.getWall(AXIS_X));
			}
			var bottom = grid.getNodeAt(position.add(new Vector(0, 1)));
			if (bottom) {
				this.grid.mergeWalls(this.walls[AXIS_Y], bottom.getWall(AXIS_Y));
			}
		}

		MapNode.AXIS_X = AXIS_X;
		MapNode.AXIS_Y = AXIS_Y;

		MapNode.prototype.getWall = function (axis) {
			return this.walls[axis];
		};

		MapNode.prototype.setWall = function (wall) {
			this.walls[wall.axis].removeNode(this);
			this.walls[wall.axis] = wall;
			wall.addNode(this);
		};

		MapNode.prototype.removeFromWall = function (axis) {
			this.walls[axis].removeNode(this);
			delete this.walls[axis];
		};

		MapNode.prototype.pickWall = function () {
			if (this.walls[AXIS_Y].isMiddleNode(this)) {
				this.removeFromWall(AXIS_X);
				return;
			}
			if (this.walls[AXIS_X].isMiddleNode(this)) {
				this.removeFromWall(AXIS_Y);
				return;
			}
			if (this.walls[AXIS_Y].nodes.length > this.walls[AXIS_X].nodes.length) {
				this.removeFromWall(AXIS_X);
			}
			else {
				this.removeFromWall(AXIS_Y);
			}
		};

		MapNode.prototype.toString = function () {
			return 'MapNode(position=' + this.position + ')';
		};

		return MapNode;
	});
