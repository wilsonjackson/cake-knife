Engine.module('items.Inventory',
	[
		'items.ItemStack'
	],
	function (ItemStack) {
		'use strict';

		function Inventory() {
			// Index holds an ItemStack for every item ever added or retrieved, regardless of qty.
			this._idx = {};
			this._keys = [];
			// Items holds ItemBags from idx only if qty > 0
			this._items = [];
		}

		Inventory.prototype._add = function (item, qty) {
			var inv = this;
			var itemBag = new ItemStack(item, qty);
			itemBag.on('nonzero', function () {
				inv._items.push(itemBag);
			});
			itemBag.on('zero', function () {
				Engine.util.Arrays.remove(inv._items, itemBag);
			});

			this._idx[item.id] = itemBag;
			this._keys.push(item.id);
			if (qty > 0) {
				this._items.push(itemBag);
			}
		};

		Inventory.prototype.list = function () {
			return this._items;
		};

		Inventory.prototype.get = function (item) {
			if (!this._idx[item.id]) {
				this._add(item, 0);
			}
			return this._idx[item.id];
		};

		Inventory.prototype.clear = function () {
			for (var i = 0, l = this._keys.length; i < l; i++) {
				this._idx[this._keys[i]] = null;
			}
			Engine.util.Arrays.empty(this._keys);
			Engine.util.Arrays.empty(this._items);
		};

		return Inventory;
	});
