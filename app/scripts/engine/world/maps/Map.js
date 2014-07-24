Engine.module('maps.Map',
	[
		'entities.EntityManager',
		'graphics.Viewport',
		'math.Vector'
	],
	function (EntityManager, Viewport, Vector) {
		'use strict';

		EntityManager.createType('mapObstacle')
			.category('obstacle')
			.addComponent('entities.components.Transform')
			.addComponent('entities.components.Collider')
			.addBehavior('collide')
			.build();

		EntityManager.createType('mapBackgroundTile')
			.category('decoration')
			.addComponent('entities.components.Transform')
			.addComponent('entities.components.Sprite', null, 0, 0, Viewport.LAYER_BACKGROUND)
			.addDisplay('sprite')
			.build();

		EntityManager.createType('mapForegroundTile')
			.category('decoration')
			.addComponent('entities.components.Transform')
			.addComponent('entities.components.Sprite', null, 0, 0, Viewport.LAYER_FOREGROUND)
			.addDisplay('sprite')
			.build();

		/**
		 *
		 * @param width
		 * @param height
		 * @param tileWidth
		 * @param tileHeight
		 * @constructor
		 */
		function Map(width, height, tileWidth, tileHeight) {
			this.width = width;
			this.height = height;
			this.tileWidth = tileWidth;
			this.tileHeight = tileHeight;
			this.layers = {
				background: [],
				foreground: [],
				collide: []
			};
			this.tileSets = [];
			this.entities = [];
		}

		Map.prototype.addLayer = function (name, tiles) {
			if (this.layers.hasOwnProperty(name)) {
				this.layers[name] = tiles;
			}
		};

		Map.prototype.addTileSet = function (indexOffset, spriteSheet) {
			var tileSetDefinition = {
				indexOffset: indexOffset,
				spriteSheet: spriteSheet
			};
			for (var i = 0, l = this.tileSets.length; i < l; i++) {
				if (this.tileSets[i].indexOffset > indexOffset) {
					this.tileSets.splice(i, 0, tileSetDefinition);
					return;
				}
			}
			this.tileSets.push(tileSetDefinition);
		};

		Map.prototype.load = function (world) {
			var i, l;
			var entity;

			// Save current map as a property on the world
			world.map = this;

//			// Create background sprites
//			for (i = 0, l = this.layers.background.length; i < l; i++) {
//				if (this.layers.background[i] > 0) {
//					entity = EntityManager.create('mapBackgroundTile');
//					entity.getComponent('sprite').sprite = this.findTile(this.layers.background[i]);
//					this.positionEntity(entity, this.indexToOffset(i));
//					world.addEntity(entity);
//				}
//			}
//
//			// Create foreground sprites
//			for (i = 0, l = this.layers.foreground.length; i < l; i++) {
//				if (this.layers.foreground[i] > 0) {
//					entity = EntityManager.create('mapForegroundTile');
//					entity.getComponent('sprite').sprite = this.findTile(this.layers.foreground[i]);
//					this.positionEntity(entity, this.indexToOffset(i));
//					world.addEntity(entity);
//				}
//			}

			//			// Create impassable tile nodes
//			var grid = new MapGrid(map.width, map.tileSize);
//			grid.load(world.terrain);
//			var boundaryRects = grid.calculateBoundaries();
//			for (i = 0, len = boundaryRects.length; i < len; i++) {
////				this.mapNodes[this.mapNodes.length] = this.collisionDetector.addNode(
////					CollisionDetector.createNode(NodeCategory.WALL, boundaryRects[i]).setStatic());
//			}

			// Create collision entities
			for (i = 0, l = this.layers.collide.length; i < l; i++) {
				if (this.layers.collide[i] > 0) {
					entity = EntityManager.create('mapObstacle');
					this.positionEntity(entity, this.indexToOffset(i));
					world.addEntity(entity);
				}
			}
		};

		Map.prototype.positionEntity = function (entity, position) {
			var transform = entity.getComponent('transform');
			transform.scale(new Vector(this.tileWidth, this.tileHeight));
			transform.translate(position.add(new Vector(0, this.tileHeight)));
		};

		Map.prototype.indexToOffset = function (idx) {
			return new Vector((idx % this.width) * this.tileWidth, Math.floor(idx / this.width) * this.tileHeight);
		};

		Map.prototype.findTile = function (idx) {
			var tileSet;
			for (var i = 0, l = this.tileSets.length; i < l && this.tileSets[i].indexOffset <= idx; i++) {
				tileSet = this.tileSets[i];
			}
			return tileSet.spriteSheet.position(idx - tileSet.indexOffset);
		};

		return Map;
	});
