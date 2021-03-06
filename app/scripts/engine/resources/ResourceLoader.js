Engine.module('resources.ResourceLoader',
	[],
	function () {
		'use strict';

		var queue = [];

		/**
		 *
		 * @constructor
		 */
		function ResourceLoader() {
			this.loading = false;
			this.observers = [];
		}

		ResourceLoader.prototype.observe = function (observerFn) {
			this.observers.push(observerFn);
		};

		ResourceLoader.prototype.load = function () {
			this.loading = true;
			var self = this;
			var total = 0;
			var errors = 0;

			function load(resource) {
				return resource.load()
					.then(function (data) {
						notifyObservers({loaded: resource, finished: false});
						Engine.logger.debug(resource + ' loaded; ' + queue.length + ' resource(s) remaining');
						return data;
					})
					.catch(function (reason) {
						errors++;
						if (reason instanceof Error) {
							Engine.logger.error(reason);
						}
						else {
							Engine.logger.error('Failed loading ' + resource + ': ' + reason);
						}
						throw new Error('Failed loading ' + resource + ': ' + reason);
					});
			}

			function notifyObservers(resource) {
				for (var i = 0, l = self.observers.length; i < l; i++) {
					self.observers[i](resource);
				}
			}

			function emptyQueue() {
				var promises = [];
				total += queue.length;
				Engine.logger.info('Loading ' + queue.length + ' resource(s)');
				while (queue.length > 0) {
					promises.push(load(queue.shift()));
				}
				return Q.all(promises);
			}

			return emptyQueue()
				.then(function (result) {
					if (queue.length > 0) {
						// More resources queued by loaded resources
						return emptyQueue();
					}
					return result;
				})
				.finally(function () {
					self.loading = false;
					notifyObservers({loaded: null, finished: true});
					Engine.logger.info('Done loading resources (' + total + ' file(s) with ' + errors + ' error(s))');
				});
		};

		ResourceLoader.prototype.enqueue = function (resource) {
			if (this.loading) {
				Engine.logger.debug('Added resource ' + resource + ' to pending queue');
			}
			queue.push(resource);
			return resource;
		};

		return new ResourceLoader();
	});
