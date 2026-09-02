(function($, window) {
var Test = null;
Test = {
	name: "Test",
	
	init: function() {
		ObserverControl.addObserver(this);
		this.beforeBind();
		this.bind();
		this.afterBind();
		UI.init();
	},
	
	beforeBind: function() {
		console.log("1");
		console.log("2");
		console.log("3");
		console.log("4");
		console.log("5");

	},
	
	bind: function() {},
	
	afterBind: function() {},
	
	fn: {}
};
window.Test = Test;

})(jQuery, window);