(function ($) {
	/**
	 * @param {Object} container
	 * @param {Object} options
	 * @constructor
	 */
	function Slider( container, options ) {
		this.container = container;

		this.transition = options.transition || 'slide';
		this.speed = options.speed || 250;

		this.imgs = this.container.find('img');
		this.imgWidth = this.imgs[0].width;
		this.imgsLen = this.imgs.length;

		this.current = 0;
	}

	/**
	 * @param {string} transition
	 * @param {int} coords
	 * @private
	 */
	Slider.prototype._transition = function () {
		// if ( this.transition === 'fade' ) {
		// 	this._transitionFade();
		// } else {
		// 	this._transitionSlide();
		// }
		var method = '_transition' + this.transition.charAt(0).toUpperCase() + this.transition.substr(1);
		console.log(method);
		if ( typeof this[method] === 'function' ) {
			this[method]();

		} else {
			this._transitionSlide();
		}

		return this;
	};

	/**
	 * @private
	 */
	Slider.prototype._transitionSlide = function ( speed, coords ) {
		speed = speed || this.speed;
		this.container.animate({
			'margin-left': coords || -( this.current * this.imgWidth )
		}, speed);

		return this;
	};

	/**
	 * @private
	 */
	Slider.prototype._transitionFade = function () {
		this.container.fadeOut(this.speed);
		this._transitionSlide(10);
		this.container.fadeIn(this.speed);

		return this;
	};

	/**
	 * @public
	 */
	Slider.prototype.setCurrent = function ( dir ) {
		var pos = this.current;

		( dir === "next" ) ? pos++ : pos--;

		this.current = ( pos < 0 ) ? this.imgsLen - 1 : pos % this.imgsLen;

		this._transition();
		return this;
	};

	/**
	 * @public
	 */
	Slider.prototype.slideToNext = function () {
		this.setCurrent('next');

		return this;
	};


	//Slider plugin
	$.fn.slider = function () {
		var sliderNav = $('.slider-nav[data-slider=\"' + this.attr('id') + '\"]').show(), 
			container = this.css('overflow', 'hidden').children('ul'),
			sliderData = container.parent(),
			//options
			autoplay = sliderData.data('autoplay') || false,
			autoplayInterval = sliderData.data('autoplay-interval') || 1500,
			click = sliderData.data('click') || true;

			//Slider instance
			slider = new Slider( container, {
				transition: sliderData.data('transition') || 'slide',
				speed : sliderData.data('speed') || 250
			});

		if ( autoplay ) {
			var ap = setInterval( function () {
				slider.slideToNext()
			}, autoplayInterval);
		}

		if ( click ) {
			container.on('click', function () {
				slider.slideToNext();
			});
		}

		sliderNav.find('.button').on('click', function () {
			slider.setCurrent( $(this).data('dir') );

			return false;
		});

		return $(this);
	};


	//Popup

	function Popup (popup) {
		this.popup = popup;
	}

	Popup.prototype.showPopup = function () {
		//Appending verlay if we call popup by the first time
		if ($('.overlay').length) $('body').append('<div class="overlay"></div>');
		this.animatePopupIn();

		return this;
	};

	Popup.prototype.hidePopup = function () {
		this.animatePopupOut();

		return this;
	};

	Popup.prototype.positionPopup = function () {
		//var popup = $('.popup').is(':visible'),
		var pWidth = this.popup.width(),
			pHeight = this.popup.height(),
			wWidth = $(window).width(),
			wHeight = $(window).height(),
			pTop = ( wHeight - pHeight ) / 2,
			pLeft = ( wWidth - pWidth ) / 2;

		this.popup.css('top', pTop);
		this.popup.css('left', pLeft);

		return this;
	}

	Popup.prototype.animatePopupIn = function () {
		$('.overlay').fadeIn();
		this.positionPopup();
		this.popup.fadeIn();

		return this;
	};

	Popup.prototype.animatePopupOut = function () {
		$('.overlay').fadeOut();
		$('.popup').fadeOut();

		return this;
	};

	//Popup Factory 
	$.fn.popup = function () {
		var popupControll = $('a[data-popup=\"' + $(this).attr('id') + '\"]'), 
			popup = new Popup(this);

		popupControll.on('click', function () {
			popup.animatePopupIn();
			return false;
		});

		$('.overlay').on('click', function () {
			popup.animatePopupOut();
		});

		$(window).resize( function () {
			popup.positionPopup();
		});
		return $(this);
	};

})(jQuery);