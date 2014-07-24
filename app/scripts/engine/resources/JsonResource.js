Engine.module('resources.JsonResource',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @param {string} url
		 * @constructor
		 */
		function JsonResource(url) {
			this.url = url;
			this.deferred = Q.defer();
			this.promise = this.deferred.promise;
			this.data = null;
			this.length = null;
		}

		JsonResource.prototype.load = function () {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', 'assets/' + this.url);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					this.length = xhr.responseText.length;
					this.data = JSON.parse(xhr.responseText);
					this.deferred.fulfill(this.data);
				}
			}.bind(this);
			xhr.onerror = this.deferred.reject.bind(this.deferred);
			xhr.send();
			return this.promise;
		};

		JsonResource.prototype.onLoad = function (fn) {
			this.promise = this.promise.then(function () {
				fn(this.data);
			}.bind(this));
		};

		JsonResource.prototype.toString = function () {
			return 'JsonResource(url=' + this.url +
				(this.length !== null ? ', length=' + this.length : '') +
				')';
		};

		return JsonResource;
	});
