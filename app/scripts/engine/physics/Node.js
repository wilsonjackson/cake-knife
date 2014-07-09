Engine.module('physics.Node',
	[
		'math.Vector',
		'util.Events'
	],
	function (Vector, Events) {
		'use strict';

		function isFunction(o) {
			return !!(o && o.constructor && o.call && o.apply);
		}

		function Node(id, category, bounds, orientation, object) {
			Events.mixin(this);
			this._id = id;
			this.category = category;
			this.object = object;
			this.bounds = bounds;
			this.orientation = orientation;
			//noinspection JSUnusedGlobalSymbols
			this.lastOrientation = null;
			this.nextMovement = new Vector(0, 0);
			this.currentMovement = new Vector(0, 0);

			this.isStatic = false;
			this.collidable = true;
			this.collisionListeners = [];
			this.isColliding = false;
			//noinspection JSUnusedGlobalSymbols
			this.isRotated = false;
		}

		Node.prototype.setStatic = function () {
			this.isStatic = true;
			return this;
		};

		Node.prototype.onDestroy = function (fn) {
			this.on('destroy', fn);
		};

		//noinspection JSUnusedGlobalSymbols
		Node.prototype.addCollisionListener = function (listener) {
			if (isFunction(listener)) {
				listener = {
					solveCollision: function () {},
					collide: listener
				};
			}
			this.collisionListeners[this.collisionListeners.length] = listener;
		};

		Node.prototype.impulse = function (x, y) {
			this.nextMovement = this.nextMovement.add(new Vector(x, y));
		};

		Node.prototype.getOrientation = function () {
			return this.orientation;
		};

		//noinspection JSUnusedGlobalSymbols
		Node.prototype.setOrientation = function (orientation) {
			// Detect x/y orientation change
			if ((orientation.asRadians() + this.orientation.asRadians()) % Math.PI > 0) {
				this.bounds.rotate();
				//noinspection JSUnusedGlobalSymbols
				this.isRotated = true;
			}
			//noinspection JSUnusedGlobalSymbols
			this.lastOrientation = this.orientation;
			this.orientation = orientation;
		};

		Node.prototype.getX = function () {
			return this.bounds.left();
		};

		Node.prototype.getY = function () {
			return this.bounds.top();
		};

		Node.prototype.getWidth = function () {
			return this.bounds.width();
		};

		Node.prototype.getHeight = function () {
			return this.bounds.height();
		};

		Node.prototype.getCenter = function () {
			return this.bounds.center();
		};

		Node.prototype.integrate = function () {
			this.bounds.move(this.nextMovement);
			this.currentMovement = this.nextMovement;
			this.nextMovement = new Vector(0, 0);
			this.isColliding = false;
		};

		Node.prototype.solveCollision = function (collision, world) {
			for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
				var adjustment = this.collisionListeners[i].solveCollision(collision, world);
				if (adjustment) {
					return adjustment;
				}
			}
		};

		Node.prototype.collide = function (collision, world) {
			for (var i = 0, len = this.collisionListeners.length; i < len; i++) {
				this.collisionListeners[i].collide(collision, world);
				this.isColliding = true;
			}
		};

		Node.prototype.destroy = function () {
			this.collidable = false;
			this.trigger('destroy', this);
			delete this.object;
			delete this.bounds;
			delete this.nextMovement;
			delete this.currentMovement;
			this.collisionListeners = [];
			Events.destroyMixin(this);
		};

		Node.prototype.toString = function () {
			return 'Node(id=' + this._id + ', category=' + this.category + ', bounds=' + this.bounds + ')';
		};

		return Node;
	});
