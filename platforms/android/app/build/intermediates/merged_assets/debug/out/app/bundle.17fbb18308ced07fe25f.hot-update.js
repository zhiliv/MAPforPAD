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

new Sqlite("labels.db", function(err, db) {
  db.get('SELECT * FROM AllLables')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxhQUFhLG1CQUFPLEVBQUUsK0NBQXFCO0FBQzNDOztBQUVBO0FBQ0Esd0JBQXdCLG1CQUFPLENBQUMsc0JBQW1CO0FBQ25EO0FBQ0EsNkJBQTZCLG1CQUFPLENBQUMseURBQWdDO0FBQ3JFO0FBQ0EsVUFBVSxtQkFBTyxDQUFDLGlCQUFjOztBQUVoQztBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDO0FBQ0EsQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBLDBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOzs7QUFHQSxHQUFHO0FBQ0g7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0EsQztBQUNBLElBQUksS0FBVTs7QUFFZDtBQUNBO0FBQ0EsMkJBQTJCLHlDQUF5QztBQUNwRSxLQUFLO0FBQ0wsQyIsImZpbGUiOiJidW5kbGUuMTdmYmIxODMwOGNlZDA3ZmUyNWYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDQnNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQvtC60L3QvtC8XHJcbiAqIEBtZW1iZXIgbWFpbi1wYWdlXHJcbiAqL1xyXG5cclxuIFxyXG4vL9C80L7QtNGD0LvRjCDQtNC70Y8g0YDQsNCx0L7Ri9GCINGBIHNxbGl0ZVxyXG52YXIgU3FsaXRlID0gcmVxdWlyZSggXCJuYXRpdmVzY3JpcHQtc3FsaXRlXCIgKSxcclxub1dlYlZpZXdJbnRlcmZhY2U7XHJcblxyXG4vL9C80L7QtNGD0LvRjCDQtNC70Y8g0YDQsNCx0L7RgtGLINGBINC+0LrQvdCw0LzQuFxyXG5jb25zdCBjcmVhdGVWaWV3TW9kZWwgPSByZXF1aXJlKFwiLi9tYWluLXZpZXctbW9kZWxcIikuY3JlYXRlVmlld01vZGVsLFxyXG4gICAgLy/QsdC40LvQuNCx0LvQuNC+0LXQutCwINC00LvRjyDQvtCx0LzQtdC90LAg0LTQsNC90YvQvNC4INC80LXQttC00YMg0L/RgNC+0LPRgNCw0LzQvNC+0Lkg0LggV2ViVmlld1xyXG4gICAgd2ViVmlld0ludGVyZmFjZU1vZHVsZSA9IHJlcXVpcmUoJ25hdGl2ZXNjcmlwdC13ZWJ2aWV3LWludGVyZmFjZScpLFxyXG4gICAgLy/QvNC+0LTQu9GD0Ywg0LTQu9GPINGA0LDQsdC+0YLRiyDRgdC+INGB0YfQuNGC0YvQstCw0YLQtdC70LXQvFxyXG4gICAgVUhGID0gcmVxdWlyZSgnLi9jb21tb24vVUhGJylcclxuXHJcbi8qKiAg0J7RgtC60YDRi9GC0LjQtSDQvtC60L3QsFxyXG4gKiBAZnVuY3Rpb24gb25OYXZpZ2F0aW5nVG9cclxuICogQHBhcmFtIHtPYmplY3R9IGFyZ3Mg0J/QsNGA0LDQvNC10YLRgNGLICBcclxuICogQG1lbWJlcm9mIG1haW4tcGFnZVxyXG4gKi8gXHJcbnZhciBvbk5hdmlnYXRpbmdUbyA9IGFyZ3MgPT4ge1xyXG4gICAgLy/Qv9C+0LvRg9GH0LDQtdC8INC/0YDQsNC80LXRgtGA0Ysg0YHRgtGA0LDQvdC40YbRi1xyXG4gICAgY29uc3QgcGFnZSA9IGFyZ3Mub2JqZWN0O1xyXG4gICAgLy/RgdC+0LfQtNCw0LXQvCDQvtC60L3QvlxyXG4gICAgcGFnZS5iaW5kaW5nQ29udGV4dCA9IGNyZWF0ZVZpZXdNb2RlbCgpOyAgXHJcbn0gXHJcbiAgXHJcbi8qKiBcclxuICog0JLRi9C/0L7Qu9C90LXQvdC40LUg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0LTQvtC60YPQvNC10L3RgtCwICAgXHJcbiAqIEBmdW5jdGlvbiBwYWdlTG9hZGVkICAgXHJcbiAqIEBwYXJtcyB7T2JqZWN0fSBhcmdzINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKiBAbWVtYmVyb2YgbWFpbi1wYWdlICAgIFxyXG4gKi9cclxudmFyIHBhZ2VMb2FkZWQgPSBhcmdzID0+IHsgXHJcbiAgICAvL9C/0L7Qu9GD0YfQtdC90LjQtSDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQvtC60L3QsFxyXG4gICAgcGFnZSA9IGFyZ3Mub2JqZWN0O1xyXG4gICAgLy/Rg9GB0YLQsNC90L7QstC60LAg0L/QsNGA0LDQvNC10YLRgNC+0LIg0LTQu9GPINC+0LHQvNC10L3QsCDQtNCw0L3QvdGL0LzQuCDRgSBXZWJWaWV3IFxyXG4gICAgc2V0dXBXZWJWaWV3SW50ZXJmYWNlKHBhZ2UpXHJcbn1cclxuXHJcbi8qKiBcclxuICog0JjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y8g0YHQstGP0LfQuCDQvNC10LbQtNGDINC/0YDQuNC70L7QttC10L3QuNC10Lwg0LggV2ViVmlld1xyXG4gKiBAZnVuY3Rpb24gc2V0dXBXZWJWaWV3SW50ZXJmYWNlXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSDQntC60L3QviDQv9GA0LjQstGP0LfQutC4XHJcbiAqIEBtZW1iZXJvZiBtYWluLXBhZ2VcclxuICovXHJcbnZhciBzZXR1cFdlYlZpZXdJbnRlcmZhY2UgPSBhc3luYyBwYWdlID0+IHtcclxuICAgIC8v0L/QvtC70YPRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LBcclxuICAgIHZhciB3ZWJWaWV3ID0gcGFnZS5nZXRWaWV3QnlJZCgnd2ViVmlldycpO1xyXG4gICAgLy/Rg9GB0YLQsNC90L7QstC60LAg0YHQvtC10LTQuNC00LXQvdC40Y9cclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlID0gYXdhaXQgbmV3IHdlYlZpZXdJbnRlcmZhY2VNb2R1bGUuV2ViVmlld0ludGVyZmFjZSh3ZWJWaWV3LCAnZmlsZTovLy9zdG9yYWdlL2VtdWxhdGVkLzAvTWFwTWluZS9zcmMvaW5kZXguaHRtbCcpO1xyXG4gICAgZ2V0QWxsTGFiZWwoKVxyXG59XHJcblxyXG5VSEYuZ2V0QXJyKCkudGhlbihsaXN0ID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwiVENMOiBvbkZpbmRVSEYgLT4gbGlzdFwiLCBsaXN0KVxyXG4gICAgLy/QvtGC0L/RgNCw0LLQuNGC0Ywg0LTQsNC90L3Ri9C1INCyIFdlYlZJRVdcclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlLmVtaXQoJ2xpc3RVSEYnLCBsaXN0KVxyXG59KVxyXG5cclxubmV3IFNxbGl0ZShcImxhYmVscy5kYlwiLCBmdW5jdGlvbihlcnIsIGRiKSB7XHJcbiAgZGIuZ2V0KCdTRUxFQ1QgKiBGUk9NIEFsbExhYmxlcycpXHJcbn0pO1xyXG5cclxudmFyIGdldEFsbExhYmVsID0gKCkgPT4ge1xyXG4gIG9XZWJWaWV3SW50ZXJmYWNlLm9uKCdnZXRBbGxMYWJlbCcsICgpID0+IHtcclxuXHJcblxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cclxuXHJcbi8qICAqL1xyXG5leHBvcnRzLm9uTmF2aWdhdGluZ1RvID0gb25OYXZpZ2F0aW5nVG87XHJcbmV4cG9ydHMucGFnZUxvYWRlZCA9IHBhZ2VMb2FkZWQ7XHJcbjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9tYWluLXBhZ2UuanNcIikgKSB7XG4gICAgXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBtb2R1bGUuaG90LmRpc3Bvc2UoKCkgPT4ge1xuICAgICAgICBnbG9iYWwuaG1yUmVmcmVzaCh7IHR5cGU6IFwic2NyaXB0XCIsIHBhdGg6IFwiLi9tYWluLXBhZ2UuanNcIiB9KTtcbiAgICB9KTtcbn0gIl0sInNvdXJjZVJvb3QiOiIifQ==