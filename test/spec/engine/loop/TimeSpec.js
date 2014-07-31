describe('Time keeper', function () {
	'use strict';

	var dt = 20;
	var time;

	beforeEach(Engine.load(['loop.Time'], function (Time) {
		time = new Time(dt);
	}));

	describe('when testing for next tick', function () {
		it('should indicate a tick is not due immediately upon starting', sinon.test(function () {
			time.start();
			expect(time.isTickDue()).to.equal(false);
		}));

		it('should indicate no tick is due if called before delta has passed', function () {
			time.start();
			expect(time.isTickDue()).to.equal(false);
		});

		it('should indicate a tick is due when delta has passed', sinon.test(function () {
			time.start();
			this.clock.tick(dt);
			expect(time.isTickDue()).to.equal(true);
		}));

		it('should indicate successive ticks are due until accumulated time is used', sinon.test(function () {
			time.start();
			this.clock.tick(dt * 4);
			expect(time.isTickDue()).to.equal(true, '1st tick expected');
			expect(time.isTickDue()).to.equal(true, '2nd tick expected');
			expect(time.isTickDue()).to.equal(true, '3rd tick expected');
			expect(time.isTickDue()).to.equal(true, '4th tick expected');
			expect(time.isTickDue()).to.equal(false, '5th tick not expected');
		}));

		it('should not waste the remainder of accumulated time', sinon.test(function () {
			time.start();
			this.clock.tick(dt + dt / 2);
			expect(time.isTickDue()).to.equal(true, '1st tick expected');
			expect(time.isTickDue()).to.equal(false, '2nd tick not expected');
			this.clock.tick(dt / 2);
			expect(time.isTickDue()).to.equal(true, 'remainder time should be used');
		}));
	});

	describe('current time', function () {
		it('should be exposed for the current tick', function () {
			time.start();
			expect(time.current.ticks).to.equal(0);
			expect(time.current.dt).to.equal(dt);
			expect(time.current.gameTime).to.equal(0);
			expect(time.current.realTime).to.equal(0);
		});

		it('should be updated with each tick', sinon.test(function () {
			time.start();
			this.clock.tick(dt + 5);
			time.isTickDue();
			expect(time.current.ticks).to.equal(1);
			expect(time.current.dt).to.equal(dt);
			expect(time.current.gameTime).to.equal(dt);
			expect(time.current.realTime).to.equal(dt + 5);
		}));

		it('should include an interpolation value when a the last tick check returned false', sinon.test(function () {
			time.start();
			this.clock.tick(dt / 2);
			time.isTickDue();
			expect(time.current.alpha).to.equal(0.5);
		}));
	});

	describe('suspend/resume', function () {
		it('should prevent ticks while suspended', sinon.test(function () {
			time.start();
			this.clock.tick(dt * 10);
			time.suspend();
			this.clock.tick(dt * 10);
			expect(time.isTickDue()).to.equal(false);
		}));

		it('should not count suspended time toward game time or tick accumulation', sinon.test(function () {
			time.start();
			this.clock.tick(dt / 2);
			time.suspend();
			this.clock.tick(dt * 50);
			time.resume();
			this.clock.tick(dt / 2);
			expect(time.isTickDue()).to.equal(true);
			expect(time.current.gameTime).to.equal(dt);
			expect(time.current.realTime).to.equal(dt * 51);
			expect(time.isTickDue()).to.equal(false);
		}));

		it('should preserve accumulated time from before suspend', sinon.test(function () {
			time.start();
			this.clock.tick(dt - 2);
			time.suspend();
			this.clock.tick(dt);
			time.resume();
			this.clock.tick(1);
			expect(time.isTickDue()).to.equal(false);
			this.clock.tick(1);
			expect(time.isTickDue()).to.equal(true);
		}));
	});
});
