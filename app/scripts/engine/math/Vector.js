Engine.module('math.Vector', function () {
	'use strict';

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @constructor
	 */
	function Vector(x, y) {
		this.x = x;
		this.y = y;
	}

	Vector.prototype.length = function () {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};

	Vector.prototype.unit = function () {
		var l = this.length();
		return new Vector(this.x / l, this.y / l);
	};

	Vector.prototype.add = function (vector) {
		return new Vector(this.x + vector.x, this.y + vector.y);
	};

	Vector.prototype.subtract = function (vector) {
		return new Vector(this.x - vector.x, this.y - vector.y);
	};

	Vector.prototype.multiply = function (scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	};

	Vector.prototype.dotProduct = function (vector) {
		return this.x * vector.x + this.y * vector.y;
	};

	Vector.prototype.interpolate = function (vector, alpha) {
		return new Vector(this.x * alpha + vector.x * (1 - alpha), this.y * alpha + vector.y * (1 - alpha));
	};

	Vector.prototype.equals = function (vector) {
		return this.x === vector.x && this.y === vector.y;
	};

	Vector.prototype.toString = function () {
		return 'Vector(' + this.x + ', ' + this.y + ')';
	};

	return Vector;
});
