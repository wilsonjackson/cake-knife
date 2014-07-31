(function () {
	'use strict';

	var Engine = window.Engine || (window.Engine = {});
	var modules = {};
	var injector;

	beforeEach(function () {
		injector = Engine.injector = new Engine.Injector();
	});

	Engine.module = function (name, deps, fn) {
		modules[name] = [deps, fn];
	};

	Engine.load = function (names, fn) {
		return function () {
			injector.load(flattenModules(names));
			fn.apply(null, names.map(function (name) {
				return injector.get(name);
			}));
		};
	};

	function flattenModules(names, accumulator) {
		return names.reduce(function (acc, name) {
			if (!acc[name]) {
				if (!modules[name]) {
					throw new Error('Module "' + name + '" has not been registered');
				}
				acc[name] = modules[name];
				if (modules[name][0].length > 0) {
					flattenModules(modules[name][0], acc);
				}
			}
			return acc;
		}, accumulator || {});
	}
})();
