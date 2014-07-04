/* global Stats */

(function (Stats, window, document) {
	'use strict';

	var modules = {};
	var artifacts = {};
	var session;
	var nextGameTick;
	var suspended = false;

	var Engine = {};

	Engine.tick = 0;
	Engine.delta = 0;

	Engine.init = function (config) {
		checkNotInitialized();
		loadModules();
		this.logger = new artifacts['logging.DefaultLogger']();
		session = new GameSession(config);
		registerGlobalEventHandlers();
	};

	Engine.start = function () {
		Engine.logger.info('Starting preload');
		artifacts['graphics.sprite.SpriteRepository'].preload().then(function () {
			Engine.logger.info('Preload complete');
			for (var i = 0, len = session.plugins.length; i < len; i++) {
				session.plugins[i].start();
			}
			nextGameTick = new Date().getTime();
			tick();
		});
	};

	Engine.suspend = function () {
		if (suspended) {
			return;
		}
		Engine.logger.info('Game suspended');
		suspended = true;
		for (var i = 0, len = session.plugins.length; i < len; i++) {
			session.plugins[i].suspend();
		}
	};

	Engine.resume = function () {
		if (!suspended) {
			return;
		}
		Engine.logger.info('Game resumed');
		nextGameTick = new Date().getTime();
		suspended = false;
		for (var i = 0, len = session.plugins.length; i < len; i++) {
			session.plugins[i].resume();
		}
	};

	Engine.getViewport = function () {
		return session.viewport;
	};

	Engine.getScene = function () {
		return session.scene;
	};

	Engine.setScene = function (scene) {
		session.scene = scene;
		scene.activate();
	};

	Engine.pushScene = function (scene) {
		session.scenes.push(session.scene);
		session.scene = scene;
		scene.activate();
	};

	Engine.popScene = function () {
		if (session.scenes.length > 0) {
			session.scene = session.scenes.pop();
			session.scene.activate();
		}
		else {
			session.scene = null;
		}
	};

	Engine.module = function (name, deps, module) {
		modules[name] = [deps, module];
	};

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

	Engine.Plugin = function () {};
	Engine.Plugin.prototype.start = function () {};
	Engine.Plugin.prototype.preUpdate = function (/*scene, input*/) {};
	Engine.Plugin.prototype.postUpdate = function (/*scene, input*/) {};
	Engine.Plugin.prototype.preRender = function (/*scene, viewport*/) {};
	Engine.Plugin.prototype.postRender = function (/*scene, viewport*/) {};
	Engine.Plugin.prototype.suspend = function () {};
	Engine.Plugin.prototype.resume = function () {};

	function GameSession(config) {
		if (!config.canvas || !(config.canvas instanceof HTMLCanvasElement)) {
			throw 'canvas element is required';
		}

		this.plugins = (config.plugins || []).map(function (pluginName) {
			Engine.logger.info('Loading plugin: ' + pluginName);
			return new artifacts[pluginName]();
		});
		this.viewport = new artifacts['graphics.Viewport'](config.canvas);
		this.input = new artifacts['input.Input']();
		this.scene = null;
		this.scenes = [];
	}

	GameSession.prototype.run = (function () {
		var i, len;
		var loops = 0;
		var skipTicks = 1000 / 50; // Target 50fps game updates
		var maxFrameSkip = 10;
		var time;

		var fpsStats = createStats().add();
		var tickStats = createStats(1).after(fpsStats);
		var renderStats = createStats(1).after(tickStats);

		return function () {
			loops = 0;

			// Suspended/uninitialized game bails immediately
			if (suspended || this.scene === null) {
				return;
			}

			while ((time = new Date().getTime()) > nextGameTick && loops < maxFrameSkip) {
				++Engine.tick;
				Engine.delta = time - nextGameTick;
				tickStats.begin();
				// Process input
				var inputState = this.input.readInput();

				// Update
				for (i = 0, len = this.plugins.length; i < len; i++) {
					this.plugins[i].preUpdate(this.scene, inputState);
				}
				this.scene.update(inputState);
				for (i = 0, len = this.plugins.length; i < len; i++) {
					this.plugins[i].postUpdate(this.scene, inputState);
				}

				nextGameTick += skipTicks;
				loops++;
				tickStats.end();
			}

			// Render
			renderStats.begin();
			for (i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].preRender(this.scene, this.viewport);
			}
			this.viewport.clear();
			this.scene.render(this.viewport);
			for (i = 0, len = this.plugins.length; i < len; i++) {
				this.plugins[i].postRender(this.scene, this.viewport);
			}
			renderStats.end();

			fpsStats.update();
		};
	})();

	function tick() {
		session.run();
		window.requestAnimationFrame(tick, document.body);
	}

	function checkNotInitialized() {
		if (session) {
			throw 'Engine already initialized';
		}
	}

	function createStats(mode) {
		var s = new Stats();
		s.setMode(mode || 0);
		s.domElement.style.position = 'absolute';
		s.domElement.style.right = 0;
		return {
			add: function () {
				s.domElement.style.top = 0;
				document.body.appendChild(s.domElement);
				return s;
			},
			after: function (other) {
				s.domElement.style.top = (other.domElement.offsetTop + other.domElement.offsetHeight) + 'px';
				document.body.appendChild(s.domElement);
				return s;
			}
		};
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
