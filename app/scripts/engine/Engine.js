(function (window, document) {
	'use strict';

	var modules = {};
	var ticker;

	var Engine = {};

	Engine.init = function (config) {
		checkNotInitialized();
		this.config = config;

		this.module('core.Engine',
			[
				'logging.DefaultLogger',
				'resources.ResourceLoader',
				'loop.PluginRegistry',
				'loop.Plugin',
				'loop.Ticker'
			],
			this._initGameLoop.bind(this));

		this.injector = new Engine.Injector();
		this.injector.load(modules);
		modules = {};
	};

	Engine._initGameLoop = function (DefaultLogger, ResourceLoader, PluginRegistry, Plugin, Ticker) {
		this.logger = new DefaultLogger();
		this.resourceLoader = ResourceLoader;
		this.pluginRegistry = new PluginRegistry();
		this._initPlugins(this.config.plugins || [], Plugin);
		ticker = new Ticker();
		registerGlobalEventHandlers();
	};

	Engine._initPlugins = function (plugins, Plugin) {
		var self = this;
		plugins.forEach(function (pluginName) {
			self.logger.info('Loading plugin: ' + pluginName);
			var PluginArtifact = self.injector.get(pluginName);
			if (PluginArtifact instanceof Plugin) {
				self.pluginRegistry.add(PluginArtifact);
			}
			else {
				self.pluginRegistry.add(new PluginArtifact());
			}
		});
		this.pluginRegistry.update();
	};

	Engine.start = function () {
		Engine.logger.info('Starting preload');
		this.resourceLoader.load().then(function () {
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

	Engine.getTicks = function () {
		return !!ticker ? ticker.time.current.ticks : 0;
	};

	Engine.getViewport = function () {
		return ticker.viewport;
	};

	Engine.getScene = function () {
		return ticker.state;
	};

	Engine.setScene = function (scene) {
		ticker.state = scene;
//		scene.activate();
	};

	Engine.pushScene = function (scene) {
		ticker.states.push(ticker.state);
		ticker.state = scene;
//		scene.activate();
	};

	Engine.popScene = function () {
		if (ticker.states.length > 0) {
			ticker.state = ticker.states.pop();
//			ticker.state.activate();
		}
		else {
			ticker.state = null;
		}
	};

	Engine.module = function (name, deps, module) {
		modules[name] = [deps, module];
	};

	Engine.Injector = function () {
		this.artifacts = {};
		this.loaded = {};
	};

	Engine.Injector.prototype.load = function (modules) {
		var names = Object.keys(modules);
		var stack = [];
		for (var i = 0, len = names.length; i < len; i++) {
			mod(modules, names[i], stack, this.loaded, this.artifacts);
		}
	};

	Engine.Injector.prototype.get = function (name) {
		return this.artifacts[name];
	};

	Engine.Injector.prototype.override = function (name, value) {
		if (!this.artifacts[name]) {
			throw new Error('Cannot override unknown artifact "' + name + '"');
		}
		this.artifacts[name] = value;
	};

	function checkNotInitialized() {
		if (ticker) {
			throw new Error('Engine already initialized');
		}
	}

	function mod(modules, name, stack, loaded, artifacts) {
		if (loaded[name]) {
			return artifacts[name];
		}
		if (name.indexOf('.') === -1) {
			throw new Error('Illegal module name: ' + name + ' (Module names must include a dot)');
		}
		if (stack.indexOf(name) !== -1) {
			throw new Error('Circular module dependency: ' + stack.join(' -> ') + ' -> ' + name);
		}
		if (!modules[name]) {
			throw new Error('Unknown module: ' + name +
				(stack.length > 0 ? ' (dependency of ' + stack[stack.length - 1] + ')' : ''));
		}

		var hasDeps = !!modules[name][0].push;
		var deps = hasDeps ? modules[name][0] : [];
		var fn = modules[name][hasDeps ? 1 : 0];
		var args = [];

		stack.push(name);
		for (var i = 0, len = deps.length; i < len; i++) {
			args.push(mod(modules, deps[i], stack, loaded, artifacts));
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
})(window, document);
