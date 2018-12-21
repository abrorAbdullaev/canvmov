var CanvMov = {
    canvas: 	null,
    context: 	null,
    mouseThorttleTimer: null,
    options: {
        width: 		window.innerWidth,
        height: 	window.innerHeight,
        relativeToWindow: false,
        images: 	{},
        centerX: 	'',
        centerY: 	'',
        canvasId: 	'',
        bgImage: {
            url: '',
            fIndex: 0,
        }
    },
    init: function(options) {
        if (typeof options !== 'object') {
            console.log('CanvMov options is not an Object');
        }

        var _this = this;

        this.options = this._extend(this.options, options);
        this._prepareCanvas();
        this._prepareBg();

        this.initialRender();

        if (this.options.relativeToWindow === true) {
            window.addEventListener('mousemove', function(e) {
                _this._throttle(_this.handleMouseMove, 20, [e, _this]);
            });
        } else {
            this.canvas.addEventListener('mousemove', function(e) {
                _this._throttle(_this.handleMouseMove, 20, [e, _this]);
            });
        }
    },
    handleMouseMove: function(e, _this) {
        _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);

        var mouseDelta = _this._calcDelta(e);
        var mouseDeltaY = _this._calcDeltaY(e);

        _this.reRenderBg(mouseDelta);
        _this.reRender(mouseDelta, mouseDeltaY);
    },
    initialRender: function() {
        var _this = this;

        this.options.centerX  =	this.canvas.width / 2;
        this.options.centerY  =	this.canvas.height / 2;

        this.options.bgImage.ImageObject.onload = function() {
            _this.reRenderBg(0);
            _this._prepareImages();

            for(var i = 0; i < _this.options.images.length; i++) {
                _this.render(i);
            }
        }
    },
    reRenderBg: function(mouseDelta) {
        var newX = this.options.bgImage.fIndex * mouseDelta;

        this.context.drawImage(
            this.options.bgImage.ImageObject,
            parseInt(newX - (Math.abs(this.options.bgImage.fIndex) * 100)),
            0,
            this.canvas.width + (Math.abs(this.options.bgImage.fIndex) * (110 * 2)),
            this.canvas.height
        );
    },
    render: function(imageIndex) {
        var _this = this;

        this.options.images[imageIndex].ImageObject.onload = function() {
            var newX = _this.options.images[imageIndex].positionFromLeft,
                newY = _this.options.images[imageIndex].positionFromTop;

            _this.context.drawImage(
                _this.options.images[imageIndex].ImageObject,
                parseInt(newX),
                parseInt(newY)
            );
        };
    },
    reRender: function(mouseDelta, mouseDeltaY) {
        var _this = this;

        for (var i = 0; i < this.options.images.length; i++) {
            var newX = _this.options.images[i].positionFromLeft + (mouseDelta * _this.options.images[i].fIndex),
                newY = _this.options.images[i].positionFromTop + (mouseDeltaY * _this.options.images[i].fIndexY);

            _this.context.drawImage(
                _this.options.images[i].ImageObject,
                newX,
                newY
            );
        };
    },
    getInstance: function() {
        var newInstance = {};

        for (key in this) {
            newInstance[key] = this[key];
        }

        return newInstance;
    },
    _calcDelta: function(e) {
        var mouseX = e.clientX,
            delta = this.options.relativeToWindow ?
                parseInt(100 * (mouseX / (window.outerWidth / 2))) - 100 :
                parseInt(100 * ((mouseX - this.canvas.getBoundingClientRect().x) / this.options.centerX)) - 100;

        return delta;
    },
    _calcDeltaY: function(e) {
        var mouseY = e.clientY,
            delta = parseInt(100 * (mouseY / this.options.centerY)) - 100;

        return delta;
    },
    _prepareBg: function() {
        this.options.bgImage['ImageObject'] = new Image;
        this.options.bgImage.ImageObject.src = this.options.bgImage.url;
    },
    _prepareImages: function() {
        for (imageIndex in this.options.images) {
            this.options.images[imageIndex]['ImageObject'] = new Image;
            this.options.images[imageIndex].ImageObject.src = this.options.images[imageIndex].url;

            // Transform position from percent to fixed
            this.options.images[imageIndex].positionFromLeft = (this.options.images[imageIndex].positionFromLeft / 100) * this.canvas.width;
            this.options.images[imageIndex].positionFromTop = (this.options.images[imageIndex].positionFromTop / 100) * this.canvas.height;
        }
    },
    _prepareCanvas: function() {
        this.canvas               = document.getElementById(this.options.canvasId);
        this.canvas.style.width   =	'100%';
        this.canvas.style.height  =	'100%';
        this.canvas.width         =	this.canvas.offsetWidth;
        this.canvas.height        = this.canvas.offsetHeight;
        this.context              = this.canvas.getContext('2d');
    },
    _extend: function(defaults, extention) {
        var extended = {};
        var prop;

        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }

        for (prop in extention) {
            if (Object.prototype.hasOwnProperty.call(extention, prop)) {
                extended[prop] = extention[prop];
            }
        }

        return extended;
    },
    _throttle: function(callable, delay, args) {
        var _this = this;

        if (this.mouseThorttleTimer === null) {
            this.mouseThorttleTimer = setTimeout(function() {
                callable(...args);
                _this.mouseThorttleTimer = null;
            }, delay);
        }
    }
};