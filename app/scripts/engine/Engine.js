/* global Stats */

(function (Stats, window, document) {
	'use strict';

	var modules = {};
	var artifacts = {};
	var ticker;

	var Engine = {};

	Engine.tick = 0;
	Engine.delta = 0;

	Engine.init = function (config) {
		checkNotInitialized();
		loadModules();
		this.logger = new artifacts['logging.DefaultLogger']();
		ticker = new artifacts['loop.Ticker'](config);
		registerGlobalEventHandlers();
	};

	Engine.start = function () {
		Engine.logger.info('Starting preload');
		artifacts['graphics.sprite.SpriteRepository'].preload().then(function () {
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

	Engine.getArtifact = function (name) {
		return artifacts[name];
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

	function checkNotInitialized() {
		if (ticker) {
			throw 'Engine already initialized';
		}
	}

	function loadModules() {
		var names = Object.keys(modules);
		var stack = [];
		var loaded = {};
		for (var i = 0, len = names.length; i < len; i++) {
			mod(names[i], stack, loaded);
		}
		modules = [];
	}

	function mod(name, stack, loaded) {
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
			args.push(mod(deps[i], stack, loaded));
		}
		stack.pop();

		artifacts[name] = fn.apply(null, args);
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
