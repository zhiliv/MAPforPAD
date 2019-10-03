/**
 * Модуль для работы с окном
 * @member main-page
 */

var oWebViewInterface;

//модуль для работы с окнами
const createViewModel = require('./main-view-model').createViewModel,
  //билиблиоека для обмена даными между программой и WebView
  webViewInterfaceModule = require('nativescript-webview-interface'),
  //модлуь для работы со считывателем
  UHF = require('./common/UHF'),
  db = require('./common/db'),
  q = require('q'),
  async = require('async');

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
};

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
  setupWebViewInterface(page);
};

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
  oWebViewInterface = await new webViewInterfaceModule.WebViewInterface(
    webView,
    'file:///storage/emulated/0/MapMine/src/index.html'
  );
  onGetAllLabel();
};

UHF.getArr().then(list => {
  console.log('TCL: onFindUHF -> list', list);
  //отправить данные в WebVIEW
  oWebViewInterface.emit('listUHF', list);
});

/**
 * Получение всех меток
 */
var getAllLabel = () => {
  let defer = q.defer();
  var promise = db.all('SELECT * FROM AllLabels');
  promise.then(res => {
    defer.resolve(res);
  });
  return defer.promise;
};

var onGetAllLabel = () => {
  oWebViewInterface.on('getAllLabel', () => {
    getAllLabel().then(async list => {
      let arr = [];
      await async.eachOfSeries(list, async (row, ind) => {
        let obj = {
          id: row[0],
          SRN: row[1],
          lat: row[2],
          lon: row[3]
        };
        arr.push(obj);
      });
      oWebViewInterface.emit('resultAllLabel', arr);
    });
  });
};

exports.onNavigatingTo = onNavigatingTo; 
exports.pageLoaded = pageLoaded;
