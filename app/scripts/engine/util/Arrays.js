Engine.module('util.Arrays', function () {
	'use strict';

	var util = Engine.util || (Engine.util = {});

	/**
	 *
	 * @type {object}
	 */
	util.Arrays = {
		indexOf: function (array, item) {
			var i = array.length;
			while (i--) {
				if (array[i] === item) {
					return i;
				}
			}
			return -1;
		},

		/**
		 * Remove the element at a specific index from an array.
		 *
		 * Note: this does not preserve element order.
		 *
		 * @param {array} array
		 * @param {*} index
		 * @returns {*} The removed item
		 */
		removeIndex: function (array, index) {
			var l = array.length;
			if (index > -1 && index < l) {
				var value = array[index];
				if (index + 1 < l) {
					array[index] = array[l - 1];
				}
				array.pop();
				return value;
			}
			return null;
		},

		/**
		 * Remove an element from an array.
		 *
		 * Equivalent to `Arrays.removeIndex(array, Arrays.indexOf(array, item))`
		 *
		 * Note: this does not preserve element order.
		 *
		 * @param {array} array
		 * @param {*} item
		 * @returns {boolean}
		 */
		remove: function (array, item) {
			return this.removeIndex(array, this.indexOf(array, item)) !== null;
		},

		/**
		 * Empties an array without breaking the reference.
		 *
		 * @param {array} array
		 */
		empty: function (array) {
			while (array.length > 0) {
				array.pop();
			}
		}
	};

	return util.Arrays;
});
