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
		}
	};

	return util.Arrays;
});
