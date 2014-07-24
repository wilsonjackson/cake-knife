Engine.module('behaviors.BehaviorSystem',
	[
		'util.Events'
	],
	function (Events) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function BehaviorSystem() {
			Events.mixin(this);
			this.types = {};
			this.behaviors = [];
		}

		BehaviorSystem.prototype.register = function (name, Ctor) {
			this.types[name] = Ctor;
			return Ctor;
		};

		BehaviorSystem.prototype.add = function (behavior, priority) {
			if (typeof behavior === 'string') {
				if (!this.types[behavior]) {
					throw 'Unknown behavior: '  + behavior;
				}
				behavior = new (this.types[behavior])();
			}
			this.behaviors.push({instance: behavior, priority: priority, added: this.behaviors.length});
			this.behaviors.sort(function (a, b) {
				if (a.priority === b.priority) {
					return a.added < b.added ? -1 : 1;
				}
				return a.priority > b.priority ? -1 : 1;
			});
		};

		BehaviorSystem.prototype.update = function (world, inputState, entities) {
			for (var i = 0, l = this.behaviors.length; i < l; i++) {
				var bEntities = [];
				for (var next = 0, j = 0, m = entities.length; j < m; j++) {
					if (entities[j].hasBehavior(this.behaviors[i].instance.name)) {
						bEntities[next++] = entities[j];
					}
				}
				this.behaviors[i].instance.update(world, inputState, bEntities);
			}
		};

		return new BehaviorSystem();
	});
