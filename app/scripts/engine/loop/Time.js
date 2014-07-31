Engine.module('loop.Time',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @param {number} dt Time per tick in ms
		 * @constructor
		 */
		function Time(dt) {
			this.dt = dt;
			this.startTime = null;
			this.intervalAtSuspend = null;
			this.nextTick = null;
			this.current = new CurrentTime(dt);
		}

		Time.prototype.start = function () {
			this.startTime = Date.now();
			this.nextTick = this.startTime + this.dt;
		};

		Time.prototype.isTickDue = function () {
			var now = Date.now();
			if (this.intervalAtSuspend === null && now >= this.nextTick) {
				++this.current.ticks;
				this.current.gameTime += this.dt;
				this.current.realTime = now - this.startTime;
				this.nextTick += this.dt;
				return true;
			}
			this.current.alpha = (this.nextTick - now) / this.dt;
			return false;
		};

		Time.prototype.suspend = function () {
			if (this.intervalAtSuspend === null) {
				this.intervalAtSuspend = this.nextTick - Date.now();
			}
		};

		Time.prototype.resume = function () {
			if (this.intervalAtSuspend !== null) {
				this.nextTick = Date.now() + this.intervalAtSuspend;
				this.intervalAtSuspend = null;
			}
		};

		/**
		 *
		 * @param {number} dt Time per tick in ms
		 * @constructor
		 */
		function CurrentTime(dt) {
			this.ticks = 0;
			this.dt = dt;
			this.gameTime = 0;
			this.realTime = 0;
			this.alpha = 0;
		}

		CurrentTime.prototype.toString = function () {
			return 'CurrentTime(dt=' + this.dt + ', gameTime=' + this.gameTime + ', realTime=' + this.realTime +
				', alpha=' + this.alpha + ')';
		};

		return Time;
	});
