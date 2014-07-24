Engine.module('loop.Plugin', function () {
	'use strict';

	/**
	 *
	 * @constructor
	 */
	function Plugin() {}
	Plugin.prototype.start = function (/*viewport*/) {};
	Plugin.prototype.preUpdate = function (/*scene, input*/) {};
	Plugin.prototype.postUpdate = function (/*scene, input*/) {};
	Plugin.prototype.preRender = function (/*scene, viewport*/) {};
	Plugin.prototype.postRender = function (/*scene, viewport*/) {};
	Plugin.prototype.suspend = function () {};
	Plugin.prototype.resume = function () {};

	return Plugin;
});
