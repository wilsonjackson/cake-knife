Engine.module('physics.CollisionDetector',
	[
		'math.Vector',
		'util.QuadTree',
		'physics.Collision'
	],
	function (Vector, QuadTree, Collision) {
		'use strict';

		function detectCollision(entityA, entityB, cache) {
			var intersection = getBounds(entityA, cache).intersection(getBounds(entityB, cache));
			if (intersection !== null) {
				return new Collision(entityA, entityB, intersection);
			}
			return null;
		}

		function wrapEntity(entity) {
			var transform = entity.getComponent('transform');
			return {
				entity: entity,
				x: transform.position.x,
				y: transform.position.y - transform.size.y,
				w: transform.size.x,
				h: transform.size.y
			};
		}

		function getBounds(entity, cache) {
			if (!cache[entity.id]) {
				// Entities are draw by their bottom-right corner, so offset them by their height
				var bounds = entity.getComponent('transform').getBounds();
				bounds.move(new Vector(0, -bounds.height()));
				cache[entity.id] = bounds;
			}
			return cache[entity.id];
		}

		function getCollidees(entity, cache) {
			return cache[entity.id] || (cache[entity.id] = entity.getComponent('collider').collidesWith);
		}

		function canCollide(entityA, entityB, cache) {
			var collideesA = getCollidees(entityA, cache);
			var collideesB = getCollidees(entityB, cache);

			return Engine.util.Arrays.indexOf(collideesA, entityB.category) !== -1 ||
				Engine.util.Arrays.indexOf(collideesB, entityA.category) !== -1;
		}

		function CollisionDetector(planeWidth, planeHeight) {
			this.plane = new Vector(planeWidth, planeHeight);
		}

		CollisionDetector.prototype.detectCollisions = function (entities, onCollide) {
			var i, len;
			var toCompare = [];
			var compared = {};
			var quadTree = new QuadTree(1, {x: 0, y: 0, w: this.plane.x, h: this.plane.y});
			var cache = {
				bounds: {},
				collidees: {}
			};
			var count;

			for (i = 0, count = 0, len = entities.length; i < len; i++) {
				var wrappedEntity = wrapEntity(entities[i], count);
				quadTree.insert(wrappedEntity);
				toCompare[count] = wrappedEntity;
				++count;
			}

			for (i = 0, len = toCompare.length; i < len; i++) {
				var entity = toCompare[i].entity;
				compared[entity.id] = {};

				var nearby = quadTree.retrieve(toCompare[i]);
				for (var j = 0, nearbyLen = nearby.length; j < nearbyLen; j++) {
					var nearbyEntity = nearby[j].entity;
					var alreadyChecked = compared[nearbyEntity.id] && compared[nearbyEntity.id][entity.id];
					if (alreadyChecked || nearbyEntity === entity) {
						continue;
					}
					if (!canCollide(entity, nearbyEntity, cache.collidees)) {
						compared[entity.id][nearbyEntity.id] = true;
						continue;
					}
					var collision = detectCollision(entity, nearbyEntity, cache.bounds);
					if (collision !== null) {
						onCollide(collision);
					}
					compared[entity.id][nearbyEntity.id] = true;
				}
			}
		};

		return CollisionDetector;
	});
