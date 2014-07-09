Engine.module('world.World',
	[
		'physics.Physics',
		'physics.NodeCategory',
		'world.entities.EntityFactory',
		'world.map.MapGrid',
		'graphics.Scene',
		'graphics.Terrain'
	],
	function (Physics, NodeCategory, EntityFactory, MapGrid, Scene, Terrain) {
		'use strict';

		var DEBUG_DRAW_MAP_OBSTACLES = false;

		function World() {
			this.physics = new Physics(this);
			this.map = null;
			this.terrain = [];
			this.interlopers = [];
			this.entities = [];
			this.width = 0;
			this.height = 0;
			this._removeEntityCallback = this.removeEntity.bind(this);
		}

		World.prototype = Object.create(Scene.prototype);

		//noinspection JSUnusedGlobalSymbols
		World.prototype.getPlayers = function () {
			var players = [];
			for (var i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i] !== null && this.entities[i].node.category === NodeCategory.PLAYER) {
					players.push(this.entities[i]);
				}
			}
			return players;
		};

		World.prototype.addEntity = function (entity) {
			this.entities[this.entities.length] = entity;
			this.physics.addNode(entity.node);
			entity.onDestroy(this._removeEntityCallback);
		};

		World.prototype.removeEntity = function (entity) {
			var i = this.entities.indexOf(entity);
			if (i > -1) {
				// The reference to the removed entity is broken, and will be cleaned up at the end of the current/next
				// update loop. If it were spliced immediately, it could cause unpredictable skipping of updates.
				this.entities[i] = null;
			}
		};

		//noinspection JSUnusedGlobalSymbols
		World.prototype.addInterloper = function (interloper) {
			this.interlopers[this.interlopers.length] = interloper;
			interloper.init(this);
		};

		//noinspection JSUnusedGlobalSymbols
		World.prototype.removeInterloper = function (interloper) {
			var i = this.interlopers.indexOf(interloper);
			if (i > -1) {
				this.interlopers[i] = null;
			}
		};

		World.prototype._cleanAfterUpdate = function () {
			var i, len;
			for (i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i] === null) {
					this.entities.splice(i--, 1);
				}
			}
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] === null) {
					this.interlopers.splice(i--, 1);
				}
			}
		};

		World.prototype.spawnObject = function (id, x, y, orientation) {
			this.addEntity(EntityFactory.spawn(id, x, y, orientation));
		};

		//noinspection JSUnusedGlobalSymbols
		World.prototype.spawnObjectAt = function (id, object, orientation) {
			var center = object.node.getCenter();
			this.addEntity(EntityFactory.spawnAtCenter(id, center.x, center.y, orientation));
		};

		//noinspection JSUnusedGlobalSymbols
		World.prototype.firstObjectOfType = function (type) {
			for (var i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i].type === type) {
					return this.entities[i];
				}
			}
			return null;
		};

		World.prototype.reset = function () {
			for (var i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i]) {
					this.entities[i].destroy();
				}
			}
			this.physics.destroyAllNodes();

			this.map = null;
			this.mapNodes = [];
			this.terrain = [];
			this.entities = [];
			this.width = 0;
			this.height = 0;
		};

		//noinspection JSUnusedGlobalSymbols
		World.prototype.loadMap = function (map) {
			Engine.logger.info('Loading new map');

			var i, len;
			this.reset();

			var world = this;
			world.map = map;
			world.terrain = Terrain.readMapTerrain(map.terrain);
			world.width = map.width * map.tileSize;
			world.height = Math.ceil(world.terrain.length / map.width) * map.tileSize;

			// Create physical map boundaries
			this.physics.addNode(Physics.createRectNode(NodeCategory.EDGE, 0, -map.tileSize, world.width, map.tileSize, world).setStatic());
			this.physics.addNode(Physics.createRectNode(NodeCategory.EDGE, world.width, 0, map.tileSize, world.height, world).setStatic());
			this.physics.addNode(Physics.createRectNode(NodeCategory.EDGE, 0, world.height, world.width, map.tileSize, world).setStatic());
			this.physics.addNode(Physics.createRectNode(NodeCategory.EDGE, -map.tileSize, 0, map.tileSize, world.height, world).setStatic());

			this.mapNodes = [];
			// Create impassable tile nodes
			var grid = new MapGrid(map.width, map.tileSize);
			grid.load(world.terrain);
			var boundaryRects = grid.calculateBoundaries();
			for (i = 0, len = boundaryRects.length; i < len; i++) {
				this.mapNodes[this.mapNodes.length] = this.physics.addNode(
					Physics.createNode(NodeCategory.WALL, boundaryRects[i]).setStatic());
			}

			// Populate world with level entities
			map.entities.forEach(function (object) {
				world.spawnObject(object.id, object.x, object.y, object.orientation);
			});

			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].mapChange(this, map);
				}
			}
		};

		World.prototype.update = function (inputState) {
			var i, len;
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].preUpdate(this, inputState);
				}
			}
			for (i = 0, len = this.entities.length; i < len; i++) {
				// Defend against entities deleted during update
				if (this.entities[i] !== null) {
					this.entities[i].update(this, inputState);
				}
			}
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].prePhysics(this, inputState);
				}
			}
			this.physics.update();
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].postUpdate(this, inputState);
				}
			}
			// Clean up deleted entities after update and physics
			this._cleanAfterUpdate();
		};

		World.prototype.render = function (viewport) {
			var i, len;
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].preRender(this, viewport);
				}
			}

			// Pre-calculate the visible part of the map and only render enough tiles to keep it filled.
			// Safety conditions are attached to the calculation of the last row and last column to ensure it never tries
			// to render a tile that doesn't exist (when you're near the extreme right or bottom edge).
			if (this.map) {
				var firstRow = Math.floor(viewport.sceneOffset.y / this.map.tileSize);
				var lastRow = Math.min(firstRow + Math.ceil(viewport.height / this.map.tileSize) + 1, this.terrain.length / this.map.width);
				var firstCol = Math.floor(viewport.sceneOffset.x / this.map.tileSize);
				var lastCol = Math.min(firstCol + Math.ceil(viewport.width / this.map.tileSize) + 1, this.map.width);
				for (var row = firstRow; row < lastRow; row++) {
					for (var col = firstCol; col < lastCol; col++) {
						this.terrain[(row * this.map.width + col)].render(viewport, col * this.map.tileSize, row * this.map.tileSize + this.map.tileSize);
					}
				}
			}

			for (i = 0, len = this.entities.length; i < len; i++) {
				this.entities[i].render(viewport);
			}

			if (DEBUG_DRAW_MAP_OBSTACLES) {
				for (i = 0, len = this.mapNodes.length; i < len; i++) {
					var mapNode = this.mapNodes[i];
					viewport.context.strokeStyle = mapNode.category.isA(NodeCategory.OBSTACLE) ? '#ff0' : '#0f0';
					viewport.context.strokeRect(
							mapNode.getX() - viewport.sceneOffset.x,
							mapNode.getY() - viewport.sceneOffset.y,
						mapNode.getWidth(), mapNode.getHeight());
				}
			}

			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].postRender(this, viewport);
				}
			}
		};

		return World;
	});
