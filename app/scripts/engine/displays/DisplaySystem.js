Engine.module('displays.DisplaySystem',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function DisplaySystem() {
			this.types = {};
			this.displays = [];
		}

		DisplaySystem.prototype.register = function (name, Ctor) {
			this.types[name] = Ctor;
			return Ctor;
		};

		DisplaySystem.prototype.add = function (display) {
			if (typeof display === 'string') {
				if (!this.types[display]) {
					throw 'Unknown display: '  + display;
				}
				display = new (this.types[display])();
			}
			this.displays.push(display);
		};

		DisplaySystem.prototype.render = function (world, viewport, entities) {
			for (var i = 0, l = this.displays.length; i < l; i++) {
				var dEntities = [];
				for (var next = 0, j = 0, m = entities.length; j < m; j++) {
					if (this.displays[i].name === '*' || entities[j].hasDisplay(this.displays[i].name)) {
						dEntities[next++] = entities[j];
					}
				}
				this.displays[i].render(world, viewport, dEntities);
			}
		};

		return new DisplaySystem();
	});

