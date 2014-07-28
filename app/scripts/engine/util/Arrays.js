Engine.module('util.Arrays', function () {
	'use strict';

	var util = Engine.util || (Engine.util = {});

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

		remove: function (array, item) {
			var index = this.indexOf(array, item);
			if (index > -1) {
				array.splice(index, 1);
				return true;
			}
			return false;
		}
	};

	return util.Arrays;
});
