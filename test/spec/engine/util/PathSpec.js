describe('Path helper', function () {
	'use strict';

	var Path;

	beforeEach(Engine.load(['util.Path'], function (_Path_) {
		Path = _Path_;
	}));

	it('should resolve a relative URL against another URL', function () {
		expect(Path.resolve('assets/maps/map.json', '../tiles/tiles.png')).to.equal('assets/tiles/tiles.png');
		expect(Path.resolve('assets/maps/map.json', './tiles/tiles.png')).to.equal('assets/maps/tiles/tiles.png');
		expect(Path.resolve('assets/maps/map.json', 'tiles/tiles.png')).to.equal('assets/maps/tiles/tiles.png');
		expect(Path.resolve('assets/maps/map.json', 'tiles/../tiles.png')).to.equal('assets/maps/tiles.png');
		expect(Path.resolve('assets/maps/map.json', 'tiles/./tiles.png')).to.equal('assets/maps/tiles/tiles.png');
	});
});
