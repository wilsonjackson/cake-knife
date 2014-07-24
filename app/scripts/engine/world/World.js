Engine.module('world.World',
	[
		'behaviors.BehaviorSystem',
		'displays.DisplaySystem',
		'world.maps.MapGrid',
		'graphics.Scene'
	],
	function (BehaviorSystem, DisplaySystem, MapGrid, Scene) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function World() {
			this.map = null;
			this.interlopers = [];
			this.entities = [];
		}

		World.prototype = Object.create(Scene.prototype);

		World.prototype.addEntity = function (entity) {
			this.entities[this.entities.length] = entity;
			entity.on('destroy', this.removeEntity.bind(this));
		};

		World.prototype.removeEntity = function (entity) {
			var i = Engine.util.Arrays.indexOf(this.entities, entity);
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
			var i = Engine.util.Arrays.indexOf(this.interlopers, interloper);
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

		World.prototype.reset = function () {
			for (var i = 0, len = this.entities.length; i < len; i++) {
				if (this.entities[i]) {
					this.entities[i].destroy();
				}
			}

			this.map = null;
			this.entities = [];
		};

		World.prototype.update = function (inputState) {
			var i, len;
			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].preUpdate(this, inputState);
				}
			}

			BehaviorSystem.update(this, inputState, this.entities);

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

			viewport.getLayer(0).clear();
			DisplaySystem.render(this, viewport, this.entities);

			for (i = 0, len = this.interlopers.length; i < len; i++) {
				if (this.interlopers[i] !== null) {
					this.interlopers[i].postRender(this, viewport);
				}
			}
		};

		return World;
	});
