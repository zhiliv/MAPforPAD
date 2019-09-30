webpackHotUpdate("bundle",{

/***/ "./main-page.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const createViewModel = __webpack_require__("./main-view-model.js").createViewModel,
    webViewInterfaceModule = __webpack_require__("../node_modules/nativescript-webview-interface/index.js"),
    UHF = __webpack_require__("./common/UHF.js")

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


UHF.getArr().then(list => {
  console.log("TCL: onFindUHF -> list", list)
    //отправить данные в WebVIEW
    oWebViewInterface.emit('listUHF', list)
  })

exports.onNavigatingTo = onNavigatingTo;
exports.pageLoaded = pageLoaded;
//указание onFindUHF как экспортной
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzRUFBd0IsbUJBQU8sQ0FBQyxzQkFBbUI7QUFDbkQsNkJBQTZCLG1CQUFPLENBQUMseURBQWdDO0FBQ3JFLFVBQVUsbUJBQU8sQ0FBQyxpQkFBYzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEM7QUFDQSxJQUFJLEtBQVU7O0FBRWQ7QUFDQTtBQUNBLDJCQUEyQix5Q0FBeUM7QUFDcEUsS0FBSztBQUNMLEMiLCJmaWxlIjoiYnVuZGxlLmI1OWE3MTU5OTViZThiMzYyM2U3LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjcmVhdGVWaWV3TW9kZWwgPSByZXF1aXJlKFwiLi9tYWluLXZpZXctbW9kZWxcIikuY3JlYXRlVmlld01vZGVsLFxyXG4gICAgd2ViVmlld0ludGVyZmFjZU1vZHVsZSA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZScpLFxyXG4gICAgVUhGID0gcmVxdWlyZSgnLi9jb21tb24vVUhGJylcclxuXHJcbmZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvKGFyZ3MpIHtcclxuICAgIGNvbnN0IHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBjcmVhdGVWaWV3TW9kZWwoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFnZUxvYWRlZChhcmdzKSB7XHJcbiAgICBwYWdlID0gYXJncy5vYmplY3Q7XHJcbiAgICBzZXR1cFdlYlZpZXdJbnRlcmZhY2UocGFnZSlcclxufVxyXG5cclxuLy8g0LjQvdC40LfQuNCw0LvQuNC30LDRhtC40Y8gV2ViVmlldyDQuNC90YLQtdGA0YTQtdC50YHQsFxyXG5mdW5jdGlvbiBzZXR1cFdlYlZpZXdJbnRlcmZhY2UocGFnZSkge1xyXG4gICAgdmFyIHdlYlZpZXcgPSBwYWdlLmdldFZpZXdCeUlkKCd3ZWJWaWV3Jyk7XHJcbiAgICBvV2ViVmlld0ludGVyZmFjZSA9IG5ldyB3ZWJWaWV3SW50ZXJmYWNlTW9kdWxlLldlYlZpZXdJbnRlcmZhY2Uod2ViVmlldywgJ2ZpbGU6Ly8vc3RvcmFnZS9lbXVsYXRlZC8wL01hcE1pbmUvc3JjL2luZGV4Lmh0bWwnKTtcclxufVxyXG5cclxuXHJcblVIRi5nZXRBcnIoKS50aGVuKGxpc3QgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFwiVENMOiBvbkZpbmRVSEYgLT4gbGlzdFwiLCBsaXN0KVxyXG4gICAgLy/QvtGC0L/RgNCw0LLQuNGC0Ywg0LTQsNC90L3Ri9C1INCyIFdlYlZJRVdcclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlLmVtaXQoJ2xpc3RVSEYnLCBsaXN0KVxyXG4gIH0pXHJcblxyXG5leHBvcnRzLm9uTmF2aWdhdGluZ1RvID0gb25OYXZpZ2F0aW5nVG87XHJcbmV4cG9ydHMucGFnZUxvYWRlZCA9IHBhZ2VMb2FkZWQ7XHJcbi8v0YPQutCw0LfQsNC90LjQtSBvbkZpbmRVSEYg0LrQsNC6INGN0LrRgdC/0L7RgNGC0L3QvtC5XHJcbjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9tYWluLXBhZ2UuanNcIikgKSB7XG4gICAgXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4ge1xuICAgICAgICBnbG9iYWwuaG1yUmVmcmVzaCh7IHR5cGU6IFwic2NyaXB0XCIsIHBhdGg6IFwiLi9tYWluLXBhZ2UuanNcIiB9KTtcbiAgICB9KTtcbn0gIl0sInNvdXJjZVJvb3QiOiIifQ==