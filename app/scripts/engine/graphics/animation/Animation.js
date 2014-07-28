Engine.module('graphics.animation.Animation',
	[
		'graphics.sprite.Sprite',
		'graphics.sprite.SpriteRepository'
	],
	function (Sprite, SpriteRepository) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function Animation() {
			this.defaultDuration = 1;
			this.frames = [];
			this.currentFrame = -1;
		}

		Animation.prototype.setDefaultDuration = function (defaultDuration) {
			this.defaultDuration = defaultDuration;
			return this;
		};

		Animation.prototype.addFrames = function (frames) {
			var self = this;
			frames.forEach(function (frame) {
				self.addFrame(frame);
			});
			return this;
		};

		/**
		 *
		 * @param frame
		 * @param [duration]
		 */
		Animation.prototype.addFrame = function (frame, duration) {
			if (frame instanceof Sprite) {
				frame = new Frame(frame, duration || this.defaultDuration);
			}
			else if (typeof frame === 'string') {
				frame = new Frame(SpriteRepository.retrieve(frame), duration || this.defaultDuration);
			}
			this.frames.push(frame);
			return this;
		};

		Animation.prototype.nextFrame = function (tick) {
			if (this.currentFrame === -1) {
				// Starting animation
				++this.currentFrame;
				this.frameStart = tick;
			}
			// Has this frame's duration been reached?
			if (this.frameStart + this.frames[this.currentFrame].duration < tick) {
				// Yes — advance to next frame
				++this.currentFrame;
				this.frameStart = tick;
			}
			// Are we out of frames?
			if (this.currentFrame >= this.frames.length) {
				return null;
			}
			return this.frames[this.currentFrame];
		};

		Animation.prototype.reset = function () {
			this.currentFrame = -1;
		};

		function Frame(sprite, duration) {
			this.sprite = sprite;
			this.duration = duration;
		}

//		Frame.

		return Animation;
	});
