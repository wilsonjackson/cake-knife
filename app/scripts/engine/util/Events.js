Engine.module('util.Events', function () {
	'use strict';

	function Events() {
		this.events = {};
	}

	Events.prototype.on = function (name, fn) {
		var events = this.events[name] || (this.events[name] = []);
		events.push(fn);
	};

	Events.prototype.off = function (name, fn) {
		var events = this.events[name];
		if (events) {
			var i = Engine.util.Arrays.indexOf(events, fn);
			if (i > -1) {
				events.splice(i, 1);
			}
		}
	};

	Events.prototype.trigger = function (name, data) {
		var events = this.events[name];
		if (events) {
			for (var i = 0, len = events.length; i < len; i++) {
				events[i](data);
			}
		}
	};

	Events.prototype.destroy = function () {
		delete this.events;
	};

	Events.mixin = function (object) {
		var events = object.__events = new Events();
		object.on = function (name, fn) {
			events.on(name, fn);
		};
		object.off = function (name, fn) {
			events.off(name, fn);
		};
		object.trigger = function (name, data) {
			events.trigger(name, data);
		};
	};

	Events.unmix = function (object) {
		delete object.on;
		delete object.off;
		delete object.trigger;
		object.__events.destroy();
		delete object.__events;
	};

	return Events;
});
