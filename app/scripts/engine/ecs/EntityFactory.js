Engine.module('ecs.EntityFactory',
	[
		'ecs.EntityArchetype',
		'ecs.Entity'
	],
	/**
	 *
	 * @param {EntityArchetype} EntityArchetype
	 * @param {Entity} Entity
	 */
	function (EntityArchetype, Entity) {
		'use strict';

		var types = {};

		/**
		 *
		 * @constructor
		 */
		function EntityFactory() {
		}

		/**
		 *
		 * @param {string} type
		 * @return {EntityArchetype}
		 */
		EntityFactory.prototype.createEntityArchetype = function (type) {
			var self = this;
			var builder = new EntityArchetype();
			builder.on('register', function (Ctor) {
				self.provide(type, function (config) {
					if (!!config) {
						throw new Error('Entity archetypes cannot be configured.');
					}
					return new Ctor();
				});
			});
			return builder;
		};

		EntityFactory.prototype.provide = function (type, factory) {
			types[type] = factory;
		};

		EntityFactory.prototype.create = function (type, config) {
			if (!!type) {
				return types[type](config);
			}
			else {
				if (!!config) {
					throw new Error('Generic entities cannot be configured.');
				}
				return new Entity();
			}
		};

		return new EntityFactory();
	});
