document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Engine.init({
		canvas: document.getElementById('viewport'),
		plugins: ['cake.game.Director']
	});
	Engine.start();
}, false);
