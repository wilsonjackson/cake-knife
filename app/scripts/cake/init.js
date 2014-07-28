document.addEventListener('DOMContentLoaded', function () {
	'use strict';

	Engine.init({
		canvas: document.getElementById('viewport'),
		plugins: ['plugins.Stats', 'cake.game.Director']
	});
	Engine.start();

//	var ticker;
//	var ticks = 0;
//	var start = new Date();
//	var time = new Date();
//
//	var secondDivisor = 1000;
//	var minuteDivisor = 60 * secondDivisor;
//	var hourDivisor = 60 * minuteDivisor;
//
//	window.time = function () {
//		var t = time.getTime() - start.getTime();
//		var hours = Math.floor(t / hourDivisor);
//		t = t % hourDivisor;
//		var minutes = Math.floor(t / minuteDivisor);
//		t = t % minuteDivisor;
//		var seconds = Math.round(t / secondDivisor);
//		return 'Time: ' + hours + ':' +
//			(minutes < 10 ? '0' : '') + minutes + ':' +
//			(seconds < 10 ? '0' : '') + seconds + ' (' + ticks + ' ticks)';
//	};
//
//	window.advanceTime = function (ticks) {
//		clearTimeout(ticker);
//		for (var i = 1; i < ticks; i++) {
//			tickInternal();
//		}
//		tick();
//	};
//
//	window.status = function () {
//
//	};
//
//	window.goToVillage = function () {
//
//	};
//
//	window.goToFarm = function () {
//
//	};
//
//	window.goToForest = function () {
//
//	};
//
//	function tickInternal() {
//		ticks++;
//		time = new Date(time.getTime() + 1000);
//	}
//
//	function tick() {
//		tickInternal();
//		ticker = setTimeout(tick, 1000);
//	}
//
//	tick();
}, false);
