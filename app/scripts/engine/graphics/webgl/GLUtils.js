Engine.module('graphics.webgl.GLUtils',
	[
		'resources.ResourceLoader',
		'graphics.webgl.Renderer'
	],
	/**
	 *
	 * @param {ResourceLoader} ResourceLoader
	 * @param {Renderer} Renderer
	 * @returns {GLUtils}
	 */
	function (ResourceLoader, Renderer) {
		'use strict';

		var VERTEX_SHADER_ELEMENT = 'shader-vs';
		var FRAGMENT_SHADER_ELEMENT = 'shader-fs';

		/**
		 *
		 * @constructor
		 */
		function GLUtils() {
			this.gl = null;
			this.program = null;
			this.shaders = null;
			this.textures = null;
			this.width = 0;
			this.height = 0;

			this.viewportDimensionsUniform = null;
			this.worldTranslationUniform = null;

			this.renderer = null;
		}

		/**
		 *
		 * @param {HTMLCanvasElement} canvas
		 */
		GLUtils.prototype.init = function (canvas) {
			if (Engine.config.disableWebGL) {
				throw new Error('WebGL has been disabled by configuration.');
			}
			var self = this;
			this.shaders = [];
			this.textures = {};
			this.width = canvas.width;
			this.height = canvas.height;

			var gl = this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			gl.viewport(0, 0, this.width, this.height);
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
			this.createProgram(
				this.createShader(VERTEX_SHADER_ELEMENT),
				this.createShader(FRAGMENT_SHADER_ELEMENT));

			// On successful initialization, watch for the resource loader and send all images to the GPU.
			ResourceLoader.observe(function (status) {
				if (!status.finished && status.loaded.getImage) {
					console.log('loaded ' + status.loaded.getImage().src);
					self.createTexture(status.loaded.getImage());
				}
			});

			this.renderer = new Renderer(this.gl, this.program, this.textures);

			initCp(this, gl);
			return gl;
		};

		GLUtils.prototype.createProgram = function (vertexShader, fragmentShader) {
			var gl = this.gl;
			this.program = gl.createProgram();
			gl.attachShader(this.program, vertexShader);
			gl.attachShader(this.program, fragmentShader);
			gl.linkProgram(this.program);
			if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
				throw new Error('Failed linking program');
			}
			gl.useProgram(this.program);

			this.setUniforms();
		};

		GLUtils.prototype.createShader = function (shaderElementId) {
			var gl = this.gl;
			var shaderDef = this.getShaderDefinition(shaderElementId);
			var shader = gl.createShader(shaderDef.type);
			gl.shaderSource(shader, shaderDef.source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw new Error('Failed to compile shader "' + shaderElementId + '"');
			}
			this.shaders.push({
				definition: shaderDef,
				shader: shader
			});
			return shader;
		};

		GLUtils.prototype.getShaderDefinition = function (shaderElementId) {
			var def = {};
			var shaderElement = document.getElementById(shaderElementId);
			var mimeType = shaderElement.getAttribute('type');
			switch (mimeType) {
				case 'x-shader/x-vertex':
					def.type = this.gl.VERTEX_SHADER;
					break;
				case 'x-shader/x-fragment':
					def.type = this.gl.FRAGMENT_SHADER;
					break;
				default:
					throw new Error('Shader "' + shaderElementId + '" has unknown type: ' + mimeType);
			}
			def.source = document.getElementById(shaderElementId).textContent;
			return def;
		};

		GLUtils.prototype.setUniforms = function () {
			var gl = this.gl;

			this.viewportDimensionsUniform = gl.getUniformLocation(this.program, 'uViewportDimensions');
			gl.uniform2f(this.viewportDimensionsUniform, this.width, this.height);

			this.worldTranslationUniform = gl.getUniformLocation(this.program, 'uWorldTranslation');
			gl.uniform2f(this.worldTranslationUniform, 0, 0);
		};

		GLUtils.prototype.createTexture = function (image) {
			var gl = this.gl;
			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			// These parameters disable certain WebGL features in order to allow non-power-of-two image sizes.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.bindTexture(gl.TEXTURE_2D, null);
			this.textures[image.src] = {
				image: image,
				texture: texture
			};
		};

		function initCp(webGl, gl) {
			window.gl = {
				gl: gl,
				stats: function () {
					console.log('Renders: ' + webGl.renderer.renders);
					console.log('Batch renders: ' + webGl.renderer.batchRenders);
					console.log('Objects rendered: ' + webGl.renderer.objectsRendered);
					console.log('Batch stats:');
					console.log('------------');
					for (var i in webGl.renderer.log) {
						if (!webGl.renderer.log.hasOwnProperty(i)) {
							continue;
						}
						var stats = webGl.renderer.log[i];
						console.log('[' + i + ']');
						console.log('    imageUrl: ' + stats.imageUrl);
						console.log('    depth: ' + stats.depth);
						console.log('    renders: ' + stats.renders);
						console.log('    objects flushed: ' + stats.objects.reduce(sum));
						console.log('    avg buffer time: ' + stats.bufferTime.reduce(sum) / stats.bufferTime.length);
						console.log('    avg activate time: ' + stats.activateTime.reduce(sum) / stats.activateTime.length);
						console.log('    avg flush time: ' + stats.flushTime.reduce(sum) / stats.flushTime.length);
					}
				}
			};

			function sum(a, b) {
				return a + b;
			}
		}

		return new GLUtils();
	});
