Engine.module('world.entities.Entity',
	[
		'math.BoundingRect',
		'math.BoundingCircle',
		'util.Events',
		'physics.Physics',
		'physics.NodeCategory',
		'graphics.sprite.SpriteRepository'
	],
	function (BoundingRect, BoundingCircle, Events, Physics, NodeCategory, SpriteRepository) {
		'use strict';

		var DEBUG_COLLISIONS = false;
		var DEBUG_SPRITE = false;

		function Entity() {
			Events.mixin(this);
			this.sprite = SpriteRepository.NULL_SPRITE;

			this.nodeCategory = NodeCategory.OBSTACLE;
			this.nodeShape = Entity.SHAPE_RECT;
			this.node = null;
		}

		Entity.prototype.init = function (x, y, orientation) {
			var dimensions = orientation.translateXY(this.sprite.getHitboxWidth(), this.sprite.getHitboxHeight());
			var margins = orientation.translateXY(this.sprite.getLeftMargin(), this.sprite.getBottomMargin());
			var leftEdge = x + margins.x;
			var topEdge = y - dimensions.y - margins.y;
			switch (this.nodeShape) {
				case Entity.SHAPE_CIRCLE:
					this.node = Physics.createCircleNode(
						this.nodeCategory, leftEdge, topEdge, dimensions.x() / 2, orientation, this);
					break;
				case Entity.SHAPE_RECT:
					this.node = Physics.createRectNode(
						this.nodeCategory, leftEdge, topEdge, dimensions.x, dimensions.y, orientation, this);
					break;
			}
			if (this._init) {
				this._init();
			}
		};

		Entity.prototype.onDestroy = function (fn) {
			this.on('destroy', fn);
		};

		Entity.prototype.destroy = function () {
			this.trigger('destroy', this);
			this.node.destroy();
			delete this.node;
			Events.destroyMixin(this);
			if (this._destroy) {
				this._destroy();
			}
		};

		Entity.prototype.update = function () {
			return false;
		};

		Entity.prototype.render = function (viewport) {
			var context;
			viewport.getGraphics().drawSprite(this.sprite,
					this.node.getX(),
					this.node.getY() + this.node.getHeight(),
				this.node.getOrientation());
			if (DEBUG_SPRITE) {
				var spriteSize = this.node.getOrientation().translateXY(
						this.sprite.getWidth(),
						this.sprite.getHeight());
				var spriteOffset = {
					x: Math.round((this.node.getWidth() - spriteSize.x) / 2),
					y: Math.round((this.node.getHeight() - spriteSize.y) / 2)
				};
				context = viewport.context;
				context.strokeStyle = '#00f';
				context.strokeRect(
						this.node.getX() + 0.5 + spriteOffset.x - viewport.sceneOffset.x,
						this.node.getY() + 0.5 + spriteOffset.y - viewport.sceneOffset.y,
						this.sprite.getWidth(),
						this.sprite.getHeight());
			}
			if (DEBUG_COLLISIONS) {
				context = viewport.context;
				context.strokeStyle = this.node.isColliding ? '#f00' : '#fff';
				if (this.node.bounds instanceof BoundingCircle) {
					var halfW = this.node.getWidth() / 2;
					context.save();
					context.beginPath();
					context.arc(this.node.getX() + halfW - viewport.sceneOffset.x, this.node.getY() + halfW - viewport.sceneOffset.y, halfW, 0, Math.PI * 2);
					context.stroke();
					context.closePath();
					context.restore();
				}
				if (this.node.bounds instanceof BoundingRect) {
					context.strokeRect(
							this.node.getX() + 0.5 - viewport.sceneOffset.x,
							this.node.getY() + 0.5 - viewport.sceneOffset.y,
						this.node.getWidth(),
						this.node.getHeight());
				}
			}
		};

		Entity.SHAPE_CIRCLE = 'CIRCLE';
		Entity.SHAPE_RECT = 'RECT';

		return Entity;
	});
