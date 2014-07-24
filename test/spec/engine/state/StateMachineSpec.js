describe('State machine', function () {
	'use strict';

	var stateMachine;
	var states;

	beforeEach(Engine.load(['state.StateMachine'], function (StateMachine) {
		states = {
			on: {},
			off: {}
		};
		stateMachine = new StateMachine(states);
	}));

	describe('configuration', function () {
		it('should register an array of states', function () {
			expect(stateMachine.states).to.equal(states);
			expect(stateMachine.current).to.equal(null);
		});
	});

	describe('changing state', function () {
		it('should activate a state', function () {
			stateMachine.changeState('on');
			expect(stateMachine.current).to.equal(states.on);
		});

		it('should throw if an unknown state is specified', function () {
			expect(stateMachine.changeState.bind(stateMachine, 'nope')).to.throw();
		});

		it('should execute an enter action on en entered state', function () {
			states.on.enter = sinon.spy();
			stateMachine.changeState('on');
			expect(states.on.enter).to.have.been.calledWith(stateMachine);
		});

		it('should execute an exit action on an exited state', function () {
			states.on.exit = sinon.spy();
			stateMachine.changeState('on');
			stateMachine.changeState('off');
			expect(states.on.exit).to.have.been.calledWith(stateMachine);
		});
	});

	describe('dispatching an event', function () {
		it('should throw if no event is active', function () {
			expect(stateMachine.event.bind(stateMachine, 'coolEvent')).to.throw();
		});

		it('should throw if the active state does not support the event', function () {
			stateMachine.changeState('on');
			expect(stateMachine.event.bind(stateMachine, 'coolEvent')).to.throw();
		});

		it('should call the specified method on the active state', function () {
			states.on.coolEvent = sinon.spy();
			stateMachine.changeState('on');
			stateMachine.event('coolEvent');
			expect(states.on.coolEvent).to.have.been.calledWith();
		});

		it('should pass the state machine and event parameters to the handler method', function () {
			var params = {rad: true};
			states.on.coolEvent = sinon.spy();
			stateMachine.changeState('on');
			stateMachine.event('coolEvent', params);
			expect(states.on.coolEvent).to.have.been.calledWith(stateMachine, params);
		});
	});

	describe('state stack', function () {
		it('should allow a state to be pushed onto the stack', function () {
			stateMachine.changeState('on');
			stateMachine.pushState('off');
			expect(stateMachine.stack).to.have.members([states.on]);
			expect(stateMachine.current).to.equal(states.off);
		});

		it('should call enter/exit methods when a state is pushed', function () {
			stateMachine.changeState('on');
			states.on.exit = sinon.spy();
			states.off.enter = sinon.spy();
			stateMachine.pushState('off');
			expect(states.on.exit).to.have.been.calledWith(stateMachine);
			expect(states.off.enter).to.have.been.calledWith(stateMachine);
		});

		it('should allow a pushed state to be popped', function () {
			stateMachine.changeState('on');
			stateMachine.pushState('off');
			stateMachine.popState();
			expect(stateMachine.stack).to.be.empty; // jshint ignore:line
			expect(stateMachine.current).to.equal(states.on);
		});

		it('should call enter/exit methods when a state is popped', function () {
			stateMachine.changeState('on');
			stateMachine.pushState('off');
			states.off.exit = sinon.spy();
			states.on.enter = sinon.spy();
			stateMachine.popState();
			expect(states.off.exit).to.have.been.calledWith(stateMachine);
			expect(states.on.enter).to.have.been.calledWith(stateMachine);
		});

		it('should throw if a pop operation is attempted with an empty stack', function () {
			expect(stateMachine.popState.bind(stateMachine)).to.throw();
		});
	});
});
