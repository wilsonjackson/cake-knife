describe('Entity matcher', function () {
	'use strict';

	var EntityMatcher;
	var matcher;

	beforeEach(Engine.load(['ecs.EntityMatcher'], function (_EntityMatcher_) {
		EntityMatcher = _EntityMatcher_;
		matcher = new EntityMatcher();
	}));


	function createEntity(components) {
		return {
			hasComponent: function (name) {
				return components.indexOf(name) !== -1;
			}
		};
	}

	it('should match an entity with all required components', function () {
		var entity = createEntity(['requiredA', 'requiredB']);
		matcher.requireAll('requiredA', 'requiredB');
		expect(matcher.matches(entity)).to.equal(true);
	});

	it('should not match an entity missing a required component', function () {
		var entity = createEntity(['requiredA', 'requiredC']);
		matcher.requireAll('requiredA', 'requiredB');
		expect(matcher.matches(entity)).to.equal(false);
	});

	it('should allow required components to be provided via constructor args', function () {
		var matcherByCtor = new EntityMatcher('requiredA', 'requiredB');
		var matchingEntity = createEntity(['requiredA', 'requiredB']);
		expect(matcherByCtor.matches(matchingEntity)).to.equal(true);
		var nonMatchingEntity = createEntity(['requiredA', 'requiredC']);
		expect(matcherByCtor.matches(nonMatchingEntity)).to.equal(false);
	});

	it('should match an entity with one of a set of required components', function () {
		var entity = createEntity(['requiredB']);
		matcher.requireOne('requiredA', 'requiredB', 'requiredC');
		expect(matcher.matches(entity)).to.equal(true);
	});

	it('should not match an entity without any of a set of required components', function () {
		var entity = createEntity(['requiredD']);
		matcher.requireOne('requiredA', 'requiredB', 'requiredC');
		expect(matcher.matches(entity)).to.equal(false);
	});

	it('should match an entity without any excluded components', function () {
		var entity = createEntity(['requiredA']);
		matcher.exclude('excludedA', 'excludedB');
		expect(matcher.matches(entity)).to.equal(true);
	});

	it('should not match an entity with any excluded component', function () {
		var entity = createEntity(['requiredA', 'excludedB']);
		matcher.exclude('excludedA', 'excludedB');
		expect(matcher.matches(entity)).to.equal(false);
	});
});
