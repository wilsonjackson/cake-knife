describe('Pool', function () {
	'use strict';

	var POOL_SIZE = 5;
	var id;
	/** @return {string} */
	var FACTORY = function () {
		return 'number-' + (++id);
	};

	var Pool;
	var pool;

	beforeEach(Engine.load(['util.Pool'], function (_Pool_) {
		Pool = _Pool_;
		pool = new Pool(POOL_SIZE, FACTORY);
		id = 0;
	}));

	it('should invoke the factory when the pool is empty', function () {
		var o = pool.acquire();
		expect(o).to.equal('number-1');
	});

	it('should store and reuse objects that are checked in', function () {
		var o1 = pool.acquire();
		pool.release(o1);
		var o2 = pool.acquire();
		expect(o1).to.equal(o2);
	});

	it('should generate objects beyond the pool size', function () {
		var o;
		for (var i = 0; i <= POOL_SIZE; i++) {
			o = pool.acquire();
		}
		expect(o).to.equal('number-6');
	});

	it('should only store the number of objects the pool will hold', function () {
		var oArray = [];
		var i;
		for (i = 0; i <= POOL_SIZE; i++) {
			oArray.push(pool.acquire());
		}
		for (i = 0; i < oArray.length; i++) {
			pool.release(oArray[i]);
		}
		expect(pool.acquire()).to.equal('number-5');
	});

	it('should allow a pool to be preallocated', function () {
		var factory = sinon.stub().returns('preallocated');
		pool = new Pool(POOL_SIZE, factory);
		expect(pool.preallocate()).to.equal(pool, 'expected fluid interface');
		expect(factory).to.have.callCount(POOL_SIZE);
		expect(pool.acquire()).to.equal('preallocated');
	});

	it('should allow a pool to preallocate a specific number of objects', function () {
		var factory = sinon.stub().returns('preallocated');
		pool = new Pool(POOL_SIZE, factory);
		pool.preallocate(POOL_SIZE - 1);
		expect(factory).to.have.callCount(POOL_SIZE - 1);
		expect(pool.acquire()).to.equal('preallocated');
	});

	it('should clear the entire pool', function () {
		var o1 = pool.acquire();
		pool.release(o1);
		var o2 = pool.acquire();
		pool.release(o2);
		pool.clear();
		var o = pool.acquire();
		expect(o).not.to.equal(o1);
		expect(o).not.to.equal(o2);
	});
});
