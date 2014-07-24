/* global Stats */

(function (Stats, window, document) {
	'use strict';

	var modules = {};
	var ticker;

	var Engine = {};

	Engine.tick = 0;
	Engine.delta = 0;

	Engine.init = function (config) {
		checkNotInitialized();
		this.injector = new Engine.Injector();
		this.injector.load(modules);
		modules = [];
		this.logger = new (this.injector.get('logging.DefaultLogger'))();
		ticker = new (this.injector.get('loop.Ticker'))(config);
		registerGlobalEventHandlers();
	};

	Engine.start = function () {
		Engine.logger.info('Starting preload');
		this.injector.get('resources.ResourceLoader').load().then(function () {
			Engine.logger.info('Preload complete');
			ticker.start();
		});
	};

	Engine.suspend = function () {
		ticker.suspend();
	};

	Engine.resume = function () {
		ticker.resume();
	};

	Engine.getViewport = function () {
		return ticker.viewport;
	};

	Engine.getScene = function () {
		return ticker.scene;
	};

	Engine.setScene = function (scene) {
		ticker.scene = scene;
		scene.activate();
	};

	Engine.pushScene = function (scene) {
		ticker.scenes.push(ticker.scene);
		ticker.scene = scene;
		scene.activate();
	};

	Engine.popScene = function () {
		if (ticker.scenes.length > 0) {
			ticker.scene = ticker.scenes.pop();
			ticker.scene.activate();
		}
		else {
			ticker.scene = null;
		}
	};

	Engine.module = function (name, deps, module) {
		modules[name] = [deps, module];
	};

	Engine.Injector = function () {
	};

	Engine.Injector.prototype.load = function (modules) {
		this.artifacts = {};
		var names = Object.keys(modules);
		var stack = [];
		var loaded = {};
		for (var i = 0, len = names.length; i < len; i++) {
			mod(names[i], stack, loaded, this.artifacts);
		}
	};

	Engine.Injector.prototype.get = function (name) {
		return this.artifacts[name];
	};

	function checkNotInitialized() {
		if (ticker) {
			throw 'Engine already initialized';
		}
	}

	function mod(name, stack, loaded, artifacts) {
		if (loaded[name]) {
			return artifacts[name];
		}
		if (name.indexOf('.') === -1) {
			throw 'Module name must include a dot';
		}
		if (stack.indexOf(name) !== -1) {
			throw 'Circular module dependency: ' + stack.join(' -> ') + ' -> ' + name;
		}
		if (!modules[name]) {
			throw 'Unknown module: ' + name + ' (dependency of ' + stack[stack.length - 1] + ')';
		}

		var hasDeps = !!modules[name][0].push;
		var deps = hasDeps ? modules[name][0] : [];
		var fn = modules[name][hasDeps ? 1 : 0];
		var args = [];

		stack.push(name);
		for (var i = 0, len = deps.length; i < len; i++) {
			args.push(mod(deps[i], stack, loaded, artifacts));
		}
		stack.pop();

		try {
			artifacts[name] = fn.apply(null, args);
		}
		catch (e) {
			console.error(e.stack || e);
		}
		loaded[name] = true;
		return artifacts[name];
	}

	function registerGlobalEventHandlers() {
		document.addEventListener('visibilitychange', function () {
			if (document.hidden) {
				Engine.suspend();
			}
			else {
				Engine.resume();
			}
		}, false);

		window.addEventListener('blur', function () {
			Engine.suspend();
		}, false);
		window.addEventListener('focus', function () {
			Engine.resume();
		}, false);
	}

	window.Engine = Engine;
})(Stats, window, document);
