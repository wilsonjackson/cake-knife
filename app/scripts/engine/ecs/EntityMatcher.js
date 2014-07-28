Engine.module('ecs.EntityMatcher',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function EntityMatcher() {
			this.rules = [];
			if (arguments.length > 0) {
				this.requireAll.apply(this, arguments);
			}
		}

		EntityMatcher.prototype.requireAll = function (/*component...*/) {
			var components = Array.prototype.slice.call(arguments);
			this.rules.push(function (entity) {
				for (var i = 0, l = components.length; i < l; i++) {
					if (!entity.hasComponent(components[i])) {
						return false;
					}
				}
				return true;
			});
		};

		EntityMatcher.prototype.requireOne = function (/*component...*/) {
			var components = Array.prototype.slice.call(arguments);
			this.rules.push(function (entity) {
				for (var i = 0, l = components.length; i < l; i++) {
					if (entity.hasComponent(components[i])) {
						return true;
					}
				}
				return false;
			});
		};

		EntityMatcher.prototype.exclude = function (/*component...*/) {
			var components = Array.prototype.slice.call(arguments);
			this.rules.push(function (entity) {
				for (var i = 0, l = components.length; i < l; i++) {
					if (entity.hasComponent(components[i])) {
						return false;
					}
				}
				return true;
			});
		};

		EntityMatcher.prototype.matches = function (entity) {
			for (var i = 0, l = this.rules.length; i < l; i++) {
				if (!this.rules[i](entity)) {
					return false;
				}
			}
			return true;
		};

		return EntityMatcher;
	});
