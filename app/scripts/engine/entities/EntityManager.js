Engine.module('entities.EntityManager',
	[
		'entities.EntityTypeBuilder'
	],
	/**
	 *
	 * @param {EntityTypeBuilder} EntityTypeBuilder
	 */
	function (EntityTypeBuilder) {
		'use strict';

		var types = {};

		/**
		 *
		 * @constructor
		 */
		function EntityManager() {
		}

		/**
		 *
		 * @param {string} type
		 * @return {EntityTypeBuilder}
		 */
		EntityManager.prototype.createType = function (type) {
			var builder = new EntityTypeBuilder();
			builder.on('build', function (Ctor) {
				types[type] = Ctor;
			});
			return builder;
		};

		EntityManager.prototype.create = function (type) {
			return new types[type]();
		};

		EntityManager.prototype.destroy = function (entity) {
			for (var i in entity) {
				if (entity.hasOwnProperty(i) && typeof entity[i] === 'object') {
					if (entity[i].destroy) {
						entity[i].destroy();
					}
					delete entity[i];
				}
			}

		};

		return new EntityManager();
	});
