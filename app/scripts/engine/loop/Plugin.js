Engine.module('loop.Plugin', function () {
	'use strict';

	/**
	 *
	 * @constructor
	 */
	function Plugin() {}
	Plugin.prototype.start = function (/*viewport*/) {};
	Plugin.prototype.preUpdate = function (/*scene, time, input*/) {};
	Plugin.prototype.postUpdate = function (/*scene, time, input*/) {};
	Plugin.prototype.preRender = function (/*scene, time, viewport*/) {};
	Plugin.prototype.postRender = function (/*scene, time, viewport*/) {};
	Plugin.prototype.suspend = function () {};
	Plugin.prototype.resume = function () {};

	return Plugin;
});
