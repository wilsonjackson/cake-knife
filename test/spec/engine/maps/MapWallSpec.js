describe('MapWall', function () {
	'use strict';

	var MapWall;
	var MapNode;
	var Vector;
	var BoundingRect;

	var wall;

	beforeEach(Engine.load(
		['maps.MapWall', 'maps.MapNode', 'math.Vector', 'math.BoundingRect', 'util.Arrays'],
		function (_MapWall_, _MapNode_, _Vector_, _BoundingRect_) {
			MapWall = _MapWall_;
			MapNode = _MapNode_;
			Vector = _Vector_;
			BoundingRect = _BoundingRect_;
			wall = new MapWall(MapNode.AXIS_X);
		}));

	it('should add and remove nodes', function () {
		var node = Object.create(MapNode.prototype);
		wall.addNode(node);
		expect(wall.nodes).to.have.members([node]);
		wall.removeNode(node);
		expect(wall.nodes).to.be.empty; // jshint ignore:line
	});

	it('should indicate whether a node is in the middle of the wall', function () {
		var head = Object.create(MapNode.prototype);
		var middle = Object.create(MapNode.prototype);
		var tail = Object.create(MapNode.prototype);
		wall.addNode(head);
		wall.addNode(middle);
		wall.addNode(tail);
		expect(wall.isMiddleNode(head)).to.equal(false);
		expect(wall.isMiddleNode(middle)).to.equal(true);
		expect(wall.isMiddleNode(tail)).to.equal(false);
	});

	it('should create a BoundingRect describing the combined size of its nodes', function () {
		var head = Object.create(MapNode.prototype);
		head.position = new Vector(5, 10);
		wall.addNode(head);
		wall.addNode({});
		wall.addNode({});
		var rect = wall.createBoundingRect(10);
		expect(rect.equals(new BoundingRect(new Vector(50, 100), new Vector(30, 10)))).to.equal(true);
	});
});
