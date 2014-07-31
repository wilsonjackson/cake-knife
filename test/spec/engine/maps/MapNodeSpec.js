describe('MapNode', function () {
	'use strict';

	var MAP_WIDTH = 20;
	var TILE_WIDTH = 5;

	var MapNode;
	var MapGrid;
	var MapWall;
	var Vector;

	var grid;
	var wallY;
	var wallX;

	beforeEach(Engine.load(
		['maps.MapNode', 'maps.MapGrid', 'maps.MapWall', 'math.Vector', 'util.Arrays'],
		function (_MapNode_, _MapGrid_, _MapWall_, _Vector_) {
			MapNode = _MapNode_;
			MapGrid = _MapGrid_;
			MapWall = _MapWall_;
			Vector = _Vector_;

			grid = new MapGrid(MAP_WIDTH, TILE_WIDTH);
			wallY = new MapWall(MapNode.AXIS_Y);
			wallX = new MapWall(MapNode.AXIS_X);
		}));

	describe('creation', function () {
		beforeEach(function () {
			sinon.stub(grid, 'getNodeAt').returns(null);
			sinon.stub(grid, 'createWall');
			sinon.stub(grid, 'mergeWalls');
			grid.createWall
				.onFirstCall().returns(wallY)
				.onSecondCall().returns(wallX);
		});

		it('should check for neighbor nodes in each direction', function () {
			new MapNode(new Vector(1, 1), grid);
			expect(grid.getNodeAt).to.have.callCount(4);
			expect(grid.getNodeAt).to.have.been.calledWith(sinon.match({x: 0, y: 1}));
			expect(grid.getNodeAt).to.have.been.calledWith(sinon.match({x: 1, y: 0}));
			expect(grid.getNodeAt).to.have.been.calledWith(sinon.match({x: 2, y: 1}));
			expect(grid.getNodeAt).to.have.been.calledWith(sinon.match({x: 1, y: 2}));
		});

		it('should create walls if top and left neighbor nodes are missing', function () {
			var node = new MapNode(new Vector(1, 1), grid);
			expect(grid.createWall).to.have.callCount(2);
			expect(grid.createWall).to.have.been.calledWith(MapNode.AXIS_Y);
			expect(grid.createWall).to.have.been.calledWith(MapNode.AXIS_X);
			expect(node.getWall(MapNode.AXIS_Y)).to.equal(wallY);
			expect(node.getWall(MapNode.AXIS_X)).to.equal(wallX);
		});

		it('should add self to existing walls if top and left neighbors exist', function () {
			var aboveNode = Object.create(MapNode.prototype);
			sinon.stub(aboveNode, 'getWall').returns(wallY);
			var leftNode = Object.create(MapNode.prototype);
			sinon.stub(leftNode, 'getWall').returns(wallX);
			grid.getNodeAt.returns(null)
				.withArgs(sinon.match({x: 1, y: 0})).returns(aboveNode)
				.withArgs(sinon.match({x: 0, y: 1})).returns(leftNode);
			sinon.spy(wallX, 'addNode');
			sinon.spy(wallY, 'addNode');

			var node = new MapNode(new Vector(1, 1), grid);

			expect(grid.createWall).not.to.have.been.called; // jshint ignore:line
			expect(aboveNode.getWall).to.have.been.calledWith(MapNode.AXIS_Y);
			expect(leftNode.getWall).to.have.been.calledWith(MapNode.AXIS_X);
			expect(wallY.addNode).to.have.been.calledWith(node);
			expect(wallX.addNode).to.have.been.calledWith(node);
			expect(node.getWall(MapNode.AXIS_Y)).to.equal(wallY);
			expect(node.getWall(MapNode.AXIS_X)).to.equal(wallX);
		});

		it('should merge walls to the bottom and right', function () {
			var belowNode = Object.create(MapNode.prototype);
			var belowWall = new MapWall(MapNode.AXIS_Y);
			sinon.stub(belowNode, 'getWall').returns(belowWall);
			var rightNode = Object.create(MapNode.prototype);
			var rightWall = new MapWall(MapNode.AXIS_Y);
			sinon.stub(rightNode, 'getWall').returns(rightWall);

			grid.getNodeAt.returns(null)
				.withArgs(sinon.match({x: 1, y: 2})).returns(belowNode)
				.withArgs(sinon.match({x: 2, y: 1})).returns(rightNode);

			new MapNode(new Vector(1, 1), grid);

			expect(grid.mergeWalls).to.have.been.calledWith(wallX, rightWall);
			expect(grid.mergeWalls).to.have.been.calledWith(wallY, belowWall);
		});

	});

	describe('instance', function () {
		var node;

		beforeEach(function () {
			node = Object.create(MapNode.prototype);
			node.position = new Vector(1, 1);
			node.grid = grid;
			node.walls = {};
			node.walls[MapNode.AXIS_Y] = wallY;
			node.walls[MapNode.AXIS_X] = wallX;
		});

		it('should allow a wall to be set', function () {
			sinon.spy(wallY, 'removeNode');
			var newWall = new MapWall(MapNode.AXIS_Y);
			sinon.spy(newWall, 'addNode');

			node.setWall(newWall);

			expect(wallY.removeNode).to.have.been.calledWith(node);
			expect(newWall.addNode).to.have.been.calledWith(node);
			expect(node.getWall(MapNode.AXIS_Y)).to.equal(newWall);
		});

		it('should allow a wall to be removed', function () {
			sinon.spy(wallY, 'removeNode');
			node.removeFromWall(MapNode.AXIS_Y);
			expect(node.getWall(MapNode.AXIS_Y)).to.equal(undefined);
			expect(wallY.removeNode).to.have.been.calledWith(node);
		});

		describe('wall selection', function () {
			beforeEach(function () {
				sinon.spy(node, 'removeFromWall');
				sinon.stub(wallY, 'isMiddleNode').returns(false);
				sinon.stub(wallX, 'isMiddleNode').returns(false);
			});

			it('should select the y-axis wall if the node is in the middle of it', function () {
				wallY.isMiddleNode.returns(true);
				node.pickWall();
				expect(node.removeFromWall).to.have.been.calledWith(MapNode.AXIS_X);
			});

			it('should select the x-axis wall if the node is in the middle of it', function () {
				wallX.isMiddleNode.returns(true);
				node.pickWall();
				expect(node.removeFromWall).to.have.been.calledWith(MapNode.AXIS_Y);
			});

			it('should select the y-axis wall if it is longer', function () {
				wallY.nodes = [1, 2, 3];
				wallX.nodes = [1, 2];
				node.pickWall();
				expect(node.removeFromWall).to.have.been.calledWith(MapNode.AXIS_X);
			});

			it('should select the x-axis wall if it is longer', function () {
				wallY.nodes = [1, 2, 3];
				wallX.nodes = [1, 2, 3, 4];
				node.pickWall();
				expect(node.removeFromWall).to.have.been.calledWith(MapNode.AXIS_Y);
			});

			it('should select the x-axis wall if all else is equal, just cause', function () {
				wallY.nodes = wallX.nodes = [1, 2];
				node.pickWall();
				expect(node.removeFromWall).to.have.been.calledWith(MapNode.AXIS_Y);
			});
		});
	});
});
