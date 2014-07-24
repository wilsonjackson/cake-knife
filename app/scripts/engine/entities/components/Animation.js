Engine.module('entities.components.Animation',
	[
		'state.StateMachine'
	],
	function (StateMachine) {
		'use strict';

		function Animation(animations, initial) {
			this.params = {};
			var current = this.current = {animation: null};

			this.state = new StateMachine(animations, {
				setAnimation: function (animation) {
					current.animation = animation;
				}
			});
			this.state.changeState(initial);
		}

		Animation.prototype.name = 'animation';

		Animation.prototype.setParam = function (name, value) {
			this.params[name] = value;
		};

		Animation.prototype.nextFrame = function () {
			// Update state machine
			this.state.event('update', this.params);
			// Get next frame from the current animation
			var frame = this.current.animation.nextFrame();
			if (!frame) {
				// Auto-rewind
				this.current.animation.reset();
				frame = this.current.animation.nextFrame();
			}
			return frame;
		};

		return Animation;
	});
