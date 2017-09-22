(function ($, window, document, undefined) {
  var pluginName = "countdownA",
    defaults = {
      radius: 69,
      strokeStyle: "#1076a0",
      strokeWidth: 15,
      fillStyle: "transparent",
      fontColor: "#FFFFFF",
      fontFamily: "sans-serif",
      fontSize: 20,
      fontWeight: 700,
      autostart: true,
      seconds: 100,
      startOverAfterAdding: true,
      smooth: false,
      onComplete: function () {}
    };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    if (!this.settings.fontSize) { this.settings.fontSize = this.settings.radius/1.7; }
    if (!this.settings.strokeWidth) { this.settings.strokeWidth = this.settings.radius/4; }
    this._defaults = defaults;
    this._name = pluginName;
    this._init();
  }
  Plugin.prototype = {
    getElapsedTime: function()
    {
      return  Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
    },
    extendTimer: function (value) {
   var seconds = parseInt(value),
          secondsElapsed = Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
      if ((this._secondsLeft(secondsElapsed) + seconds) <= this.settings.seconds) {
        this.startedAt.setSeconds(this.startedAt.getSeconds() + parseInt(value));
      }
    },
    addSeconds: function (value) {
      var secondsElapsed = Math.round((new Date().getTime() - this.startedAt.getTime())/1000);
      if (this.settings.startOverAfterAdding) {
          this.settings.seconds = this._secondsLeft(secondsElapsed) + parseInt(value);
          this.start();
        } else {
          this.settings.seconds += parseInt(value);
        }
    },
    start: function () {
      this.startedAt = new Date();
      this._drawCountdownShape(Math.PI*3.5, true);
      this._drawCountdownLabel(0);
      var timerInterval = 1000;
      if (this.settings.smooth) {
        timerInterval = 16;
      }
      this.interval = setInterval(jQuery.proxy(this._draw, this), timerInterval);
    },
    stop: function (cb) {
      clearInterval(this.interval);
      this.circle.clearRect(0, 0, this.settings.width, this.settings.height);
	     $( "#countdownA_countdown" ).empty();
      if (cb) { cb(); }
    },

    _init: function () {
      this.settings.width = (this.settings.radius * 2) + (this.settings.strokeWidth * 2);
      this.settings.height = this.settings.width;
      this.settings.arcX = this.settings.radius + this.settings.strokeWidth;
      this.settings.arcY = this.settings.arcX;
      this._initcircle(this._Canvas());
      if (this.settings.autostart) { this.start(); }
    },

    _Canvas: function () {
      var $canvas = $("<canvas id=\"countdownA_" + $(this.element).attr("id") + "\"  width=\"" +
                      this.settings.width + "\" height=\"" +
                      this.settings.height + "\">" +
                      "</canvas>");
      $(this.element).prepend($canvas[0]);
      return $canvas[0];
    },

    _initcircle: function (canvas) {
      this.circle              = canvas.getContext("2d");
      this.circle.lineWidth    = this.settings.strokeWidth;
      this.circle.strokeStyle  = this.settings.strokeStyle;
      this.circle.fillStyle    = this.settings.fillStyle;
      this.circle.textAlign    = "center";
      this.circle.textBaseline = "middle";
      this._clearRect();
    },

    _clearRect: function () {
      this.circle.clearRect(0, 0, this.settings.width, this.settings.height);
    },

    _secondsLeft: function(secondsElapsed) {
      return this.settings.seconds - secondsElapsed;
    },


    _drawCountdownLabel: function (secondsElapsed) {

      this.circle.font = this.settings.fontWeight + " " + this.settings.fontSize + "px " + this.settings.fontFamily;
      var sekminLeft = this._secondsLeft(secondsElapsed),
          label = this.settings.label,
          drawLabel = this.settings.label,
		  label2 = this.settings.label2,
          drawLabel2 = this.settings.label2,
          x = this.settings.width/2;
		  y = this.settings.height/2.4 - (this.settings.fontSize/40);

		var minutes1 = Math.floor(sekminLeft / 60);
		var seconds1 = sekminLeft - minutes1 * 60;

		this.circle.fillStyle = this.settings.fillStyle;
		this.circle.fillStyle  = this.settings.fontColor;
		this.circle.fillText(minutes1 + ' min', x, y);
		this.circle.fillText(seconds1 + ' sek', this.settings.width/2, this.settings.height/1.9 + (this.settings.fontSize/3));

    },

    _drawCountdownShape: function (endAngle, drawStroke) {
      this.circle.fillStyle = this.settings.fillStyle;
      this.circle.beginPath();
      this.circle.arc(this.settings.arcX, this.settings.arcY, this.settings.radius, Math.PI*1.5, endAngle, false);
      this.circle.fill();
      if (drawStroke) { this.circle.stroke(); }
    },

    _draw: function () {
      var millisElapsed, secondsElapsed;
      millisElapsed = new Date().getTime() - this.startedAt.getTime();
      secondsElapsed = Math.floor((millisElapsed)/1000);
        endAngle = (Math.PI*3.5) - (((Math.PI*2)/(this.settings.seconds * 1000)) * millisElapsed);
      this._clearRect();
      this._drawCountdownShape(Math.PI*3.5, false);
      if (secondsElapsed < this.settings.seconds) {
        this._drawCountdownShape(endAngle, true);
        this._drawCountdownLabel(secondsElapsed);
      } else {
        this._drawCountdownLabel(this.settings.seconds);
        this.stop();
        this.settings.onComplete();
      }
    }
  };

  $.fn[pluginName] = function (options) {
    var plugin;
    this.each(function() {
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        plugin = new Plugin(this, options);
        $.data(this, "plugin_" + pluginName, plugin);
      }
    });
    return plugin;
  };

})(jQuery, window, document);
