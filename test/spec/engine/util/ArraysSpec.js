describe('Arrays utility', function () {
	'use strict';

	var Arrays;

	beforeEach(Engine.load(
		['util.Arrays'],
		function (_Arrays_) {
			Arrays = _Arrays_;
		}));

	describe('indexOf method', function () {
		it('should find an object by identity', function () {
			var target = {its: 'me'};
			var array = [
				{its: 'someone else'},
				{its: 'me'},
				target,
				{its: 'someone else'},
				{its: 'me'}
			];

			expect(Arrays.indexOf(array, target)).to.equal(2);
		});
	});
});
