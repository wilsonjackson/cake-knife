describe('System implementation', function () {
	'use strict';

	var TestSystem;
	var entityMatcher;

	beforeEach(Engine.load(['ecs.System', 'util.Arrays'], function (System) {
		entityMatcher = {match: function () {}};
		TestSystem = function () {
			System.call(this, entityMatcher);
		};
		TestSystem.prototype = Object.create(System.prototype);
	}));

	it('should be assigned a bit identifier', function () {
		var system1 = new TestSystem();
		var system2 = new TestSystem();
		var system3 = new TestSystem();
		expect(system1.bit).to.equal(1);
		expect(system2.bit).to.equal(2);
		expect(system3.bit).to.equal(4);
	});

	it('should assign its bit identifier to an added entity', function () {
		var system = new TestSystem();
		system.bit = 32;
		var entity = {systemBits: 16};
		system.addEntity(entity);
		expect(entity.systemBits).to.equal(16 | 32);
	});

	it('should remove its bit identifier from a removed entity', function () {
		var system = new TestSystem();
		system.bit = 32;
		var entity = {systemBits: 16 | 32};
		system.entities.push(entity);
		system.removeEntity(entity);
		expect(entity.systemBits).to.equal(16);
	});

	it('should remove its bit identifier from all entities when disposed of', function () {
		var system = new TestSystem();
		system.bit = 32;
		var entity1 = {systemBits: 32 | 16};
		var entity2 = {systemBits: 32};
		system.entities.push(entity1, entity2);
		system.dispose();

		expect(entity1.systemBits).to.equal(16);
		expect(entity2.systemBits).to.equal(0);
		expect(system.entities).to.equal(null);
		expect(system.entityMatcher).to.equal(null);
	});

	it('should reveal whether it contains an entity', function () {
		var system = new TestSystem();
		system.bit = 32;
		var entity1 = {systemBits: 32 | 8};
		var entity2 = {systemBits: 8};

		expect(system.hasEntity(entity1)).to.equal(true);
		expect(system.hasEntity(entity2)).to.equal(false);
	});
});
