webpackHotUpdate("bundle",{

/***/ "./main-page.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Модуль для работы с окном
 * @member main-page
 */

 
//модуль для рабоыт с sqlite
var Sqlite = __webpack_require__( "../node_modules/nativescript-sqlite/sqlite.js" ),
oWebViewInterface;

//модуль для работы с окнами
const createViewModel = __webpack_require__("./main-view-model.js").createViewModel,
    //билиблиоека для обмена даными между программой и WebView
    webViewInterfaceModule = __webpack_require__("../node_modules/nativescript-webview-interface/index.js"),
    //модлуь для работы со считывателем
    UHF = __webpack_require__("./common/UHF.js")

/**  Открытие окна
 * @function onNavigatingTo
 * @param {Object} args Параметры  
 * @memberof main-page
 */ 
var onNavigatingTo = args => {
    //получаем праметры страницы
    const page = args.object;
    //создаем окно
    page.bindingContext = createViewModel();  
} 
  
/** 
 * Выполнение при загрузке документа   
 * @function pageLoaded   
 * @parms {Object} args Параметры
 * @memberof main-page    
 */
var pageLoaded = args => { 
    //получение параметров окна
    page = args.object;
    //установка параметров для обмена данными с WebView 
    setupWebViewInterface(page)
}

/** 
 * Инициализация связи между приложением и WebView
 * @function setupWebViewInterface
 * @param {Object} Окно привязки
 * @memberof main-page
 */
var setupWebViewInterface = async page => {
    //получение элемента
    var webView = page.getViewById('webView');
    //установка соедидения
    oWebViewInterface = await new webViewInterfaceModule.WebViewInterface(webView, 'file:///storage/emulated/0/MapMine/src/index.html');
    getAllLabel()
}

UHF.getArr().then(list => {
    console.log("TCL: onFindUHF -> list", list)
    //отправить данные в WebVIEW
    oWebViewInterface.emit('listUHF', list)
})

new Sqlite("labels.db", [1], function(err, db) {
  db.get('SELECT * FROM AllLables', (err, row) => {
  console.log("TCL: row", row)
    
  })
});

var getAllLabel = () => {
  oWebViewInterface.on('getAllLabel', () => {


  })
}




/*  */
exports.onNavigatingTo = onNavigatingTo;
exports.pageLoaded = pageLoaded;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxhQUFhLG1CQUFPLEVBQUUsK0NBQXFCO0FBQzNDOztBQUVBO0FBQ0Esd0JBQXdCLG1CQUFPLENBQUMsc0JBQW1CO0FBQ25EO0FBQ0EsNkJBQTZCLG1CQUFPLENBQUMseURBQWdDO0FBQ3JFO0FBQ0EsVUFBVSxtQkFBTyxDQUFDLGlCQUFjOztBQUVoQztBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDO0FBQ0EsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBLDBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNILENBQUM7O0FBRUQ7QUFDQTs7O0FBR0EsR0FBRztBQUNIOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBLEM7QUFDQSxJQUFJLEtBQVU7O0FBRWQ7QUFDQTtBQUNBLDJCQUEyQix5Q0FBeUM7QUFDcEUsS0FBSztBQUNMLEMiLCJmaWxlIjoiYnVuZGxlLjVkODdjYWI2YmQ1ZTY4ZGM0YWEyLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog0JzQvtC00YPQu9GMINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEg0L7QutC90L7QvFxyXG4gKiBAbWVtYmVyIG1haW4tcGFnZVxyXG4gKi9cclxuXHJcbiBcclxuLy/QvNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YvRgiDRgSBzcWxpdGVcclxudmFyIFNxbGl0ZSA9IHJlcXVpcmUoIFwibmF0aXZlc2NyaXB0LXNxbGl0ZVwiICksXHJcbm9XZWJWaWV3SW50ZXJmYWNlO1xyXG5cclxuLy/QvNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQvtC60L3QsNC80LhcclxuY29uc3QgY3JlYXRlVmlld01vZGVsID0gcmVxdWlyZShcIi4vbWFpbi12aWV3LW1vZGVsXCIpLmNyZWF0ZVZpZXdNb2RlbCxcclxuICAgIC8v0LHQuNC70LjQsdC70LjQvtC10LrQsCDQtNC70Y8g0L7QsdC80LXQvdCwINC00LDQvdGL0LzQuCDQvNC10LbQtNGDINC/0YDQvtCz0YDQsNC80LzQvtC5INC4IFdlYlZpZXdcclxuICAgIHdlYlZpZXdJbnRlcmZhY2VNb2R1bGUgPSByZXF1aXJlKCduYXRpdmVzY3JpcHQtd2Vidmlldy1pbnRlcmZhY2UnKSxcclxuICAgIC8v0LzQvtC00LvRg9GMINC00LvRjyDRgNCw0LHQvtGC0Ysg0YHQviDRgdGH0LjRgtGL0LLQsNGC0LXQu9C10LxcclxuICAgIFVIRiA9IHJlcXVpcmUoJy4vY29tbW9uL1VIRicpXHJcblxyXG4vKiogINCe0YLQutGA0YvRgtC40LUg0L7QutC90LBcclxuICogQGZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmdzINCf0LDRgNCw0LzQtdGC0YDRiyAgXHJcbiAqIEBtZW1iZXJvZiBtYWluLXBhZ2VcclxuICovIFxyXG52YXIgb25OYXZpZ2F0aW5nVG8gPSBhcmdzID0+IHtcclxuICAgIC8v0L/QvtC70YPRh9Cw0LXQvCDQv9GA0LDQvNC10YLRgNGLINGB0YLRgNCw0L3QuNGG0YtcclxuICAgIGNvbnN0IHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIC8v0YHQvtC30LTQsNC10Lwg0L7QutC90L5cclxuICAgIHBhZ2UuYmluZGluZ0NvbnRleHQgPSBjcmVhdGVWaWV3TW9kZWwoKTsgIFxyXG59IFxyXG4gIFxyXG4vKiogXHJcbiAqINCS0YvQv9C+0LvQvdC10L3QuNC1INC/0YDQuCDQt9Cw0LPRgNGD0LfQutC1INC00L7QutGD0LzQtdC90YLQsCAgIFxyXG4gKiBAZnVuY3Rpb24gcGFnZUxvYWRlZCAgIFxyXG4gKiBAcGFybXMge09iamVjdH0gYXJncyDQn9Cw0YDQsNC80LXRgtGA0YtcclxuICogQG1lbWJlcm9mIG1haW4tcGFnZSAgICBcclxuICovXHJcbnZhciBwYWdlTG9hZGVkID0gYXJncyA9PiB7IFxyXG4gICAgLy/Qv9C+0LvRg9GH0LXQvdC40LUg0L/QsNGA0LDQvNC10YLRgNC+0LIg0L7QutC90LBcclxuICAgIHBhZ2UgPSBhcmdzLm9iamVjdDtcclxuICAgIC8v0YPRgdGC0LDQvdC+0LLQutCwINC/0LDRgNCw0LzQtdGC0YDQvtCyINC00LvRjyDQvtCx0LzQtdC90LAg0LTQsNC90L3Ri9C80Lgg0YEgV2ViVmlldyBcclxuICAgIHNldHVwV2ViVmlld0ludGVyZmFjZShwYWdlKVxyXG59XHJcblxyXG4vKiogXHJcbiAqINCY0L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPINGB0LLRj9C30Lgg0LzQtdC20LTRgyDQv9GA0LjQu9C+0LbQtdC90LjQtdC8INC4IFdlYlZpZXdcclxuICogQGZ1bmN0aW9uIHNldHVwV2ViVmlld0ludGVyZmFjZVxyXG4gKiBAcGFyYW0ge09iamVjdH0g0J7QutC90L4g0L/RgNC40LLRj9C30LrQuFxyXG4gKiBAbWVtYmVyb2YgbWFpbi1wYWdlXHJcbiAqL1xyXG52YXIgc2V0dXBXZWJWaWV3SW50ZXJmYWNlID0gYXN5bmMgcGFnZSA9PiB7XHJcbiAgICAvL9C/0L7Qu9GD0YfQtdC90LjQtSDRjdC70LXQvNC10L3RgtCwXHJcbiAgICB2YXIgd2ViVmlldyA9IHBhZ2UuZ2V0Vmlld0J5SWQoJ3dlYlZpZXcnKTtcclxuICAgIC8v0YPRgdGC0LDQvdC+0LLQutCwINGB0L7QtdC00LjQtNC10L3QuNGPXHJcbiAgICBvV2ViVmlld0ludGVyZmFjZSA9IGF3YWl0IG5ldyB3ZWJWaWV3SW50ZXJmYWNlTW9kdWxlLldlYlZpZXdJbnRlcmZhY2Uod2ViVmlldywgJ2ZpbGU6Ly8vc3RvcmFnZS9lbXVsYXRlZC8wL01hcE1pbmUvc3JjL2luZGV4Lmh0bWwnKTtcclxuICAgIGdldEFsbExhYmVsKClcclxufVxyXG5cclxuVUhGLmdldEFycigpLnRoZW4obGlzdCA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIlRDTDogb25GaW5kVUhGIC0+IGxpc3RcIiwgbGlzdClcclxuICAgIC8v0L7RgtC/0YDQsNCy0LjRgtGMINC00LDQvdC90YvQtSDQsiBXZWJWSUVXXHJcbiAgICBvV2ViVmlld0ludGVyZmFjZS5lbWl0KCdsaXN0VUhGJywgbGlzdClcclxufSlcclxuXHJcbm5ldyBTcWxpdGUoXCJsYWJlbHMuZGJcIiwgWzFdLCBmdW5jdGlvbihlcnIsIGRiKSB7XHJcbiAgZGIuZ2V0KCdTRUxFQ1QgKiBGUk9NIEFsbExhYmxlcycsIChlcnIsIHJvdykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKFwiVENMOiByb3dcIiwgcm93KVxyXG4gICAgXHJcbiAgfSlcclxufSk7XHJcblxyXG52YXIgZ2V0QWxsTGFiZWwgPSAoKSA9PiB7XHJcbiAgb1dlYlZpZXdJbnRlcmZhY2Uub24oJ2dldEFsbExhYmVsJywgKCkgPT4ge1xyXG5cclxuXHJcbiAgfSlcclxufVxyXG5cclxuXHJcblxyXG5cclxuLyogICovXHJcbmV4cG9ydHMub25OYXZpZ2F0aW5nVG8gPSBvbk5hdmlnYXRpbmdUbztcclxuZXhwb3J0cy5wYWdlTG9hZGVkID0gcGFnZUxvYWRlZDtcclxuOyBcbmlmIChtb2R1bGUuaG90ICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSSAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkoXCIuL21haW4tcGFnZS5qc1wiKSApIHtcbiAgICBcbiAgICBtb2R1bGUuaG90LmFjY2VwdCgpO1xuICAgIG1vZHVsZS5ob3QuZGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIGdsb2JhbC5obXJSZWZyZXNoKHsgdHlwZTogXCJzY3JpcHRcIiwgcGF0aDogXCIuL21haW4tcGFnZS5qc1wiIH0pO1xuICAgIH0pO1xufSAiXSwic291cmNlUm9vdCI6IiJ9