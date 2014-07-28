describe('World', function () {
	'use strict';

	var game;
	var world;
	var System;
	var Events;
	var entityId;

	beforeEach(Engine.load(['ecs.World', 'ecs.System', 'util.Events', 'util.Arrays'], function (World, _System_, _Events_) {
		game = {};
		world = new World(game);
		System = _System_;
		Events = _Events_;
		entityId = 0;
	}));

	function createEntity() {
		var entity = {
			id: ++entityId,
			toString: function () {
				return '<mock entity>';
			}
		};
		Events.mixin(entity);
		return entity;
	}

	function createSystem() {
		var Sys = function () {
			System.call(this, {matches: sinon.stub()});
			this.dispose = sinon.spy();
		};
		Sys.prototype = Object.create(System.prototype);
		Sys.prototype.addToWorld = function () {
			world.addSystem(this);
			return this;
		};
		Sys.prototype.alwaysMatches = function () {
			this.entityMatcher.matches.returns(true);
			return this;
		};
		Sys.prototype.neverMatches = function () {
			this.entityMatcher.matches.returns(false);
			return this;
		};
		Sys.prototype.toString = function () {
			return '<mock system>';
		};
		return new Sys();
	}

	it('should remove event listeners from all entities when world is cleared', function () {
		var entityA = createEntity();
		var entityB = createEntity();
		entityA.on = sinon.spy();
		entityA.off = sinon.spy();
		entityB.on = sinon.spy();
		entityB.off = sinon.spy();

		world.addEntity(entityA);
		world.addEntity(entityB);
		world.clear();
		expect(entityA.off.getCall(0)).to.have.been.calledWith('dispose', entityA.on.getCall(0).args[1]);
		expect(entityA.off.getCall(1)).to.have.been.calledWith('componentAdded', entityA.on.getCall(1).args[1]);
		expect(entityA.off.getCall(2)).to.have.been.calledWith('componentRemoved', entityA.on.getCall(2).args[1]);
		expect(entityB.off.getCall(0)).to.have.been.calledWith('dispose', entityB.on.getCall(0).args[1]);
		expect(entityB.off.getCall(1)).to.have.been.calledWith('componentAdded', entityB.on.getCall(1).args[1]);
		expect(entityB.off.getCall(2)).to.have.been.calledWith('componentRemoved', entityB.on.getCall(2).args[1]);
	});

	it('should dispose of all systems when world is cleared', function () {
		var systemA = createSystem().addToWorld();
		var systemB = createSystem().addToWorld();
		systemA.dispose = sinon.spy();
		systemB.dispose = sinon.spy();
		world.clear();
		expect(systemA.dispose).to.have.been.called; // jshint ignore:line
		expect(systemB.dispose).to.have.been.called; // jshint ignore:line
	});

	describe('loop methods', function () {
		it('should invoke all systems during an update', function () {
			var time = {}, input = {};
			var systemA = createSystem().addToWorld();
			var systemB = createSystem().addToWorld();
			systemA.update = sinon.spy();
			systemB.update = sinon.spy();
			world.update(time, input);
			expect(systemA.update).to.have.been.calledWith(game, time, input);
			expect(systemB.update).to.have.been.calledWith(game, time, input);
		});

		it('should invoke all systems during a render', function () {
			var time = {}, viewport = {};
			var systemA = createSystem().addToWorld();
			var systemB = createSystem().addToWorld();
			systemA.render = sinon.spy();
			systemB.render = sinon.spy();
			world.render(time, viewport);
			expect(systemA.render).to.have.been.calledWith(game, time, viewport);
			expect(systemB.render).to.have.been.calledWith(game, time, viewport);
		});
	});

	describe('entity change', function () {
		it('should add event listeners to added entities', function () {
			var entity = createEntity();
			entity.on = sinon.spy();
			world.addEntity(entity); // Registers event listeners
			expect(entity.on.getCall(0)).to.have.been.calledWith('dispose', sinon.match.func);
			expect(entity.on.getCall(1)).to.have.been.calledWith('componentAdded', sinon.match.func);
			expect(entity.on.getCall(2)).to.have.been.calledWith('componentRemoved', sinon.match.func);
		});

		it('should add new entities to relevant systems', function () {
			var systemA = createSystem().neverMatches().addToWorld();
			var systemB = createSystem().alwaysMatches().addToWorld();
			var entity = createEntity();
			systemA.addEntity = sinon.spy();
			systemB.addEntity = sinon.spy();

			world.addEntity(entity);

			expect(systemA.addEntity).not.to.have.been.called; // jshint ignore:line
			expect(systemB.addEntity).to.have.been.calledWith(entity);
		});

		it('should remove deleted entities from relevant systems', function () {
			var systemA = createSystem().addToWorld();
			var systemB = createSystem().addToWorld();
			var entity = createEntity();
			systemA.hasEntity = sinon.stub().returns(false);
			systemA.removeEntity = sinon.spy();
			systemB.hasEntity = sinon.stub().returns(true);
			systemB.removeEntity = sinon.spy();

			world.addEntity(entity);
			world.removeEntity(entity);

			expect(systemA.removeEntity).not.to.have.been.called; // jshint ignore:line
			expect(systemB.removeEntity).to.have.been.calledWith(entity);
		});

		it('should remove event listeners when an entity is removed', function () {
			var entity = createEntity();
			entity.on = sinon.spy();
			entity.off = sinon.spy();
			world.addEntity(entity); // Registers event listeners
			world.removeEntity(entity); // Remove 'em
			expect(entity.off.getCall(0)).to.have.been.calledWith('dispose', entity.on.getCall(0).args[1]);
			expect(entity.off.getCall(1)).to.have.been.calledWith('componentAdded', entity.on.getCall(1).args[1]);
			expect(entity.off.getCall(2)).to.have.been.calledWith('componentRemoved', entity.on.getCall(2).args[1]);
		});

		function componentEventSpecTemplate(event) {
			it('should add to a system when a match is caused', function () {
				var system = createSystem().addToWorld();
				system.hasEntity = sinon.stub().returns(false);
				system.entityMatcher.matches = sinon.stub();
				system.entityMatcher.matches
					.onFirstCall().returns(false) // Does not initially match entity
					.onSecondCall().returns(true); // Matches when component is added
				system.addEntity = sinon.spy();

				var entity = createEntity();
				world.addEntity(entity);
				entity.trigger(event);

				expect(system.addEntity).to.have.been.calledWith(entity);
			});

			it('should remove from a system when a match failure is caused', function () {
				var system = createSystem().addToWorld();
				system.hasEntity = sinon.stub().returns(true);
				system.entityMatcher.matches = sinon.stub();
				system.entityMatcher.matches
					.onFirstCall().returns(true) // Initially matches entity
					.onSecondCall().returns(false); // Does not match when component is added
				system.removeEntity = sinon.spy();

				var entity = createEntity();
				world.addEntity(entity);
				entity.trigger(event);

				expect(system.removeEntity).to.have.been.calledWith(entity);
			});

			it('should not affect a system if the component is not relevant', function () {
				var containingSystem = createSystem().alwaysMatches().addToWorld();
				containingSystem.hasEntity = sinon.stub().returns(true);
				containingSystem.addEntity = sinon.spy();
				containingSystem.removeEntity = sinon.spy();

				var emptySystem = createSystem().neverMatches().addToWorld();
				emptySystem.hasEntity = sinon.stub().returns(false);
				emptySystem.addEntity = sinon.spy();
				emptySystem.removeEntity = sinon.spy();

				var entity = createEntity();
				world.addEntity(entity);
				containingSystem.addEntity.reset(); // Reset so the initial add isn't counted
				entity.trigger(event);

				// jshint ignore:start
				expect(containingSystem.addEntity).not.to.have.been.called;
				expect(containingSystem.removeEntity).not.to.have.been.called;
				expect(emptySystem.addEntity).not.to.have.been.called;
				expect(emptySystem.removeEntity).not.to.have.been.called;
				// jshint ignore:end
			});
		}

		describe('to add a component', function () {
			componentEventSpecTemplate('componentAdded');
		});

		describe('to remove a component', function () {
			componentEventSpecTemplate('componentRemoved');
		});
	});

	describe('system change', function () {
		it('should push an added system onto the systems array', function () {
			var system = createSystem();
			world.addSystem(system);
			expect(world.systems).to.contain(system);
		});

		it('should add matching entities to an added system', function () {
			var matchingEntity = createEntity();
			var nonMatchingEntity = createEntity();
			world.addEntity(matchingEntity);
			world.addEntity(nonMatchingEntity);

			var system = createSystem();
			system.entityMatcher.matches = sinon.stub();
			system.entityMatcher.matches.withArgs(matchingEntity).returns(true);
			system.entityMatcher.matches.withArgs(nonMatchingEntity).returns(false);
			system.addEntity = sinon.spy();

			world.addSystem(system);
			expect(system.addEntity).to.have.been.calledOnce; // jshint ignore:line
			expect(system.addEntity).to.have.been.calledWith(matchingEntity);
		});

		it('should splice a removed system from the systems array', function () {
			var system = createSystem().addToWorld();
			world.removeSystem(system);
			expect(world.systems).not.to.contain(system);
		});

		it('should dispose a removed system', function () {
			var system = createSystem().addToWorld();
			world.removeSystem(system);
			expect(system.dispose).to.have.been.called; //jshint ignore:line
		});
	});
});
