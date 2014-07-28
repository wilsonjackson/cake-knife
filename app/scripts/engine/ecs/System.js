Engine.module('ecs.System',
	[],
	function () {
		'use strict';

		var nextSystem = 1;

		/**
		 *
		 * @param {EntityMatcher} entityMatcher
		 * @constructor
		 */
		function System(entityMatcher) {
			this.bit = nextSystem;
			nextSystem <<= 1;
			this.entityMatcher = entityMatcher;
			this.entities = [];
		}

		System.prototype.addEntity = function (entity) {
			this.entities.push(entity);
			entity.systemBits |= this.bit;
		};

		System.prototype.removeEntity = function (entity) {
			if (Engine.util.Arrays.remove(this.entities, entity)) {
				entity.systemBits ^= this.bit;
			}
		};

		System.prototype.hasEntity = function (entity) {
			return !!(entity.systemBits & this.bit);
		};

		System.prototype.update = function (/*game, time, input*/) {
		};

		System.prototype.render = function (/*game, time, viewport*/) {
		};

		System.prototype.dispose = function (/*game*/) {
			for (var i = 0, l = this.entities.length; i < l; i++) {
				this.entities[i].systemBits ^= this.bit;
			}
			this.entityMatcher = null;
			this.entities = null;
		};

		return System;
	});
