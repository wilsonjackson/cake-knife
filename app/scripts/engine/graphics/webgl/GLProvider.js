Engine.module('graphics.webgl.GLProvider',
	[
		'graphics.Layer',
		'graphics.webgl.GLGraphics',
		'graphics.webgl.GLUtils'
	],
	/**
	 *
	 * @param {Layer} Layer
	 * @param {GLGraphics} GLGraphics
	 * @param {GLUtils} WebGLUtils
	 * @returns {GLProvider}
	 */
	function (Layer, GLGraphics, WebGLUtils) {
		'use strict';

		function GLProvider() {
		}

		GLProvider.prototype.createLayer = function (index, trackScene, viewport) {
			return new Layer(index, trackScene, viewport, new GLGraphics(index));
		};

		GLProvider.prototype.flush = function () {
			WebGLUtils.renderer.flush();
		};

		return GLProvider;
	});
