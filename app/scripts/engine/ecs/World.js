Engine.module('ecs.World',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function World(game) {
			this.game = game;
			this.systems = [];
			this.entities = [];
			this.onEntityRemoved = {};
		}

		World.prototype.addSystem = function (system) {
			this.systems.push(system);
			for (var i = 0, l = this.entities.length; i < l; i++) {
				if (system.entityMatcher.matches(this.entities[i])) {
					system.addEntity(this.entities[i]);
				}
			}
		};

		World.prototype.removeSystem = function (system) {
			if (Engine.util.Arrays.remove(this.systems, system)) {
				system.dispose();
			}
		};

		World.prototype._getMatchingSystems = function (entity) {
			var systems = [];
			for (var i = 0, l = this.systems.length; i < l; i++) {
				if (this.systems[i].entityMatcher.matches(entity)) {
					systems.push(this.systems[i]);
				}
			}
			return systems;
		};

		World.prototype._getContainingSystems = function (entity) {
			var systems = [];
			for (var i = 0, l = this.systems.length; i < l; i++) {
				if (this.systems[i].hasEntity(entity)) {
					systems.push(this.systems[i]);
				}
			}
			return systems;
		};

		World.prototype.addEntity = function (entity) {
			this.entities.push(entity);
			var systems = this._getMatchingSystems(entity);
			for (var i = 0, l = systems.length; i < l; i++) {
				systems[i].addEntity(entity);
			}
			this._registerEntityEventHandlers(entity);
		};

		World.prototype.removeEntity = function (entity) {
			if (Engine.util.Arrays.remove(this.entities, entity)) {
				var systems = this._getContainingSystems(entity);
				for (var i = 0, l = systems.length; i < l; i++) {
					systems[i].removeEntity(entity);
				}
				this.onEntityRemoved[entity.id]();
				delete this.onEntityRemoved[entity.id];
			}
		};

		World.prototype._registerEntityEventHandlers = function (entity) {
			var self = this;
			var onDispose = function () {
				self.removeEntity(entity);
			};
			var onComponentChanged = function () {
				self._onEntityChange(entity);
			};
			entity.on('dispose', onDispose);
			entity.on('componentAdded', onComponentChanged);
			entity.on('componentRemoved', onComponentChanged);
			this.onEntityRemoved[entity.id] = function () {
				entity.off('dispose', onDispose);
				entity.off('componentAdded', onComponentChanged);
				entity.off('componentRemoved', onComponentChanged);
			};
		};

		World.prototype._onEntityChange = function (entity) {
			for (var i = 0, l = this.systems.length; i < l; i++) {
				var system = this.systems[i];
				var contains = system.hasEntity(entity);
				// Ensure containing systems still match after component change
				if (contains && !system.entityMatcher.matches(entity)) {
					system.removeEntity(entity);
				}
				// Ensure newly-matching systems have the entity added
				else if (!contains && system.entityMatcher.matches(entity)) {
					system.addEntity(entity);
				}
			}
		};

		World.prototype.clear = function () {
			var i, l;
			for (i = 0, l = this.systems.length; i < l; i++) {
				this.systems[i].dispose(this.game);
			}
			this.systems = [];
			// Entities are not disposed purposely
			for (i = 0, l = this.entities.length; i < l; i++) {
				this.onEntityRemoved[this.entities[i].id]();
			}
			this.entities = [];
			this.onEntityRemoved = {};
		};

		World.prototype.update = function (time, input) {
			for (var i = 0, l = this.systems.length; i < l; i++) {
				this.systems[i].update(this.game, time, input);
			}
		};

		World.prototype.render = function (time, viewport) {
			for (var i = 0, l = this.systems.length; i < l; i++) {
				this.systems[i].render(this.game, time, viewport);
			}
		};

		return World;
	});
