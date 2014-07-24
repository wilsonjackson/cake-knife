Engine.module('entities.EntityTypeBuilder',
	[
		'entities.Entity',
		'util.Events'
	],
	function (Entity, Events) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function EntityTypeBuilder() {
			Events.mixin(this);
			this._category = null;
			this.components = [];
			this.behaviors = [];
			this.displays = [];
		}

		/**
		 *
		 * @param category
		 * @returns {EntityTypeBuilder}
		 */
		EntityTypeBuilder.prototype.category = function (category) {
			this._category = category;
			return this;
		};

		/**
		 *
		 * @param component
		 * @returns {EntityTypeBuilder}
		 */
		EntityTypeBuilder.prototype.addComponent = function (component) {
			this.components.push([component, Array.prototype.slice.call(arguments, 1)]);
			return this;
		};

		/**
		 *
		 * @param behavior
		 * @returns {EntityTypeBuilder}
		 */
		EntityTypeBuilder.prototype.addBehavior = function (behavior) {
			this.behaviors.push(behavior);
			return this;
		};

		/**
		 *
		 * @param display
		 * @returns {EntityTypeBuilder}
		 */
		EntityTypeBuilder.prototype.addDisplay = function (display) {
			this.displays.push(display);
			return this;
		};

		EntityTypeBuilder.prototype.build = function () {
			if (this._category === null) {
				throw 'No category set';
			}
			var Ctor = function () {
				Entity.call(this);
			};
			Ctor.prototype = Object.create(Entity.prototype);
			Ctor.prototype.constructor = Ctor;
			Ctor.prototype.category = this._category;
			Ctor.prototype.componentTypes = this.components.map(function (c) {
				var ComponentCtor = typeof c[0] === 'string' ? Engine.injector.get(c[0]) : c[0];
				return Function.bind.apply(ComponentCtor, [null].concat(c[1]));
			});
			Ctor.prototype.defaultBehaviors = this.behaviors.map(function (b) {
				return typeof b === 'string' ? b : b.prototype.name;
			});
			Ctor.prototype.defaultDisplays = this.displays.map(function (d) {
				return typeof d === 'string' ? d : d.prototype.name;
			});
			this.trigger('build', Ctor);
			return Ctor;
		};

		return EntityTypeBuilder;
	});
