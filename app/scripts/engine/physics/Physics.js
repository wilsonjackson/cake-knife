Engine.module('physics.Physics',
	[
		'math.Vector',
		'math.BoundingRect',
		'math.BoundingCircle',
		'util.QuadTree',
		'physics.Collision',
		'physics.Node',
		'physics.Orientation'
	],
	function (Vector, BoundingRect, BoundingCircle, QuadTree, Collision, Node, Orientation) {
		'use strict';

		var node = 0;

		function isFunction(o) {
			return !!(o && o.constructor && o.call && o.apply);
		}

		function detectObjectCollision(nodeA, nodeB, world) {
			var collidableA = nodeA.collidable;
			var collidableB = nodeB.collidable;
			if ((collidableA === true && collidableB === true) ||
				(isFunction(nodeA.collidable) && nodeA.collidable(nodeB)) ||
				(isFunction(nodeB.collidable) && nodeB.collidable(nodeA))) {

				var intersection = nodeA.bounds.intersection(nodeB.bounds);
				if (intersection !== null) {
					var collisionA = new Collision(nodeB, intersection);
					var solutionA = nodeA.solveCollision(collisionA, world);

					var collisionB = new Collision(nodeA, intersection);
					var solutionB = nodeB.solveCollision(collisionB, world);

					if (solutionA) {
						nodeA.bounds.move(solutionA);
					}
					if (solutionB) {
						nodeB.bounds.move(solutionB);
					}

					nodeA.collide(collisionA, world);
					nodeB.collide(collisionB, world);
				}
			}
		}

		function nodeToQuadTreeObject(node) {
			return {
				e: node,
				x: node.bounds.left(),
				y: node.bounds.top(),
				w: node.bounds.width(),
				h: node.bounds.height()
			};
		}

		function Physics(world) {
			this.world = world;
			this.nodes = [];
		}

		Physics.prototype.addNode = function (node) {
			var self = this;
			self.nodes[self.nodes.length] = node;
			node.onDestroy(function () {
				var index = self.nodes.indexOf(node);
				if (index > -1) {
					self.nodes.splice(index, 1);
				}
			});
			return node;
		};

		Physics.prototype.destroyAllNodes = function () {
			for (var i = 0, len = this.nodes.length; i < len; i++) {
				if (this.nodes[i]) {
					this.nodes[i].destroy();
				}
			}
			this.nodes = [];
		};

		Physics.prototype.update = function () {
			var i, j, len = this.nodes.length;
			var compared = {};
			var quadTree = new QuadTree(1, {x: 0, y: 0, w: this.world.width, h: this.world.height});

			for (i = 0; i < len; i++) {
				this.nodes[i].integrate();
				quadTree.insert(nodeToQuadTreeObject(this.nodes[i]));
			}
			for (i = 0; i < len; i++) {
				var node = this.nodes[i];
				if (!node) {
					// Safety check, as nodes may be deleted by collision handlers.
					continue;
				}

				compared[node._id] = {};

				if (node.collidable === false) {
					continue;
				}
				var nearby = quadTree.retrieve(nodeToQuadTreeObject(node));
				var nlen = nearby.length;
				for (j = 0; j < nlen && node.collidable !== false; j++) {
					var nearbyNode = nearby[j].e;
					var alreadyChecked = compared[nearbyNode._id] && compared[nearbyNode._id][node._id];
					if (alreadyChecked || nearbyNode.collidable === false || nearbyNode === node ||
						(nearbyNode.isStatic && node.isStatic)) {
						continue;
					}
					detectObjectCollision(node, nearbyNode, this.world);
					compared[node._id][nearbyNode._id] = true;
				}
			}
			for (i = 0; i < len; i++) {
				if (this.nodes[i]) {
					this.nodes[i].isRotated = false;
				}
			}
		};

		Physics.createNode = function (category, bounds, orientation, object) {
			return new Node(++node, category, bounds, orientation, object);
		};

		Physics.createRectNode = function (category, x, y, w, h, orientation, object) {
			return this.createNode(category, new BoundingRect(new Vector(x, y), new Vector(w, h)), orientation, object);
		};

		Physics.createCircleNode = function (category, x, y, r, object) {
			return this.createNode(category, new BoundingCircle(new Vector(x, y), r), Orientation.NORTH, object);
		};

		return Physics;
	});
