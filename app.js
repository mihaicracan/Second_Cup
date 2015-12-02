var APP = {

	MAX_POINTS: 20,
	CURRENT_POINTS: 0,

	init: function() {
		this.cacheDOM();
		this.render();
	},

	cacheDOM: function() {
		this.$glass = $(".glass");
		this.$glass_wrapper  = this.$glass.find(".wrapper");
		this.$glass_content  = this.$glass.find(".content");
		this.$content_hiding = this.$glass.find(".content-hiding");

		this.$drop_wrapper = $(".drop-wrapper");
		this.$drop         = this.$drop_wrapper.find(".drop");
		this.$drop_img     = this.$drop.find("img");
		this.$drop_content = this.$drop.find(".content");
		this.$drop_value   = this.$drop.find(".value");

		this.$points       = $(".points");
		this.$points_value = this.$points.find(".value"); 
		this.$points_label = this.$points.find(".label");

		this.$remaining_points = $("#remaining-points");

		this.HEIGHT = $(window).height();
		this.WIDTH  = $(window).width();
	},

	render: function() {
		this.initGlass();
	},

	initGlass: function() {
		var bottom_top = this.$glass_wrapper.offset().top + this.$glass_wrapper.height();
		this.BOTTOM_HEIGHT = this.HEIGHT - bottom_top + 5;

		this.$content_hiding.css("height", this.BOTTOM_HEIGHT + "px");
		this.$glass_content.show();
		this.$glass_content.css("margin-top", "-" + (this.BOTTOM_HEIGHT + 30) + "px");
	},

	fillGlass: function(percentage, cb) {
		var height = (this.$glass_wrapper.height() - 60) * percentage / 100;
		var margin_top = (-1) * (this.BOTTOM_HEIGHT + 30 + height);
		
		this.$glass_content.velocity({
			"margin-top": margin_top + "px"
		}, 1000, function() {
			if (typeof cb != "undefined") {
				cb();
			}
		});
	},
	
	resetDrop: function() {
		this.$drop_wrapper.css("top", "95px");
		this.$drop.css("width", "0px");
	},

	showDrop: function(value, cb) {
		// inject value
		this.$drop_value.html("+ " + value);

		// show drop with animation
		this.$drop_wrapper.css("opacity", 1);
		this.$drop.velocity({
			"width": "80px"
		}, 1000, "spring", function() {
			if (typeof cb != "undefined") {
				cb();
			}
		});
	},

	dropDrop: function(cb) {
		// compute finish position
		var glass_top = this.$glass_wrapper.offset().top;
		var finish_position = glass_top + 100;

		// animate
		this.$drop_wrapper.velocity({
			"top": finish_position + "px",
			"opacity": 0
		}, 500, function() {
			if (typeof cb != "undefined") {
				cb();
			}
		});
	},

	animateValueTo: function(selector, value) {
		var start_value = selector.text();

		selector.prop('Counter', start_value).animate({
	        Counter: value
	    }, {
	        duration: 1000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Math.ceil(now));
	        }
	    });
	},

	hidePoints: function() {
		this.$points_value.velocity({
			"font-size": "0px"
		}, 500, "easeOutQuint");

		this.$points_label.velocity({
			"font-size": "0px"
		}, 500, "easeOutQuint");
	},

	showPoints: function() {
		this.$points_value.velocity({
			"font-size": "115px"
		}, 500, "easeOutQuint");

		this.$points_label.velocity({
			"font-size": "30px"
		}, 500, "easeOutQuint");
	},

	givePoints: function(points, cb) {
		this.CURRENT_POINTS += points;
		var percentage = this.CURRENT_POINTS * 100 / this.MAX_POINTS;

		// hide points display
		APP.hidePoints();
		// at the same time show the drop
		APP.showDrop(points, function() {

			// when drop is displayed show the points again
			APP.showPoints();
			// at the same time drop the drop
			APP.dropDrop(function() {

				// when the drop is dropped animate points to the new value
				APP.animateValueTo(APP.$points_value, APP.CURRENT_POINTS);
				APP.animateValueTo(APP.$remaining_points, APP.MAX_POINTS - APP.CURRENT_POINTS);
				// and fill the glass at the same time
				APP.fillGlass(percentage, function() {
					// when animation chain is done, reset the drop to initial position
					APP.resetDrop();

					if (typeof cb != "undefined") {
						cb();
					}
				});
			});
		});
	},

	run: function() {
		APP.givePoints(15, function(){
			APP.givePoints(5);
		});	
	}
};

APP.init();
APP.run();
