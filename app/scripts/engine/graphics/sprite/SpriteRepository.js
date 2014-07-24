Engine.module('graphics.sprite.SpriteRepository',
	[
		'graphics.sprite.SpriteSheet',
		'graphics.sprite.Sprite',
		'resources.ResourceLoader',
		'resources.ImageResource'
	],
	function (SpriteSheet, Sprite, ResourceLoader, ImageResource) {
		'use strict';

		var images = {};
		var sprites = {};
		var spriteSheets = {};

		function loadImage(url) {
			if (!images[url]) {
				images[url] = enqueueImage(url);
			}
		}

		function enqueueImage(url) {
			return ResourceLoader.enqueue(new ImageResource(url)).getImage();
		}

		/**
		 *
		 * @constructor
		 */
		function SpriteRepository() {
		}

		SpriteRepository.prototype.DEFAULT_GRID_SIZE = 32;

		/**
		 *
		 * @returns {SpriteSheetBuilder}
		 */
		SpriteRepository.prototype.createSpriteSheetBuilder = function () {
			return new SpriteSheetBuilder(this, this.DEFAULT_GRID_SIZE, this.DEFAULT_GRID_SIZE);
		};

		SpriteRepository.prototype.addSheet = function (spriteSheet) {
			spriteSheets[spriteSheet.name] = spriteSheet;
		};

		SpriteRepository.prototype.retrieveSheet = function (name) {
			if (!spriteSheets[name]) {
				throw 'unknown sprite sheet: ' + name;
			}
			return spriteSheets[name];
		};

		SpriteRepository.prototype.add = function (spriteDef) {
			loadImage(spriteDef.url);
			var Ctor = (spriteDef.ctor || Sprite);
			var sprite = new Ctor();
			sprite.init(images[spriteDef.url], spriteDef.x, spriteDef.y, spriteDef.w, spriteDef.h, spriteDef.margins);
			sprites[spriteDef.name] = sprite;
		};

		SpriteRepository.prototype.retrieve = function (name) {
			if (!sprites[name]) {
				throw 'unknown sprite: ' + name;
			}
			return sprites[name];
		};

		/**
		 *
		 * @param spriteRepository
		 * @param gridW
		 * @param gridH
		 * @param offsetX
		 * @param offsetY
		 * @constructor
		 */
		function SpriteSheetBuilder(spriteRepository, gridW, gridH, offsetX, offsetY) {
			this.spriteRepository = spriteRepository;
			this.name = null;
			this.url = null;
			this.grid = [gridW, gridH];
			this.offset = [offsetX || 0, offsetY || 0];
			this.position = [0, 0];
			this.sprites = [];
			this.subSheets = [];
		}

		SpriteSheetBuilder.prototype.withName = function (name) {
			this.name = name;
			return this;
		};

		SpriteSheetBuilder.prototype.usingImage = function (url) {
			this.url = url;
			return this;
		};

		SpriteSheetBuilder.prototype.withGridSize = function (gridW, gridH) {
			this.grid = [gridW, gridH];
			return this;
		};

		//noinspection JSUnusedGlobalSymbols
		SpriteSheetBuilder.prototype.atPosition = function (x, y) {
			this.position = [x, y];
			return this;
		};

		SpriteSheetBuilder.prototype.define = function (name, margins, ctor) {
			// isFunction
			if (!!(margins && margins.constructor && margins.call && margins.apply)) {
				ctor = margins;
				margins = undefined;
			}
			this.sprites.push({
				name: name,
				margins: margins,
				ctor: ctor,
				url: this.url,
				x: this.offset[0] + this.position[0] * this.grid[0],
				y: this.offset[1] + this.position[1] * this.grid[1],
				w: this.grid[0],
				h: this.grid[1]
			});
			return this;
		};

		//noinspection JSUnusedGlobalSymbols
		SpriteSheetBuilder.prototype.createSubSheet = function (gridW, gridH) {
			var subSheetBuilder = new SpriteSheetBuilder(
				this.spriteRepository, gridW, gridH, this.position[0] * this.grid[0], this.position[1] * this.grid[1]);
			this.subSheets.push(subSheetBuilder);
			return subSheetBuilder;
		};

		SpriteSheetBuilder.prototype.build = function () {
			var i, l;

			loadImage(this.url);
			var sheet = new SpriteSheet();
			sheet.init(images[this.url], this.grid);

			if (this.name) {
				sheet.name = this.name;
				sheet = this.spriteRepository.addSheet(sheet);
			}

			for (i = 0, l = this.sprites.length; i < l; i++) {
				this.spriteRepository.add(this.sprites[i]);
			}

			for (i = 0, l = this.subSheets.length; i < l; i++) {
				this.subSheets[i].build();
			}

			return sheet;
		};

		return new SpriteRepository();
	});
