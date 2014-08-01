/* jshint bitwise: false */
Engine.module('graphics.webgl.BatchRenderer',
	[],
	function () {
		'use strict';

		/**
		 *
		 * @param state
		 * @param gl
		 * @param program
		 * @param textures
		 * @constructor
		 */
		function BatchRenderer(state, gl, program, textures) {
			this.state = state;
			this.gl = gl;
			this.program = program;
			this.textures = textures;

			this.batch = new Float32Array(6000 * 6 * 4);
			this.bufferSize = 0;
			this.idx = 0;
		}

		BatchRenderer.prototype.drawImage = function (image, x, y, w, h, u, v) {
			var width = image.nativeWidth || image.width;
			var height = image.nativeHeight || image.height;
			var widthInv = 1 / width;
			var heightInv = 1 / height;
			var x1 = x;
			var x2 = x + w;
			var y1 = y;
			var y2 = y + h;
			var u1 = u * widthInv;
			var u2 = u1 + w * widthInv;
			var v1 = v * heightInv;
			var v2 = v1 + h * heightInv;

			var idx = this.idx;

			this.batch[idx++] = x1;
			this.batch[idx++] = y1;
			this.batch[idx++] = u1;
			this.batch[idx++] = v1;

			this.batch[idx++] = x2;
			this.batch[idx++] = y1;
			this.batch[idx++] = u2;
			this.batch[idx++] = v1;

			this.batch[idx++] = x1;
			this.batch[idx++] = y2;
			this.batch[idx++] = u1;
			this.batch[idx++] = v2;

			this.batch[idx++] = x1;
			this.batch[idx++] = y2;
			this.batch[idx++] = u1;
			this.batch[idx++] = v2;

			this.batch[idx++] = x2;
			this.batch[idx++] = y1;
			this.batch[idx++] = u2;
			this.batch[idx++] = v1;

			this.batch[idx++] = x2;
			this.batch[idx++] = y2;
			this.batch[idx++] = u2;
			this.batch[idx++] = v2;

			this.idx = idx;

			++this.bufferSize;
		};

		/**
		 *
		 * @param gl
		 * @param offset
		 * @returns {number} Number of buffered items (vertices)
		 */
		BatchRenderer.prototype.buffer = function (gl, offset) {
			gl.bufferSubData(gl.ARRAY_BUFFER, offset, this.batch.subarray(0, this.idx));
			return this.bufferSize * 6;
		};

		/**
		 *
		 * @param gl
		 * @param offset
		 * @returns {number} Number of flushed objects (sprites)
		 */
		BatchRenderer.prototype.flush = function (gl, offset) {
			var bufferSize = this.bufferSize;
			if (this.bufferSize > 0) {
				gl.drawArrays(gl.TRIANGLES, offset, 6 * this.bufferSize);
				this.bufferSize = 0;
				this.idx = 0;
			}
			return bufferSize;
		};

		return BatchRenderer;
	});
