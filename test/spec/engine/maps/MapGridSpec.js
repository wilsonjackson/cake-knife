describe('MapGrid', function () {
	'use strict';

	var MAP_WIDTH = 6;
	var TILE_WIDTH = 12;

	var MapGrid;
	var MapNode;
	var MapWall;
	var BoundingRect;
	var Vector;
	var grid;

	beforeEach(Engine.load(['maps.MapNode'], function (_MapNode_) {
		MapNode = sinon.spy(_MapNode_);
		Engine.injector.override('maps.MapNode', MapNode);
	}));

	beforeEach(Engine.load(
		['maps.MapGrid', 'maps.MapWall', 'math.BoundingRect', 'math.Vector', 'util.Arrays'],
		function (_MapGrid_, _MapWall_, _BoundingRect_, _Vector_) {
			MapGrid = _MapGrid_;
			MapWall = _MapWall_;
			BoundingRect = _BoundingRect_;
			Vector = _Vector_;
			grid = new MapGrid(MAP_WIDTH, TILE_WIDTH);
		}));

	it('should create nodes for all non-empty tiles in a set', function () {
		sinon.spy(grid, 'createNode');
		var tiles = [
			0, 0, 0, 0, 0, 0,
			0, 1, 0, 0, 0, 0,
			0, 1, 0, 1, 1, 0,
			0, 1, 1, 1, 1, 0,
			0, 1, 0, 0, 0, 0,
			0, 1, 0, 0, 0, 1
		];
		grid.load(tiles);
		expect(grid.createNode.callCount).is.gte(11);
		for (var i = 0, l = grid.createNode.callCount; i < l; i++) {
			/* jshint loopfunc: true */
			var call = grid.createNode.getCall(i);
			expect(call.args[0]).to.satisfy(function (index) {
				return [7, 13, 15, 16, 19, 20, 21, 22, 25, 31, 35].indexOf(index) !== -1;
			}, 'Unexpected index ' + call.args[0]);
			/* jshint loopfunc: false */
		}
	});

	it('should create a single node', function () {
		grid.createNode(8);
		expect(grid.nodes[8]).to.be.instanceof(MapNode);
		expect(grid.nodes[8].position.x).to.equal(2);
		expect(grid.nodes[8].position.y).to.equal(1);
	});

	it('should not create a duplicate node', function () {
		sinon.spy(MapNode);
		grid.createNode(8);
		grid.createNode(8);
		expect(MapNode).to.have.been.calledOnce; // jshint ignore:line
	});

	it('should merge two walls', function () {
		var wall1 = grid.createWall(MapNode.AXIS_X);
		var node1 = Object.create(MapNode.prototype);
		wall1.addNode(node1);
		var wall2 = grid.createWall(MapNode.AXIS_X);
		var node2 = Object.create(MapNode.prototype);
		var node3 = Object.create(MapNode.prototype);
		wall2.addNode(node2);
		wall2.addNode(node3);
		sinon.spy(node1, 'setWall');
		sinon.stub(node2, 'setWall', function () {
			wall2.removeNode(node2);
		});
		sinon.stub(node3, 'setWall', function () {
			wall2.removeNode(node3);
		});

		grid.mergeWalls(wall1, wall2);

		expect(node1.setWall).not.to.have.been.called; // jshint ignore:line
		expect(node2.setWall).to.have.been.calledWith(wall1);
		expect(node3.setWall).to.have.been.calledWith(wall1);
		expect(grid.walls).to.have.members([wall1]);
	});

	it('should convert a position vector into an index using the tile width', function () {
		expect(grid.toIndex(new Vector(4, 0))).to.equal(4);
		expect(grid.toIndex(new Vector(5, 3))).to.equal(23);
		expect(grid.toIndex(new Vector(0, 4))).to.equal(24);
	});

	it('should convert an index to a position vector using the tile width', function () {
		expect(grid.toVector(4).equals(new Vector(4, 0))).to.equal(true);
		expect(grid.toVector(23).equals(new Vector(5, 3))).to.equal(true);
		expect(grid.toVector(24).equals(new Vector(0, 4))).to.equal(true);
	});

	describe('boundary finding', function () {
		it('should ask every node to pick the wall it belongs to', function () {
			var node1 = Object.create(MapNode.prototype);
			sinon.stub(node1, 'pickWall');
			var node2 = Object.create(MapNode.prototype);
			sinon.stub(node2, 'pickWall');
			grid.nodes[5] = node1;
			grid.nodes[10] = node1;
			grid.calculateBoundaries();
		});

		it('should calculate the boundaries of walls', function () {
			var wall1 = grid.createWall(MapNode.AXIS_X);
			wall1.nodes = [Object.create(MapNode.prototype)];
			var rect1 = new BoundingRect(new Vector(1, 1), new Vector(2, 2));
			sinon.stub(wall1, 'createBoundingRect').returns(rect1);
			var wall2 = grid.createWall(MapNode.AXIS_Y);
			wall2.nodes = [Object.create(MapNode.prototype)];
			var rect2 = new BoundingRect(new Vector(3, 3), new Vector(4, 4));
			sinon.stub(wall2, 'createBoundingRect').returns(rect2);

			var boundaries = grid.calculateBoundaries();

			expect(wall1.createBoundingRect).to.have.been.calledWith(TILE_WIDTH);
			expect(wall2.createBoundingRect).to.have.been.calledWith(TILE_WIDTH);
			expect(boundaries).to.have.members([rect1, rect2]);
		});

		it('should skip walls without nodes', function () {
			var wall1 = grid.createWall(MapNode.AXIS_X);
			sinon.stub(wall1, 'createBoundingRect');
			var wall2 = grid.createWall(MapNode.AXIS_Y);
			wall2.nodes = [Object.create(MapNode.prototype)];
			var rect2 = new BoundingRect(new Vector(3, 3), new Vector(4, 4));
			sinon.stub(wall2, 'createBoundingRect').returns(rect2);

			var boundaries = grid.calculateBoundaries();

			expect(wall1.createBoundingRect).not.to.have.been.called; // jshint ignore:line
			expect(boundaries).to.have.members([rect2]);
		});
	});
});
