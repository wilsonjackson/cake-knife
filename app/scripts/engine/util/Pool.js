Engine.module('util.Pool',
	[
		'util.Arrays'
	],
	/**
	 *
	 * @param {Arrays} Arrays
	 * @returns {Pool}
	 */
	function (Arrays) {
		'use strict';

		/**
		 *
		 * @param {number} maxSize
		 * @param {function} factory
		 * @constructor
		 */
		function Pool(maxSize, factory) {
			this.maxSize = maxSize;
			this.factory = factory;
			this._pool = [];
		}

		Pool.prototype.preallocate = function (numToAllocate) {
			numToAllocate = numToAllocate || this.maxSize;
			for (var i = 0; i < numToAllocate; i++) {
				this._pool.push(this.factory());
			}
			return this;
		};

		Pool.prototype.acquire = function () {
			if (this._pool.length > 0) {
				return this._pool.pop();
			}
			return this.factory();
		};

		Pool.prototype.release = function (object) {
			if (this._pool.length < this.maxSize) {
				this._pool.push(object);
			}
		};

		Pool.prototype.clear = function () {
			Arrays.empty(this._pool);
		};

		return Pool;
	});
