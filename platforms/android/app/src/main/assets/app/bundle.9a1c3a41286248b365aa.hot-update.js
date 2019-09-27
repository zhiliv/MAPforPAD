webpackHotUpdate("bundle",{

/***/ "./ sync recursive (?<!\\bApp_Resources\\b.*)\\.(xml|css|js|(?<!\\.d\\.)ts|(?<!\\b_[\\w-]*\\.)scss)$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./app-root.xml": "./app-root.xml",
	"./app.css": "./app.css",
	"./app.js": "./app.js",
	"./common/UHF.js": "./common/UHF.js",
	"./main-page.js": "./main-page.js",
	"./main-page.xml": "./main-page.xml",
	"./main-view-model.js": "./main-view-model.js",
	"./www/MapMine/src/css/bootstrap.min.css": "./www/MapMine/src/css/bootstrap.min.css",
	"./www/MapMine/src/js/bootstrap.min.js": "./www/MapMine/src/js/bootstrap.min.js",
	"./www/MapMine/src/js/func.js": "./www/MapMine/src/js/func.js",
	"./www/MapMine/src/js/jquery.js": "./www/MapMine/src/js/jquery.js",
	"./www/MapMine/src/js/leaflet/leaflet-src.esm.js": "./www/MapMine/src/js/leaflet/leaflet-src.esm.js",
	"./www/MapMine/src/js/leaflet/leaflet-src.js": "./www/MapMine/src/js/leaflet/leaflet-src.js",
	"./www/MapMine/src/js/leaflet/leaflet.css": "./www/MapMine/src/js/leaflet/leaflet.css",
	"./www/MapMine/src/js/leaflet/leaflet.js": "./www/MapMine/src/js/leaflet/leaflet.js",
	"./www/MapMine/src/js/nativescript-webview-interface.js": "./www/MapMine/src/js/nativescript-webview-interface.js",
	"./www/MapMine/src/js/popper.min.js": "./www/MapMine/src/js/popper.min.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) { // check for number or string
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return id;
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./ sync recursive (?<!\\bApp_Resources\\b.*)\\.(xml|css|js|(?<!\\.d\\.)ts|(?<!\\b_[\\w-]*\\.)scss)$";

/***/ }),

/***/ "./common/UHF.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("./common/UHF.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "./common/UHF.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vXFxiX1tcXHctXSpcXC4pc2NzcykkIiwid2VicGFjazovLy8uL2NvbW1vbi9VSEYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwSDs7Ozs7OztBQ3ZDQSwrQztBQUNBLElBQUksS0FBVTs7QUFFZDtBQUNBO0FBQ0EsMkJBQTJCLDBDQUEwQztBQUNyRSxLQUFLO0FBQ0wsQyIsImZpbGUiOiJidW5kbGUuOWExYzNhNDEyODYyNDhiMzY1YWEuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtYXAgPSB7XG5cdFwiLi9hcHAtcm9vdC54bWxcIjogXCIuL2FwcC1yb290LnhtbFwiLFxuXHRcIi4vYXBwLmNzc1wiOiBcIi4vYXBwLmNzc1wiLFxuXHRcIi4vYXBwLmpzXCI6IFwiLi9hcHAuanNcIixcblx0XCIuL2NvbW1vbi9VSEYuanNcIjogXCIuL2NvbW1vbi9VSEYuanNcIixcblx0XCIuL21haW4tcGFnZS5qc1wiOiBcIi4vbWFpbi1wYWdlLmpzXCIsXG5cdFwiLi9tYWluLXBhZ2UueG1sXCI6IFwiLi9tYWluLXBhZ2UueG1sXCIsXG5cdFwiLi9tYWluLXZpZXctbW9kZWwuanNcIjogXCIuL21haW4tdmlldy1tb2RlbC5qc1wiLFxuXHRcIi4vd3d3L01hcE1pbmUvc3JjL2Nzcy9ib290c3RyYXAubWluLmNzc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2Nzcy9ib290c3RyYXAubWluLmNzc1wiLFxuXHRcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2Jvb3RzdHJhcC5taW4uanNcIjogXCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9ib290c3RyYXAubWluLmpzXCIsXG5cdFwiLi93d3cvTWFwTWluZS9zcmMvanMvZnVuYy5qc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2Z1bmMuanNcIixcblx0XCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9qcXVlcnkuanNcIjogXCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9qcXVlcnkuanNcIixcblx0XCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9sZWFmbGV0L2xlYWZsZXQtc3JjLmVzbS5qc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2xlYWZsZXQvbGVhZmxldC1zcmMuZXNtLmpzXCIsXG5cdFwiLi93d3cvTWFwTWluZS9zcmMvanMvbGVhZmxldC9sZWFmbGV0LXNyYy5qc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2xlYWZsZXQvbGVhZmxldC1zcmMuanNcIixcblx0XCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9sZWFmbGV0L2xlYWZsZXQuY3NzXCI6IFwiLi93d3cvTWFwTWluZS9zcmMvanMvbGVhZmxldC9sZWFmbGV0LmNzc1wiLFxuXHRcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2xlYWZsZXQvbGVhZmxldC5qc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2pzL2xlYWZsZXQvbGVhZmxldC5qc1wiLFxuXHRcIi4vd3d3L01hcE1pbmUvc3JjL2pzL25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZS5qc1wiOiBcIi4vd3d3L01hcE1pbmUvc3JjL2pzL25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZS5qc1wiLFxuXHRcIi4vd3d3L01hcE1pbmUvc3JjL2pzL3BvcHBlci5taW4uanNcIjogXCIuL3d3dy9NYXBNaW5lL3NyYy9qcy9wb3BwZXIubWluLmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdHZhciBpZCA9IG1hcFtyZXFdO1xuXHRpZighKGlkICsgMSkpIHsgLy8gY2hlY2sgZm9yIG51bWJlciBvciBzdHJpbmdcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIGlkO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi8gc3luYyByZWN1cnNpdmUgKD88IVxcXFxiQXBwX1Jlc291cmNlc1xcXFxiLiopXFxcXC4oeG1sfGNzc3xqc3woPzwhXFxcXC5kXFxcXC4pdHN8KD88IVxcXFxiX1tcXFxcdy1dKlxcXFwuKXNjc3MpJFwiOyIsIjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9jb21tb24vVUhGLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vY29tbW9uL1VIRi5qc1wiIH0pO1xuICAgIH0pO1xufSAiXSwic291cmNlUm9vdCI6IiJ9