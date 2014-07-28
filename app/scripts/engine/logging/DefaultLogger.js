Engine.module('logging.DefaultLogger',
	[],
	function () {
		'use strict';

		function DefaultLogger() {
		}

		DefaultLogger.prototype.trace = function (/*message*/) {
			console.trace.apply(console, ['[' + Engine.getTicks() + ']'].concat(Array.prototype.slice.call(arguments)));
		};

		DefaultLogger.prototype.debug = function (/*message*/) {
			console.debug.apply(console, ['[' + Engine.getTicks() + ']'].concat(Array.prototype.slice.call(arguments)));
		};

		DefaultLogger.prototype.info = function (/*message*/) {
			console.info.apply(console, ['[' + Engine.getTicks() + ']'].concat(Array.prototype.slice.call(arguments)));
		};

		DefaultLogger.prototype.warn = function (/*message*/) {
			console.warn.apply(console, ['[' + Engine.getTicks() + ']'].concat(Array.prototype.slice.call(arguments)));
		};

		DefaultLogger.prototype.error = function (message) {
			if (message.stack) {
				console.error('[' + Engine.getTicks() + '] ' + message.stack);
			}
			else {
				console.error.apply(console, ['[' + Engine.getTicks() + ']'].concat(Array.prototype.slice.call(arguments)));
			}
		};

		return DefaultLogger;
	});
