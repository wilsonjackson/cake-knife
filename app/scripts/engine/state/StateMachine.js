Engine.module('state.StateMachine',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @param {object} states
		 * @param {object} [internals]
		 * @constructor
		 */
		function StateMachine(states, internals) {
			this.current = null;
			this.states = states;
			this.stack = [];
			if (internals) {
				for (var i in internals) {
					if (internals.hasOwnProperty(i)) {
						this[i] = internals[i];
					}
				}
			}
		}

		StateMachine.prototype.changeState = function (stateName) {
			if (!this.states[stateName]) {
				throw 'State ' + stateName + ' is not defined';
			}
			if (this.current === this.states[stateName]) {
				return;
			}
			if (this.current && this.current.exit) {
				this.current.exit(this);
			}
			this.current = this.states[stateName];
			if (this.current.enter) {
				this.current.enter(this);
			}
		};

		StateMachine.prototype.pushState = function (stateName) {
			this.stack.push(this.current);
			this.changeState(stateName);
		};

		StateMachine.prototype.popState = function () {
			if (this.current === null) {
				throw 'Cannot pop state: no active state';
			}
			if (this.current.exit) {
				this.current.exit(this);
			}
			this.current = this.stack.pop();
			if (this.current.enter) {
				this.current.enter(this);
			}
		};

		StateMachine.prototype.event = function (eventName, params) {
			if (this.current === null) {
				throw 'Cannot dispatch event "' + eventName + '": no active state';
			}
			else if (!this.current[eventName]) {
				throw 'Unsupported event: "' + eventName + '"';
			}
			this.current[eventName](this, params);
		};

		return StateMachine;
	});
