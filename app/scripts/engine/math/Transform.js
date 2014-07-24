Engine.module('math.Transform',
	[
		'math.Vector',
		'math.BoundingRect'
	],
	function (Vector, BoundingRect) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function Transform() {
			this.size = new Vector(0, 0);
			this.position = new Vector(0, 0);
			this.rotation = 0;
		}

		Transform.prototype.scale = function (scale) {
			this.size = this.size.add(scale);
		};

		Transform.prototype.translate = function (translation) {
			this.position = this.position.add(translation);
		};

		Transform.prototype.rotate = function (rotation) {
			this.rotation += rotation;
		};

		Transform.prototype.transform = function (transform) {
			this.scale(transform.size);
			this.translate(transform.position);
			this.rotate(transform.rotation);
		};

		Transform.prototype.zero = function () {
			this.size = new Vector(0, 0);
			this.position = new Vector(0, 0);
			this.rotation = 0;
		};

		Transform.prototype.getBounds = function () {
			return new BoundingRect(this.position, this.size);
		};

		Transform.prototype.clone = function () {
			var clone = new Transform();
			clone.scale(this.size);
			clone.translate(this.position);
			clone.rotate(this.rotation);
			return clone;
		};

		Transform.prototype.toString = function () {
			return 'Transform(size=' + this.size + ', position=' + this.position + ', rotation=' + this.rotation + ')';
		};

		return Transform;
	});
