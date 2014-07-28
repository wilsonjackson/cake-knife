Engine.module('ecs.EntityArchetype',
	[
		'ecs.Entity',
		'util.Events'
	],
	function (Entity, Events) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function EntityArchetype() {
			Events.mixin(this);
			this.components = [];
		}

		/**
		 *
		 * @param component
		 * @returns {EntityArchetype}
		 */
		EntityArchetype.prototype.addComponent = function (component) {
			this.components.push([component, Array.prototype.slice.call(arguments, 1)]);
			return this;
		};

		EntityArchetype.prototype.register = function () {
			var Ctor = function () {
				Entity.call(this);
			};
			Ctor.prototype = Object.create(Entity.prototype);
			Ctor.prototype.constructor = Ctor;
			Ctor.prototype.componentTypes = this.components.map(function (c) {
				var ComponentCtor = typeof c[0] === 'string' ? Engine.injector.get(c[0]) : c[0];
				return Function.bind.apply(ComponentCtor, [null].concat(c[1]));
			});
			this.trigger('register', Ctor);
			return Ctor;
		};

		return EntityArchetype;
	});
