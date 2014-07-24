Engine.module('entities.Entity',
	[
		'util.Events'
	],
	function (Events) {
		'use strict';

//		var DEBUG_COLLISIONS = false;
//		var DEBUG_SPRITE = false;
		var id = 0;

		function Entity() {
			Events.mixin(this);
			this.id = ++id;
			this.displays = {};
			this.initComponents();
			this.initBehaviors();
			this.initDisplays();
		}

		Entity.prototype.componentTypes = Object.freeze([]);
		Entity.prototype.defaultBehaviors = Object.freeze([]);
		Entity.prototype.defaultDisplays = Object.freeze([]);

		Entity.prototype.initComponents = function () {
			var l = this.componentTypes.length;
			this.components = new Array(l);
			for (var i = 0; i < l; i++) {
				var c = new (this.componentTypes[i])();
				this.components[c.name] = c;
			}
		};

		Entity.prototype.initBehaviors = function () {
			this.behaviors = {};
			for (var i = 0, l = this.defaultBehaviors.length; i < l; i++) {
				this.addBehavior(this.defaultBehaviors[i]);
			}
		};

		Entity.prototype.initDisplays = function () {
			this.displays = {};
			for (var i = 0, l = this.defaultDisplays.length; i < l; i++) {
				this.addDisplay(this.defaultDisplays[i]);
			}
		};

		Entity.prototype.getComponent = function (name) {
			return this.components[name] || null;
		};

		Entity.prototype.addBehavior = function (behavior) {
			this.behaviors[behavior] = true;
		};

		//noinspection JSUnusedGlobalSymbols
		Entity.prototype.removeBehavior = function (behavior) {
			this.behaviors[behavior] = false;
		};

		Entity.prototype.hasBehavior = function (behavior) {
			return !!this.behaviors[behavior];
		};

		//noinspection JSUnusedGlobalSymbols
		Entity.prototype.addDisplay = function (display) {
			this.displays[display] = true;
		};

		//noinspection JSUnusedGlobalSymbols
		Entity.prototype.removeDisplay = function (display) {
			this.displays[display] = false;
		};

		//noinspection JSUnusedGlobalSymbols
		Entity.prototype.hasDisplay = function (display) {
			return !!this.displays[display];
		};

//		Entity.prototype.init = function (x, y, orientation) {
//			this.transform.translate(new Vector(x, y));
//			this.transform.rotate(orientation.asRadians());
////			var dimensions = orientation.translateXY(this.sprite.getHitboxWidth(), this.sprite.getHitboxHeight());
////			var margins = orientation.translateXY(this.sprite.getLeftMargin(), this.sprite.getBottomMargin());
////			var leftEdge = x + margins.x;
////			var topEdge = y - dimensions.y - margins.y;
////			switch (this.nodeShape) {
////				case Entity.SHAPE_CIRCLE:
////					this.node = Physics.createCircleNode(
////						this.nodeCategory, leftEdge, topEdge, dimensions.x() / 2, orientation, this);
////					break;
////				case Entity.SHAPE_RECT:
////					this.node = Physics.createRectNode(
////						this.nodeCategory, leftEdge, topEdge, dimensions.x, dimensions.y, orientation, this);
////					break;
////			}
//			if (this._init) {
//				this._init();
//			}
//		};

		Entity.prototype.destroy = function () {
			this.trigger('destroy', this);
			Events.destroyMixin(this);
			if (this._destroy) {
				this._destroy();
			}
		};

//		Entity.prototype.update = function () {
//			return false;
//		};

//		Entity.prototype.render = function (viewport) {
//			var context;
//			viewport.getGraphics().drawSprite(this.sprite,
//					this.node.getX(),
//					this.node.getY() + this.node.getHeight(),
//				this.node.getOrientation());
//			if (DEBUG_SPRITE) {
//				var spriteSize = this.node.getOrientation().translateXY(
//						this.sprite.getWidth(),
//						this.sprite.getHeight());
//				var spriteOffset = {
//					x: Math.round((this.node.getWidth() - spriteSize.x) / 2),
//					y: Math.round((this.node.getHeight() - spriteSize.y) / 2)
//				};
//				context = viewport.context;
//				context.strokeStyle = '#00f';
//				context.strokeRect(
//						this.node.getX() + 0.5 + spriteOffset.x - viewport.sceneOffset.x,
//						this.node.getY() + 0.5 + spriteOffset.y - viewport.sceneOffset.y,
//						this.sprite.getWidth(),
//						this.sprite.getHeight());
//			}
//			if (DEBUG_COLLISIONS) {
//				context = viewport.context;
//				context.strokeStyle = this.node.isColliding ? '#f00' : '#fff';
//				if (this.node.bounds instanceof BoundingCircle) {
//					var halfW = this.node.getWidth() / 2;
//					context.save();
//					context.beginPath();
//					context.arc(this.node.getX() + halfW - viewport.sceneOffset.x, this.node.getY() + halfW - viewport.sceneOffset.y, halfW, 0, Math.PI * 2);
//					context.stroke();
//					context.closePath();
//					context.restore();
//				}
//				if (this.node.bounds instanceof BoundingRect) {
//					context.strokeRect(
//							this.node.getX() + 0.5 - viewport.sceneOffset.x,
//							this.node.getY() + 0.5 - viewport.sceneOffset.y,
//						this.node.getWidth(),
//						this.node.getHeight());
//				}
//			}
//		};

		return Entity;
	});
