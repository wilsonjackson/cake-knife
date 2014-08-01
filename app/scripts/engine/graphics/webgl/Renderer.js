Engine.module('graphics.webgl.Renderer',
	[
		'resources.ResourceLoader',
		'graphics.webgl.BatchRenderer'
	],
	function (ResourceLoader, BatchRenderer) {
		'use strict';

		var ENABLE_LOG = true;

		var FLAG_OPAQUE = 1;

		var MAX_DEPTHS = 64;
		var DEPTH_SHIFT = 4;
		var DEPTH_MASK = MAX_DEPTHS - 1 << DEPTH_SHIFT;

		var MAX_TEXTURES = 256;
		var TEXTURE_SHIFT = 10;
		var TEXTURE_MASK = MAX_TEXTURES - 1 << TEXTURE_SHIFT;

		/**
		 *
		 * @param gl
		 * @param program
		 * @param textures
		 * @constructor
		 */
		function Renderer(gl, program, textures) {
			this.gl = gl;
			this.program = program;
			this.textures = textures;

			this.textureBitIdx = {};
			this.textureRevIdx = {};
			this.depthBitIdx = {};
			this.depthRevIdx = {};
			this.nextDepth = 1;
			this.batchIdx = {};
			this.batches = [];

			var self = this;
			ResourceLoader.observe(function (status) {
				if (status.finished) {
					self.assignTextureBits();
				}
			});

			this.renders = 0;
			this.batchRenders = 0;
			this.objectsRendered = 0;
			this.log = {};

			this.createAttributes();
			this.initBuffer();
		}

		Renderer.prototype.createAttributes = function () {
			var gl = this.gl;
			this.positionAttribute = gl.getAttribLocation(this.program, 'aVertexPosition');
			gl.enableVertexAttribArray(this.positionAttribute);

			this.textureAttribute = gl.getAttribLocation(this.program, 'aTextureCoords');
			gl.enableVertexAttribArray(this.textureAttribute);
		};

		Renderer.prototype.initBuffer = function () {
			var gl = this.gl;
			this.vertexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, 6000 * 6 * 4, gl.DYNAMIC_DRAW);
		};

		Renderer.prototype.assignTextureBits = function () {
			var srcUrls = Object.keys(this.textures);
			if (srcUrls.length > MAX_TEXTURES) {
				throw new Error('Max allowed number of textures is ' + MAX_TEXTURES + '; ' + srcUrls.length + ' loaded');
			}
			var textureId = 1;
			var bits;
			for (var i = 0, l = srcUrls.length; i < l; i++) {
				bits = textureId << TEXTURE_SHIFT;
				this.textureBitIdx[srcUrls[i]] = bits;
				this.textureRevIdx[bits] = this.textures[srcUrls[i]];
				textureId++;
			}
			this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[srcUrls[1]].texture);
		};

		Renderer.prototype.assignDepthBit = function (d) {
			var depthBit = this.nextDepth << DEPTH_SHIFT;
			this.depthBitIdx[d] = depthBit;
			this.depthRevIdx[depthBit] = d;
			this.nextDepth++;
		};

		Renderer.prototype.drawImage = function (image, x, y, w, h, u, v, d) {
			if (!this.depthBitIdx[d]) {
				this.assignDepthBit(d);
			}
			var state = this.textureBitIdx[image.src] | this.depthBitIdx[d];

			if (!this.batchIdx[state]) {
				var batch = new BatchRenderer(state, this.gl, this.program, this.textures);
				this.batchIdx[state] = batch;
				this.batches.push(batch);
			}
			this.batchIdx[state].drawImage(image, x, y, w, h, u, v, d);
		};

		Renderer.prototype.activateState = function (state) {
			var gl = this.gl;
			// Maybe check whether a change is needed at all by tracking & comparing currentState?
			if ((state & FLAG_OPAQUE)) {
				gl.depthMask(true);
				gl.disable(gl.BLEND);
			}
			else {
				gl.depthMask(false);
				gl.enable(gl.BLEND);
			}
			gl.bindTexture(gl.TEXTURE_2D, this.textureRevIdx[state & TEXTURE_MASK].texture);
		};

		Renderer.prototype.flush = function () {
			var self = this;
			var gl = this.gl;
			var i, l, t;
			var state, bufferSize;

			this.batches.sort(function (a, b) {
				if ((a.state & FLAG_OPAQUE) === (b.state & FLAG_OPAQUE)) {
					var aDepth = self.depthRevIdx[a.state & DEPTH_MASK];
					var bDepth = self.depthRevIdx[b.state & DEPTH_MASK];
					if (aDepth === bDepth) {
						return 0;
					}
					return aDepth < bDepth ? -1 : 1;
				}
				return (a.state & FLAG_OPAQUE) > (b.state & FLAG_OPAQUE) ? -1 : 1;
			});

			var stride = 4 * 4;
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
			gl.vertexAttribPointer(this.positionAttribute, 2, gl.FLOAT, false, stride, 0);
			gl.vertexAttribPointer(this.textureAttribute, 2, gl.FLOAT, false, stride, 2 * 4);

			var offsets = [];
			var nextOffset = 0;
			var bufferTime;
			for (i = 0, l = this.batches.length; i < l; i++) {
				offsets.push(nextOffset);
				t = Date.now();
				nextOffset += this.batches[i].buffer(this.gl, nextOffset * 4 * 4);
				bufferTime = Date.now() - t;
				if (ENABLE_LOG) {
					state = this.batches[i].state;
					if (!this.log[state]) {
						initLog(this.log, state, this.textureRevIdx);
					}
					this.log[state].bufferTime.push(bufferTime);
				}
			}

			var activateTime, flushTime;
			for (i = 0, l = this.batches.length; i < l; i++) {
				state = this.batches[i].state;
				t = Date.now();
				this.activateState(state);
				activateTime = Date.now() - t;

				t = Date.now();
				bufferSize = this.batches[i].flush(this.gl, offsets[i]);
				flushTime = Date.now() - t;
				if (bufferSize > 0) {
					this.batchRenders++;
					this.objectsRendered += bufferSize;
				}

				if (ENABLE_LOG) {
					if (!this.log[state]) {
						initLog(this.log, state, this.textureRevIdx);
						this.log[state] = {
							imageUrl: this.textureRevIdx[state & TEXTURE_MASK].image.src,
							depth: (state & DEPTH_MASK) >> DEPTH_SHIFT,
							renders: 0,
							objects: [],
							activateTime: [],
							flushTime: []
						};
					}
					this.log[state].renders++;
					this.log[state].objects.push(bufferSize);
					this.log[state].activateTime.push(activateTime);
					this.log[state].flushTime.push(flushTime);
				}
			}
			this.renders++;
		};

		function initLog(log, state, texIdx) {
			return (log[state] = {
				imageUrl: texIdx[state & TEXTURE_MASK].image.src,
				depth: (state & DEPTH_MASK) >> DEPTH_SHIFT,
				renders: 0,
				objects: [],
				bufferTime: [],
				activateTime: [],
				flushTime: []
			});
		}

		return Renderer;
	});
