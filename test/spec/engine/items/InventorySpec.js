describe('Inventory container', function () {
	'use strict';

	var Inventory;
	var inventory;
	var ITEM_1 = {id: 'ITEM_1'};
	var ITEM_2 = {id: 'ITEM_2'};

	beforeEach(Engine.load(['items.Inventory', 'util.Arrays'], function (_Inventory_) {
		Inventory = _Inventory_;
		inventory = new Inventory();
	}));

	it('should allow a new item to be added', function () {
		inventory.get(ITEM_1).add(1);
		var items = inventory.list();
		expect(items).to.have.length(1);
		expect(items[0].item).to.equal(ITEM_1);
		expect(items[0].qty).to.equal(1);
	});

	it('should add a repeat item to an existing stack', function () {
		inventory.get(ITEM_1).add(1);
		inventory.get(ITEM_1).add(1);
		var items = inventory.list();
		expect(items).to.have.length(1);
		expect(items[0].item).to.equal(ITEM_1);
		expect(items[0].qty).to.equal(2);
	});

	it('should not return a stack with zero items in it', function () {
		inventory.get(ITEM_1).add(1);
		inventory.get(ITEM_1).remove(1);
		expect(inventory.list()).to.have.length(0);
	});

	it('should hold multiple items', function () {
		inventory.get(ITEM_1).add(1);
		inventory.get(ITEM_2).add(1);
		var items = inventory.list();
		expect(items).to.have.length(2);
		expect(items[0].item).to.equal(ITEM_1);
		expect(items[0].qty).to.equal(1);
		expect(items[1].item).to.equal(ITEM_2);
		expect(items[1].qty).to.equal(1);
	});

	it('should be clearable', function () {
		inventory.get(ITEM_1).add(1);
		inventory.get(ITEM_2).add(1);
		inventory.clear();
		expect(inventory.list()).to.have.length(0);
	});
});
