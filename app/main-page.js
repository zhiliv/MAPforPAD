/**
 * Модуль для работы с окном
 * @member main-page
 */

//модуль для работы с окнами
const createViewModel = require("./main-view-model").createViewModel,
    //билиблиоека для обмена даными между программой и WebView
    webViewInterfaceModule = require('nativescript-webview-interface'),
    //модлуь для работы со считывателем
    UHF = require('./common/UHF')

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
var setupWebViewInterface = page => {
    //получение элемента
    var webView = page.getViewById('webView');
    //установка соедидения
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, 'file:///storage/emulated/0/MapMine/src/index.html');
}

UHF.getArr().then(list => {
    console.log("TCL: onFindUHF -> list", list)
    //отправить данные в WebVIEW
    oWebViewInterface.emit('listUHF', list)
})

/*  */
exports.onNavigatingTo = onNavigatingTo;
exports.pageLoaded = pageLoaded;
