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

	describe('removeIndex method', function () {
		it('should remove an index from an array', function () {
			var array = [1, 2, 3];
			Arrays.removeIndex(array, 1);
			expect(array).to.have.length(2);
			expect(array).to.have.members([1, 3]);
		});

		it('should remove the last index from an array', function () {
			var array = [1, 2, 3];
			Arrays.removeIndex(array, 2);
			expect(array).to.have.length(2);
			expect(array).to.have.members([1, 2]);
		});

		it('should returned the removed value, or null if nothing was removed', function () {
			var array = [1, 2, 3];
			var nothing = Arrays.removeIndex(array, 4);
			var removed = Arrays.removeIndex(array, 0);
			expect(nothing).to.equal(null);
			expect(removed).to.equal(1);
		});
	});

	describe('remove method', function () {
		it('should remove an object from an array', function () {
			var target = {birthday: '6/30'};
			var array = [
				{birthday: '6/30'},
				{birthday: '12/31'},
				target,
				{birthday: '12/31'}
			];

			Arrays.remove(array, target);
			expect(array).to.have.length(3);
			expect(array).not.to.deep.have.members([target]);
		});

		it('should remove the last object from an array', function () {
			var target = {birthday: 'every day'};
			var array = [
				{birthday: 'yesterday'},
				{birthday: 'eventually'},
				{birthday: 'every day'},
				target
			];

			Arrays.remove(array, target);
			expect(array).to.have.length(3);
			expect(array).not.to.deep.have.members([target]);
		});

		it('should return true if an object was removed, false otherwise', function () {
			var inArray = {yup: true};
			var notInArray = {nope: false};
			var array = [inArray];

			expect(Arrays.remove(array, inArray)).to.equal(true);
			expect(Arrays.remove(array, notInArray)).to.equal(false);
		});
	});

	describe('empty method', function () {
		it('should remove all elements from an array', function () {
			var array = [1, 2, 3];
			Arrays.empty(array);
			expect(array).to.have.length(0);
		});
	});
});
