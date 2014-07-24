Engine.module('resources.ImageResource',
	[],
	function () {
		'use strict';

		function ImageResource(url) {
			this.url = url;
			this.image = new Image(url);
			this.loaded = false;
		}

		ImageResource.prototype.load = function () {
			return Q.Promise(function (fulfill, reject) {
				this.image.onload = function () {
					if (this.width + this.height === 0) {
						this.onerror('Image has no size');
						return;
					}
					this.loaded = true;
					fulfill(this);
				};
				this.image.onerror = function (err) {
					reject(err);
				};
				this.image.src = 'assets/' + this.url;
			}.bind(this));
		};

		ImageResource.prototype.getImage = function () {
			return this.image;
		};

		ImageResource.prototype.toString = function () {
			return 'ImageResource(url=' + this.url +
				(this.loaded ? ', size=' + this.image.width + 'x' + this.image.height : '') +
				')';
		};

		return ImageResource;
	});
