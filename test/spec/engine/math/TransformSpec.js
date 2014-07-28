describe('Transform', function () {
	'use strict';

	var Transform;
	var Vector;
	var BoundingRect;

	beforeEach(Engine.load(['math.Transform', 'math.Vector', 'math.BoundingRect'], function (_Transform_, _Vector_, _BoundingRect_) {
		Transform = _Transform_;
		Vector = _Vector_;
		BoundingRect = _BoundingRect_;
	}));

	it('should interpolate with another transform', function () {
		var transform = new Transform();
		transform.scale(new Vector(10, 100));
		transform.translate(new Vector(50, 75));
		transform.rotate(Math.PI / 2);

		var interpolateTo = new Transform();
		interpolateTo.scale(new Vector(5, 130));
		interpolateTo.translate(new Vector(60, -10));
		interpolateTo.rotate(Math.PI);

		transform.interpolate(interpolateTo, 0.3);
		expect(transform.size.x).to.equal(6.5);
		expect(transform.size.y).to.equal(121);
		expect(transform.position.x).to.equal(57);
		expect(transform.position.y).to.equal(15.5);
		expect(transform.rotation).to.be.closeTo(2.67035, 0.00001);
	});

	it('should convert from a BoundingRect', function () {
		var rect = new BoundingRect(new Vector(5, 10), new Vector(15, 20));
		var transform = Transform.fromRect(rect);
		expect(transform.position.x).to.equal(5);
		expect(transform.position.y).to.equal(10);
		expect(transform.size.x).to.equal(15);
		expect(transform.size.y).to.equal(20);
		expect(transform.rotation).to.equal(0);
	});
});
