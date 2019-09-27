webpackHotUpdate("bundle",{

/***/ "./main-page.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
const createViewModel = __webpack_require__("./main-view-model.js").createViewModel,
webViewInterfaceModule = __webpack_require__("../node_modules/nativescript-webview-interface/index.js");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel();
}

function pageLoaded(args) {
  page = args.object;
  setupWebViewInterface(page)
}

// инизиализация WebView интерфейса
function setupWebViewInterface(page) {
  var webView = page.getViewById('webView');
  oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, 'file:///storage/emulated/0/MapMine/src/index.html');
}


exports.onNavigatingTo = onNavigatingTo;
 ; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("./main-page.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "./main-page.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0JBQXdCLG1CQUFPLENBQUMsc0JBQW1CO0FBQ25ELHlCQUF5QixtQkFBTyxDQUFDLHlEQUFnQzs7QUFFakU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxFO0FBQ0EsSUFBSSxLQUFVOztBQUVkO0FBQ0E7QUFDQSwyQkFBMkIseUNBQXlDO0FBQ3BFLEtBQUs7QUFDTCxDIiwiZmlsZSI6ImJ1bmRsZS43NzQ3NTI0ZDc4ZmI0YmM5Nzk4Ni5ob3QtdXBkYXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmNvbnN0IGNyZWF0ZVZpZXdNb2RlbCA9IHJlcXVpcmUoXCIuL21haW4tdmlldy1tb2RlbFwiKS5jcmVhdGVWaWV3TW9kZWwsXHJcbndlYlZpZXdJbnRlcmZhY2VNb2R1bGUgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQtd2Vidmlldy1pbnRlcmZhY2UnKTtcclxuXHJcbmZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvKGFyZ3MpIHtcclxuICAgIGNvbnN0IHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBjcmVhdGVWaWV3TW9kZWwoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFnZUxvYWRlZChhcmdzKSB7XHJcbiAgcGFnZSA9IGFyZ3Mub2JqZWN0O1xyXG4gIHNldHVwV2ViVmlld0ludGVyZmFjZShwYWdlKVxyXG59XHJcblxyXG4vLyDQuNC90LjQt9C40LDQu9C40LfQsNGG0LjRjyBXZWJWaWV3INC40L3RgtC10YDRhNC10LnRgdCwXHJcbmZ1bmN0aW9uIHNldHVwV2ViVmlld0ludGVyZmFjZShwYWdlKSB7XHJcbiAgdmFyIHdlYlZpZXcgPSBwYWdlLmdldFZpZXdCeUlkKCd3ZWJWaWV3Jyk7XHJcbiAgb1dlYlZpZXdJbnRlcmZhY2UgPSBuZXcgd2ViVmlld0ludGVyZmFjZU1vZHVsZS5XZWJWaWV3SW50ZXJmYWNlKHdlYlZpZXcsICdmaWxlOi8vL3N0b3JhZ2UvZW11bGF0ZWQvMC9NYXBNaW5lL3NyYy9pbmRleC5odG1sJyk7XHJcbn1cclxuXHJcblxyXG5leHBvcnRzLm9uTmF2aWdhdGluZ1RvID0gb25OYXZpZ2F0aW5nVG87XHJcbiA7IFxuaWYgKG1vZHVsZS5ob3QgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSShcIi4vbWFpbi1wYWdlLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vbWFpbi1wYWdlLmpzXCIgfSk7XG4gICAgfSk7XG59ICJdLCJzb3VyY2VSb290IjoiIn0=