Engine.module('ecs.Entity',
	[
		'util.Events'
	],
	function (Events) {
		'use strict';

		var id = 0;

		/**
		 *
		 * @constructor
		 */
		function Entity() {
			Events.mixin(this);
			this.id = ++id;
			this.initComponents();
		}

		Entity.prototype.componentTypes = Object.freeze([]);

		Entity.prototype.initComponents = function () {
			var l = this.componentTypes.length;
			this.components = new Array(l);
			for (var i = 0; i < l; i++) {
				var c = new (this.componentTypes[i])();
				this.components[c.name] = c;
			}
		};

		Entity.prototype.addComponent = function (component) {
			if (!!this.components[component.name]) {
				throw new Error('Attempted to add multiple components of type ' + component.name + ' to entity ' + this);
			}
			this.components[component.name] = component;
			this.trigger('componentAdded', {component: component, entity: this});
		};

		//noinspection JSUnusedGlobalSymbols
		Entity.prototype.removeComponent = function (component) {
			var name = typeof component === 'string' ? component : component.name;
			if (!!this.components[name]) {
				var removed = this.components[name];
				delete this.components[name];
				this.trigger('componentRemoved', {component: removed, entity: this});
			}
		};

		Entity.prototype.getComponent = function (name) {
			return this.components[name] || null;
		};

		Entity.prototype.hasComponent = function (name) {
			return !!this.components[name];
		};

		Entity.prototype.dispose = function () {
			this.trigger('dispose', {entity: this});
			this.components = null;
			Events.unmix(this);
		};

		Entity.prototype.toString = function () {
			return 'Entity(id=' + this.id + ', components=[' +
				this.components.map(function (c) {
					return c.name;
				}).join(', ') +
				'])';
		};

		return Object.freeze(Entity);
	});
