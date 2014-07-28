Engine.module('cake.components.Animated',
	[
		'state.StateMachine'
	],
	function (StateMachine) {
		'use strict';

		function Animated(animations, initial) {
			this.params = {};
			var current = this.current = {animation: null};

			this.state = new StateMachine(animations, {
				setAnimation: function (animation) {
					current.animation = animation;
				}
			});
			this.state.changeState(initial);
		}

		Animated.prototype.name = 'animated';

		Animated.prototype.setParam = function (name, value) {
			this.params[name] = value;
		};

		Animated.prototype.nextFrame = function (tick) {
			// Update state machine
			this.state.event('update', this.params);
			// Get next frame from the current animation
			var frame = this.current.animation.nextFrame(tick);
			if (!frame) {
				// Auto-rewind
				this.current.animation.reset();
				frame = this.current.animation.nextFrame(tick);
			}
			return frame;
		};

		return Animated;
	});
