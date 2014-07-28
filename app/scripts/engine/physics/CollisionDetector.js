Engine.module('physics.CollisionDetector',
	[
		'math.Vector',
		'util.QuadTree',
		'physics.Collision'
	],
	function (Vector, QuadTree, Collision) {
		'use strict';

		function detectCollision(bodyA, bodyB) {
			var intersection = bodyA.bounds.intersection(bodyB.bounds);
			if (intersection !== null) {
				return new Collision(bodyA, bodyB, intersection);
			}
			return null;
		}

		function wrapBody(body, id) {
			return {
				body: body,
				id: id,
				x: body.bounds.position.x,
				y: body.bounds.position.y,
				w: body.bounds.size.x,
				h: body.bounds.size.y,
				comparedWith: {}
			};
		}

		function canCollide(bodyA, bodyB) {
			return Engine.util.Arrays.indexOf(bodyA.collidesWith, bodyB.category) !== -1 ||
				Engine.util.Arrays.indexOf(bodyB.collidesWith, bodyA.category) !== -1;
		}

		/**
		 *
		 * @param {int} planeWidth
		 * @param {int} planeHeight
		 * @constructor
		 */
		function CollisionDetector(planeWidth, planeHeight) {
			this.plane = new Vector(planeWidth, planeHeight);
		}

		CollisionDetector.prototype.detectCollisions = function (bodies, onCollide) {
			var i, l;
			var toCompare = [];
			var quadTree = new QuadTree(1, {x: 0, y: 0, w: this.plane.x, h: this.plane.y});
			var wrappedBody;

			for (i = 0, l = bodies.length; i < l; i++) {
				wrappedBody = wrapBody(bodies[i], i);
				quadTree.insert(wrappedBody);
				toCompare[i] = wrappedBody;
			}

			for (i = 0, l = toCompare.length; i < l; i++) {
				wrappedBody = toCompare[i];
				var body = wrappedBody.body;

				var nearby = quadTree.retrieve(wrappedBody);
				for (var j = 0, k = nearby.length; j < k; j++) {
					var nearbyBody = nearby[j].body;
					if (nearbyBody === body || !!nearby[j].comparedWith[wrappedBody.id]) {
						continue;
					}
					if (!canCollide(body, nearbyBody)) {
						wrappedBody.comparedWith[nearby[j].id] = true;
						continue;
					}
					var collision = detectCollision(body, nearbyBody);
					if (collision !== null) {
						onCollide(collision);
					}

					wrappedBody.comparedWith[nearby[j].id] = true;
				}
			}
		};

		return CollisionDetector;
	});
