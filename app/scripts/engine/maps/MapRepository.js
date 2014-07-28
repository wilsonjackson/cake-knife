Engine.module('maps.MapRepository',
	[
		'resources.ResourceLoader',
		'resources.JsonResource',
		'graphics.sprite.SpriteRepository',
		'maps.Map',
		'util.Path'
	],
	/**
	 *
	 * @param ResourceLoader
	 * @param JsonResource
	 * @param {SpriteRepository} SpriteRepository
	 * @param Map
	 * @param Path
	 * @returns {MapRepository}
	 */
	function (ResourceLoader, JsonResource, SpriteRepository, Map, Path) {
		'use strict';

		/**
		 *
		 * @constructor
		 */
		function MapRepository() {
			this.maps = {};
		}

		MapRepository.prototype.retrieve = function (name) {
			return this.maps[name];
		};

		MapRepository.prototype.addTiledJson = function (mapName, url) {
			ResourceLoader.enqueue(new JsonResource(url)).onLoad(function (data) {
				this.maps[mapName] = this.readTiledMap(data, url);
			}.bind(this));
		};

		MapRepository.prototype.readTiledMap = function (tiledMap, sourceUrl) {
			var i, l;
			var map = new Map(tiledMap.width, tiledMap.height, tiledMap.tilewidth, tiledMap.tileheight);

			for (i = 0, l = tiledMap.layers.length; i < l; i++) {
				map.addLayer(tiledMap.layers[i].name, tiledMap.layers[i].data);
			}

			for (i = 0, l = tiledMap.tilesets.length; i < l; i++) {
				var tileSet = tiledMap.tilesets[i];
				if (tileSet.name === 'collide') {
					continue;
				}
				var spriteSheet = SpriteRepository.createSpriteSheetBuilder()
					.usingImage(Path.resolve(sourceUrl, tileSet.image))
					.withGridSize(tileSet.tilewidth, tileSet.tileheight)
					.build();
				map.addTileSet(tileSet.firstgid, spriteSheet);
			}

			return map;
		};

		return new MapRepository();
	});
