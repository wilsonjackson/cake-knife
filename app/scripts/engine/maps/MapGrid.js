Engine.module('maps.MapGrid',
	[
		'math.Vector',
		'maps.MapNode',
		'maps.MapWall'
	],
	/**
	 *
	 * @param {Vector} Vector
	 * @param {MapNode} MapNode
	 * @param {MapWall} MapWall
	 * @returns {MapGrid}
	 */
	function (Vector, MapNode, MapWall) {
		'use strict';

		/**
		 *
		 * @param {int} width Width of the map in tiles
		 * @param {int} tileWidth Width of an individual tile in pixels
		 * @constructor
		 */
		function MapGrid(width, tileWidth) {
			this.width = width;
			this.tileWidth = tileWidth;
			this.nodes = [];
			this.walls = [];
		}

		MapGrid.prototype.load = function (collisionTiles) {
			for (var i = 0, len = collisionTiles.length; i < len; i++) {
				if (collisionTiles[i] === 0) {
					var position = this.toVector(i);
					var neighbors = [];
					if (position.y !== 0) {
						neighbors.push(this.toIndex(position.subtract(new Vector(0, 1))));
					}
					if (position.x !== this.width - 1) {
						neighbors.push(this.toIndex(position.add(new Vector(1, 0))));
					}
					if (position.y !== Math.floor(collisionTiles.length / this.width) - 1) {
						neighbors.push(this.toIndex(position.add(new Vector(0, 1))));
					}
					if (position.x !== 0) {
						neighbors.push(this.toIndex(position.subtract(new Vector(1, 0))));
					}
					for (var j = 0, jlen = neighbors.length; j < jlen; j++) {
						if (collisionTiles[neighbors[j]] > 0) {
							this.createNode(neighbors[j]);
						}
					}
				}
			}
		};

		MapGrid.prototype.createNode = function (index) {
			if (!this.nodes[index]) {
				this.nodes[index] = new MapNode(this.toVector(index), this);
			}
		};

		MapGrid.prototype.createWall = function (axis) {
			return (this.walls[this.walls.length] = new MapWall(axis));
		};

		MapGrid.prototype.mergeWalls = function (wall1, wall2) {
			while (wall2.nodes.length > 0) {
				wall2.nodes[0].setWall(wall1);
			}
			Engine.util.Arrays.remove(this.walls, wall2);
		};

		MapGrid.prototype.getNodeAt = function (vector) {
			return this.nodes[this.toIndex(vector)];
		};

		//noinspection JSUnusedGlobalSymbols
		MapGrid.prototype.calculateBoundaries = function () {
			var i, l;
			var keys = Object.keys(this.nodes);
			for (i = 0, l = keys.length; i < l; i++) {
				this.nodes[keys[i]].pickWall();
			}

			var boundingRects = [];
			for (i = 0, l = this.walls.length; i < l; i++) {
				if (this.walls[i].nodes.length > 0) {
					boundingRects.push(this.walls[i].createBoundingRect(this.tileWidth));
				}
			}
			return boundingRects;
		};

		MapGrid.prototype.toVector = function (i) {
			return new Vector(i % this.width, Math.floor(i / this.width));
		};

		MapGrid.prototype.toIndex = function (vector) {
			return vector.y * this.width + vector.x;
		};

		MapGrid.prototype.toString = function () {
			return 'Grid(walls=[' + this.walls.map(function (o) {
				return o.toString();
			}).join(', ') + '])';
		};

		return MapGrid;
	});
