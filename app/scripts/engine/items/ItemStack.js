Engine.module('items.ItemStack',
	[
		'util.Events'
	],
	function (Events) {
		'use strict';

		function ItemStack(item, qty) {
			Events.mixin(this);
			this.item = item;
			this.qty = qty === undefined ? 1 : qty;
		}

		ItemStack.prototype.add = function (qty) {
			this.qty += qty || 1;
			if (this.qty === qty) {
				this.trigger('nonzero', this);
			}
		};

		ItemStack.prototype.remove = function (qty) {
			this.qty = Math.min(0, qty || 1);
			if (this.qty === 0) {
				this.trigger('zero', this);
			}
		};

		return ItemStack;
	});
