webpackHotUpdate("bundle",{

/***/ "./main-page.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Модуль для работы с окном
 * @module main-page
 */

var oWebViewInterface;

//модуль для работы с окнами
const createViewModel = __webpack_require__("./main-view-model.js").createViewModel,
    //билиблиоека для обмена даными между программой и WebView
    webViewInterfaceModule = __webpack_require__("../node_modules/nativescript-webview-interface/index.js"),
    //модлуь для работы со считывателем
    UHF = __webpack_require__("./common/UHF.js"),
    db = __webpack_require__("./common/db.js"),
    q = __webpack_require__("../node_modules/q/q.js"),
    async = __webpack_require__("../node_modules/async/dist/async.mjs");

/**  Открытие окна
 * @function onNavigatingTo
 * @param {Object} args Параметры
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
    onScanLabel();
    onNewNewLabel();
    onDeleteLabel();
    onInventoryLabel();
    sendSettingDB();
    saveSetting();
    getDataToServer()
};



/**
 * Получение данных с сервера
 * @function getDataToServer
  */
 var getDataToServer =   () => {
   oWebViewInterface.on('getDataToServer',async () => {
    var promise = db.all(`SELECT * FROM setting`);
    //выполнение запроса
    await promise.then(async res => {
    let config = await {
      host: res[0][1],
      user: res[0][2],
      port: res[0][3],
      password: res[0][4],
      database: res[0][5]
    }
    console.log("TCL: getDataToServer -> config", config)
     const mysql = await  __webpack_require__("../node_modules/mysql2/index.js")
     var DB =await mysql.createPool(config)
    await DB.connect()
       DB.query('SELECT * FROM AllLabel', (err, rows) => {
      console.log("TCL: getDataToServer -> rows", rows.length)
        
      })  
   })
 })
}

/**
 * Сохранение настроек
 * @function saveSetting
 */
var saveSetting = () => {
    oWebViewInterface.on('saveSetting', async obj => {
      await db.execSQL('DELETE FROM setting')
      await db.execSQL(
        `INSERT INTO setting (host, user, port, password, database) VALUES ('${obj.host}', '${obj.user}', '${obj.port}', '${obj.password}', '${obj.database}')`,
        (err, id) => {
            oWebViewInterface.emit('resultSaveSetting');
        }
    );
    });
};

/**
 * Отправка настроек БД
 * @function sendSettingDB
 */
var sendSettingDB = () => {
    oWebViewInterface.on('getSettingDB', async () => {
      //формирование запроса для проверки наличия метки в БД
      var promise = db.all(`SELECT * FROM setting`);
      //выполнение запроса
      promise.then(res => {
      let obj = {
        host: res[0][1],
        user: res[0][2],
        port: res[0][3],
        password: res[0][4],
        database: res[0][5]
      }
        oWebViewInterface.emit('resultGetSettingDB', obj);
      })
    });
};

/**
 * Получение меток со сканера
 * @function onScanLabel
 */
var onScanLabel = () => {
    //прослушиваение события для получения данных со считывателя
    oWebViewInterface.on('getUHF', () => {
        //получение данных со считывателя
        UHF.getArr().then(list => {
            //отправить данные в WebVIEW
            oWebViewInterface.emit('resultUHF', list);
        });
    });
};

/**
 * Получение меток со сканера
 * @function onScanLabel
 */
var onInventoryLabel = () => {
    //прослушиваение события для получения данных со считывателя
    oWebViewInterface.on('getUHFInventory', () => {
        //получение данных со считывателя
        UHF.getArr().then(list => {
            //отправить данные в WebVIEW
            oWebViewInterface.emit('resultUHFInventory', list);
        });
    });
};

/**
 * Получение всех меток
 * @function getAllLabel
 */
var getAllLabel = () => {
    //создание переменной для ожидания
    let defer = q.defer();
    //создание promise
    var promise = db.all('SELECT * FROM AllLabels');
    //выполнение promise
    promise.then(res => {
        //добавление результата в ожидание
        defer.resolve(res);
    });
    //возврат результата ожидания
    return defer.promise;
};

/**
 * Прослушивание события для добавления метики
 * @function onNewNewLabel
 * */
var onNewNewLabel = () => {
    //прослушивание события для получения новой метки
    oWebViewInterface.on('sendDataNewLabel', async data => {
        //переменная для хранения результата
        let result = { data: null, err: null };
        //формирование запроса для проверки наличия метки в БД
        var promise = db.all(`SELECT * FROM AllLabels WHERE SRN="${data.SRN}"`);
        //выполнение запроса
        await promise.then(res => {
            //проверка длины списка
            if (res.length > 0) {
                //добалвение ошибки в результативный объект
                result.err = 'Произошла ошибка: Такая метка уже существует';
            } else {
                //выполнение запроса на добалвение
                db.execSQL(
                    `INSERT INTO AllLabels (SRN, lat, lon) VALUES ('${data.SRN}', '${data.lat}', '${data.lon}')`,
                    (err, id) => {
                        result.err = err;
                        //добавление результата в результатный обхект
                        result.data = 'Успех: Метка успешно добавлена';
                    }
                );
            }
        });
        //отправлка события о результате добалвения
        oWebViewInterface.emit('resultSendDataNewLabel', result);
    });
};

/**
 * Обработка получения запроса на получение всех меток
 * @function onGetAllLabel
 */
var onGetAllLabel = () => {
    //прослушиваение события для получения всех меток
    oWebViewInterface.on('getAllLabel', () => {
        //выполение функции для получения всех меток из БД
        getAllLabel().then(async list => {
            //массив для хранения результата
            let arr = [];
            //обход значений результата  для формирования нового массива с объектами
            await async.eachOfSeries(list, async (row, ind) => {
                //создание нового объекта
                let obj = {
                    //идентификатор
                    id: row[0],
                    //номер метки
                    SRN: row[1],
                    //координаты широты
                    lat: row[2],
                    //координаты долготы
                    lon: row[3]
                };
                //добавление объекта в массив
                arr.push(obj);
            });
            //отправка полученниго массива по интерфейсу WebView
            oWebViewInterface.emit('resultAllLabel', arr);
        });
    });
};

var onDeleteLabel = () => {
    oWebViewInterface.on('DeleteSelectLabel', async SRN => {
        let result = { err: null, data: null };
        //выполнение запроса на добалвение
        console.log(`DELETE FROM AllLabels WHERE SRN='${SRN}`);
        db.execSQL(`DELETE FROM AllLabels WHERE SRN='${SRN}'`, (err, id) => {
            result.err = err;
            //добавление результата в результатный обхект
            result.data = 'Успех: Метка успешно удалена';
            oWebViewInterface.emit('resultDeleteSelectLabel', result);
        });
    });
};

//установка экпортных функций
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9tYWluLXBhZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLHdCQUF3QixtQkFBTyxDQUFDLHNCQUFtQjtBQUNuRDtBQUNBLDZCQUE2QixtQkFBTyxDQUFDLHlEQUFnQztBQUNyRTtBQUNBLFVBQVUsbUJBQU8sQ0FBQyxpQkFBYztBQUNoQyxTQUFTLG1CQUFPLENBQUMsZ0JBQWE7QUFDOUIsUUFBUSxtQkFBTyxDQUFDLHdCQUFHO0FBQ25CLFlBQVksbUJBQU8sQ0FBQyxzQ0FBTzs7QUFFM0I7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsbUJBQU8sQ0FBQyxpQ0FBUTtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxPQUFPO0FBQ1AsSUFBSTtBQUNKLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFLFNBQVMsTUFBTSxTQUFTLE1BQU0sU0FBUyxNQUFNLGFBQWEsTUFBTSxhQUFhO0FBQzVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxtRUFBbUUsU0FBUztBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLHNFQUFzRSxTQUFTLE1BQU0sU0FBUyxNQUFNLFNBQVM7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSx3REFBd0QsSUFBSTtBQUM1RCx1REFBdUQsSUFBSTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQztBQUNBLElBQUksS0FBVTs7QUFFZDtBQUNBO0FBQ0EsMkJBQTJCLHlDQUF5QztBQUNwRSxLQUFLO0FBQ0wsQyIsImZpbGUiOiJidW5kbGUuNTVlZDI5MTAzMWIxOGExMDA3ZTYuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDQnNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQvtC60L3QvtC8XHJcbiAqIEBtb2R1bGUgbWFpbi1wYWdlXHJcbiAqL1xyXG5cclxudmFyIG9XZWJWaWV3SW50ZXJmYWNlO1xyXG5cclxuLy/QvNC+0LTRg9C70Ywg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQvtC60L3QsNC80LhcclxuY29uc3QgY3JlYXRlVmlld01vZGVsID0gcmVxdWlyZSgnLi9tYWluLXZpZXctbW9kZWwnKS5jcmVhdGVWaWV3TW9kZWwsXHJcbiAgICAvL9Cx0LjQu9C40LHQu9C40L7QtdC60LAg0LTQu9GPINC+0LHQvNC10L3QsCDQtNCw0L3Ri9C80Lgg0LzQtdC20LTRgyDQv9GA0L7Qs9GA0LDQvNC80L7QuSDQuCBXZWJWaWV3XHJcbiAgICB3ZWJWaWV3SW50ZXJmYWNlTW9kdWxlID0gcmVxdWlyZSgnbmF0aXZlc2NyaXB0LXdlYnZpZXctaW50ZXJmYWNlJyksXHJcbiAgICAvL9C80L7QtNC70YPRjCDQtNC70Y8g0YDQsNCx0L7RgtGLINGB0L4g0YHRh9C40YLRi9Cy0LDRgtC10LvQtdC8XHJcbiAgICBVSEYgPSByZXF1aXJlKCcuL2NvbW1vbi9VSEYnKSxcclxuICAgIGRiID0gcmVxdWlyZSgnLi9jb21tb24vZGInKSxcclxuICAgIHEgPSByZXF1aXJlKCdxJyksXHJcbiAgICBhc3luYyA9IHJlcXVpcmUoJ2FzeW5jJyk7XHJcblxyXG4vKiogINCe0YLQutGA0YvRgtC40LUg0L7QutC90LBcclxuICogQGZ1bmN0aW9uIG9uTmF2aWdhdGluZ1RvXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmdzINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKi9cclxudmFyIG9uTmF2aWdhdGluZ1RvID0gYXJncyA9PiB7XHJcbiAgICAvL9C/0L7Qu9GD0YfQsNC10Lwg0L/RgNCw0LzQtdGC0YDRiyDRgdGC0YDQsNC90LjRhtGLXHJcbiAgICBjb25zdCBwYWdlID0gYXJncy5vYmplY3Q7XHJcbiAgICAvL9GB0L7Qt9C00LDQtdC8INC+0LrQvdC+XHJcbiAgICBwYWdlLmJpbmRpbmdDb250ZXh0ID0gY3JlYXRlVmlld01vZGVsKCk7XHJcbn07XHJcblxyXG4vKipcclxuICog0JLRi9C/0L7Qu9C90LXQvdC40LUg0L/RgNC4INC30LDQs9GA0YPQt9C60LUg0LTQvtC60YPQvNC10L3RgtCwXHJcbiAqIEBmdW5jdGlvbiBwYWdlTG9hZGVkXHJcbiAqIEBwYXJtcyB7T2JqZWN0fSBhcmdzINCf0LDRgNCw0LzQtdGC0YDRi1xyXG4gKi9cclxudmFyIHBhZ2VMb2FkZWQgPSBhcmdzID0+IHtcclxuICAgIC8v0L/QvtC70YPRh9C10L3QuNC1INC/0LDRgNCw0LzQtdGC0YDQvtCyINC+0LrQvdCwXHJcbiAgICBwYWdlID0gYXJncy5vYmplY3Q7XHJcbiAgICAvL9GD0YHRgtCw0L3QvtCy0LrQsCDQv9Cw0YDQsNC80LXRgtGA0L7QsiDQtNC70Y8g0L7QsdC80LXQvdCwINC00LDQvdC90YvQvNC4INGBIFdlYlZpZXdcclxuICAgIHNldHVwV2ViVmlld0ludGVyZmFjZShwYWdlKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiDQmNC90LjRhtC40LDQu9C40LfQsNGG0LjRjyDRgdCy0Y/Qt9C4INC80LXQttC00YMg0L/RgNC40LvQvtC20LXQvdC40LXQvCDQuCBXZWJWaWV3XHJcbiAqIEBmdW5jdGlvbiBzZXR1cFdlYlZpZXdJbnRlcmZhY2VcclxuICogQHBhcmFtIHtPYmplY3R9INCe0LrQvdC+INC/0YDQuNCy0Y/Qt9C60LhcclxuICovXHJcbnZhciBzZXR1cFdlYlZpZXdJbnRlcmZhY2UgPSBhc3luYyBwYWdlID0+IHtcclxuICAgIC8v0L/QvtC70YPRh9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LBcclxuICAgIHZhciB3ZWJWaWV3ID0gcGFnZS5nZXRWaWV3QnlJZCgnd2ViVmlldycpO1xyXG4gICAgLy/Rg9GB0YLQsNC90L7QstC60LAg0YHQvtC10LTQuNC00LXQvdC40Y9cclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlID0gYXdhaXQgbmV3IHdlYlZpZXdJbnRlcmZhY2VNb2R1bGUuV2ViVmlld0ludGVyZmFjZShcclxuICAgICAgICB3ZWJWaWV3LFxyXG4gICAgICAgICdmaWxlOi8vL3N0b3JhZ2UvZW11bGF0ZWQvMC9NYXBNaW5lL3NyYy9pbmRleC5odG1sJ1xyXG4gICAgKTtcclxuICAgIG9uR2V0QWxsTGFiZWwoKTtcclxuICAgIG9uU2NhbkxhYmVsKCk7XHJcbiAgICBvbk5ld05ld0xhYmVsKCk7XHJcbiAgICBvbkRlbGV0ZUxhYmVsKCk7XHJcbiAgICBvbkludmVudG9yeUxhYmVsKCk7XHJcbiAgICBzZW5kU2V0dGluZ0RCKCk7XHJcbiAgICBzYXZlU2V0dGluZygpO1xyXG4gICAgZ2V0RGF0YVRvU2VydmVyKClcclxufTtcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqINCf0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YUg0YEg0YHQtdGA0LLQtdGA0LBcclxuICogQGZ1bmN0aW9uIGdldERhdGFUb1NlcnZlclxyXG4gICovXHJcbiB2YXIgZ2V0RGF0YVRvU2VydmVyID0gICAoKSA9PiB7XHJcbiAgIG9XZWJWaWV3SW50ZXJmYWNlLm9uKCdnZXREYXRhVG9TZXJ2ZXInLGFzeW5jICgpID0+IHtcclxuICAgIHZhciBwcm9taXNlID0gZGIuYWxsKGBTRUxFQ1QgKiBGUk9NIHNldHRpbmdgKTtcclxuICAgIC8v0LLRi9C/0L7Qu9C90LXQvdC40LUg0LfQsNC/0YDQvtGB0LBcclxuICAgIGF3YWl0IHByb21pc2UudGhlbihhc3luYyByZXMgPT4ge1xyXG4gICAgbGV0IGNvbmZpZyA9IGF3YWl0IHtcclxuICAgICAgaG9zdDogcmVzWzBdWzFdLFxyXG4gICAgICB1c2VyOiByZXNbMF1bMl0sXHJcbiAgICAgIHBvcnQ6IHJlc1swXVszXSxcclxuICAgICAgcGFzc3dvcmQ6IHJlc1swXVs0XSxcclxuICAgICAgZGF0YWJhc2U6IHJlc1swXVs1XVxyXG4gICAgfVxyXG4gICAgY29uc29sZS5sb2coXCJUQ0w6IGdldERhdGFUb1NlcnZlciAtPiBjb25maWdcIiwgY29uZmlnKVxyXG4gICAgIGNvbnN0IG15c3FsID0gYXdhaXQgIHJlcXVpcmUoJ215c3FsMicpXHJcbiAgICAgdmFyIERCID1hd2FpdCBteXNxbC5jcmVhdGVQb29sKGNvbmZpZylcclxuICAgIGF3YWl0IERCLmNvbm5lY3QoKVxyXG4gICAgICAgREIucXVlcnkoJ1NFTEVDVCAqIEZST00gQWxsTGFiZWwnLCAoZXJyLCByb3dzKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiVENMOiBnZXREYXRhVG9TZXJ2ZXIgLT4gcm93c1wiLCByb3dzLmxlbmd0aClcclxuICAgICAgICBcclxuICAgICAgfSkgIFxyXG4gICB9KVxyXG4gfSlcclxufVxyXG5cclxuLyoqXHJcbiAqINCh0L7RhdGA0LDQvdC10L3QuNC1INC90LDRgdGC0YDQvtC10LpcclxuICogQGZ1bmN0aW9uIHNhdmVTZXR0aW5nXHJcbiAqL1xyXG52YXIgc2F2ZVNldHRpbmcgPSAoKSA9PiB7XHJcbiAgICBvV2ViVmlld0ludGVyZmFjZS5vbignc2F2ZVNldHRpbmcnLCBhc3luYyBvYmogPT4ge1xyXG4gICAgICBhd2FpdCBkYi5leGVjU1FMKCdERUxFVEUgRlJPTSBzZXR0aW5nJylcclxuICAgICAgYXdhaXQgZGIuZXhlY1NRTChcclxuICAgICAgICBgSU5TRVJUIElOVE8gc2V0dGluZyAoaG9zdCwgdXNlciwgcG9ydCwgcGFzc3dvcmQsIGRhdGFiYXNlKSBWQUxVRVMgKCcke29iai5ob3N0fScsICcke29iai51c2VyfScsICcke29iai5wb3J0fScsICcke29iai5wYXNzd29yZH0nLCAnJHtvYmouZGF0YWJhc2V9JylgLFxyXG4gICAgICAgIChlcnIsIGlkKSA9PiB7XHJcbiAgICAgICAgICAgIG9XZWJWaWV3SW50ZXJmYWNlLmVtaXQoJ3Jlc3VsdFNhdmVTZXR0aW5nJyk7XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqINCe0YLQv9GA0LDQstC60LAg0L3QsNGB0YLRgNC+0LXQuiDQkdCUXHJcbiAqIEBmdW5jdGlvbiBzZW5kU2V0dGluZ0RCXHJcbiAqL1xyXG52YXIgc2VuZFNldHRpbmdEQiA9ICgpID0+IHtcclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlLm9uKCdnZXRTZXR0aW5nREInLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgIC8v0YTQvtGA0LzQuNGA0L7QstCw0L3QuNC1INC30LDQv9GA0L7RgdCwINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LDQu9C40YfQuNGPINC80LXRgtC60Lgg0LIg0JHQlFxyXG4gICAgICB2YXIgcHJvbWlzZSA9IGRiLmFsbChgU0VMRUNUICogRlJPTSBzZXR0aW5nYCk7XHJcbiAgICAgIC8v0LLRi9C/0L7Qu9C90LXQvdC40LUg0LfQsNC/0YDQvtGB0LBcclxuICAgICAgcHJvbWlzZS50aGVuKHJlcyA9PiB7XHJcbiAgICAgIGxldCBvYmogPSB7XHJcbiAgICAgICAgaG9zdDogcmVzWzBdWzFdLFxyXG4gICAgICAgIHVzZXI6IHJlc1swXVsyXSxcclxuICAgICAgICBwb3J0OiByZXNbMF1bM10sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlc1swXVs0XSxcclxuICAgICAgICBkYXRhYmFzZTogcmVzWzBdWzVdXHJcbiAgICAgIH1cclxuICAgICAgICBvV2ViVmlld0ludGVyZmFjZS5lbWl0KCdyZXN1bHRHZXRTZXR0aW5nREInLCBvYmopO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICog0J/QvtC70YPRh9C10L3QuNC1INC80LXRgtC+0Log0YHQviDRgdC60LDQvdC10YDQsFxyXG4gKiBAZnVuY3Rpb24gb25TY2FuTGFiZWxcclxuICovXHJcbnZhciBvblNjYW5MYWJlbCA9ICgpID0+IHtcclxuICAgIC8v0L/RgNC+0YHQu9GD0YjQuNCy0LDQtdC90LjQtSDRgdC+0LHRi9GC0LjRjyDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgdC+INGB0YfQuNGC0YvQstCw0YLQtdC70Y9cclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlLm9uKCdnZXRVSEYnLCAoKSA9PiB7XHJcbiAgICAgICAgLy/Qv9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFINGB0L4g0YHRh9C40YLRi9Cy0LDRgtC10LvRj1xyXG4gICAgICAgIFVIRi5nZXRBcnIoKS50aGVuKGxpc3QgPT4ge1xyXG4gICAgICAgICAgICAvL9C+0YLQv9GA0LDQstC40YLRjCDQtNCw0L3QvdGL0LUg0LIgV2ViVklFV1xyXG4gICAgICAgICAgICBvV2ViVmlld0ludGVyZmFjZS5lbWl0KCdyZXN1bHRVSEYnLCBsaXN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqINCf0L7Qu9GD0YfQtdC90LjQtSDQvNC10YLQvtC6INGB0L4g0YHQutCw0L3QtdGA0LBcclxuICogQGZ1bmN0aW9uIG9uU2NhbkxhYmVsXHJcbiAqL1xyXG52YXIgb25JbnZlbnRvcnlMYWJlbCA9ICgpID0+IHtcclxuICAgIC8v0L/RgNC+0YHQu9GD0YjQuNCy0LDQtdC90LjQtSDRgdC+0LHRi9GC0LjRjyDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC00LDQvdC90YvRhSDRgdC+INGB0YfQuNGC0YvQstCw0YLQtdC70Y9cclxuICAgIG9XZWJWaWV3SW50ZXJmYWNlLm9uKCdnZXRVSEZJbnZlbnRvcnknLCAoKSA9PiB7XHJcbiAgICAgICAgLy/Qv9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFINGB0L4g0YHRh9C40YLRi9Cy0LDRgtC10LvRj1xyXG4gICAgICAgIFVIRi5nZXRBcnIoKS50aGVuKGxpc3QgPT4ge1xyXG4gICAgICAgICAgICAvL9C+0YLQv9GA0LDQstC40YLRjCDQtNCw0L3QvdGL0LUg0LIgV2ViVklFV1xyXG4gICAgICAgICAgICBvV2ViVmlld0ludGVyZmFjZS5lbWl0KCdyZXN1bHRVSEZJbnZlbnRvcnknLCBsaXN0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqINCf0L7Qu9GD0YfQtdC90LjQtSDQstGB0LXRhSDQvNC10YLQvtC6XHJcbiAqIEBmdW5jdGlvbiBnZXRBbGxMYWJlbFxyXG4gKi9cclxudmFyIGdldEFsbExhYmVsID0gKCkgPT4ge1xyXG4gICAgLy/RgdC+0LfQtNCw0L3QuNC1INC/0LXRgNC10LzQtdC90L3QvtC5INC00LvRjyDQvtC20LjQtNCw0L3QuNGPXHJcbiAgICBsZXQgZGVmZXIgPSBxLmRlZmVyKCk7XHJcbiAgICAvL9GB0L7Qt9C00LDQvdC40LUgcHJvbWlzZVxyXG4gICAgdmFyIHByb21pc2UgPSBkYi5hbGwoJ1NFTEVDVCAqIEZST00gQWxsTGFiZWxzJyk7XHJcbiAgICAvL9Cy0YvQv9C+0LvQvdC10L3QuNC1IHByb21pc2VcclxuICAgIHByb21pc2UudGhlbihyZXMgPT4ge1xyXG4gICAgICAgIC8v0LTQvtCx0LDQstC70LXQvdC40LUg0YDQtdC30YPQu9GM0YLQsNGC0LAg0LIg0L7QttC40LTQsNC90LjQtVxyXG4gICAgICAgIGRlZmVyLnJlc29sdmUocmVzKTtcclxuICAgIH0pO1xyXG4gICAgLy/QstC+0LfQstGA0LDRgiDRgNC10LfRg9C70YzRgtCw0YLQsCDQvtC20LjQtNCw0L3QuNGPXHJcbiAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiDQn9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRjyDQtNC70Y8g0LTQvtCx0LDQstC70LXQvdC40Y8g0LzQtdGC0LjQutC4XHJcbiAqIEBmdW5jdGlvbiBvbk5ld05ld0xhYmVsXHJcbiAqICovXHJcbnZhciBvbk5ld05ld0xhYmVsID0gKCkgPT4ge1xyXG4gICAgLy/Qv9GA0L7RgdC70YPRiNC40LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRjyDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPINC90L7QstC+0Lkg0LzQtdGC0LrQuFxyXG4gICAgb1dlYlZpZXdJbnRlcmZhY2Uub24oJ3NlbmREYXRhTmV3TGFiZWwnLCBhc3luYyBkYXRhID0+IHtcclxuICAgICAgICAvL9C/0LXRgNC10LzQtdC90L3QsNGPINC00LvRjyDRhdGA0LDQvdC10L3QuNGPINGA0LXQt9GD0LvRjNGC0LDRgtCwXHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IHsgZGF0YTogbnVsbCwgZXJyOiBudWxsIH07XHJcbiAgICAgICAgLy/RhNC+0YDQvNC40YDQvtCy0LDQvdC40LUg0LfQsNC/0YDQvtGB0LAg0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0LzQtdGC0LrQuCDQsiDQkdCUXHJcbiAgICAgICAgdmFyIHByb21pc2UgPSBkYi5hbGwoYFNFTEVDVCAqIEZST00gQWxsTGFiZWxzIFdIRVJFIFNSTj1cIiR7ZGF0YS5TUk59XCJgKTtcclxuICAgICAgICAvL9Cy0YvQv9C+0LvQvdC10L3QuNC1INC30LDQv9GA0L7RgdCwXHJcbiAgICAgICAgYXdhaXQgcHJvbWlzZS50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIC8v0L/RgNC+0LLQtdGA0LrQsCDQtNC70LjQvdGLINGB0L/QuNGB0LrQsFxyXG4gICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIC8v0LTQvtCx0LDQu9Cy0LXQvdC40LUg0L7RiNC40LHQutC4INCyINGA0LXQt9GD0LvRjNGC0LDRgtC40LLQvdGL0Lkg0L7QsdGK0LXQutGCXHJcbiAgICAgICAgICAgICAgICByZXN1bHQuZXJyID0gJ9Cf0YDQvtC40LfQvtGI0LvQsCDQvtGI0LjQsdC60LA6INCi0LDQutCw0Y8g0LzQtdGC0LrQsCDRg9C20LUg0YHRg9GJ0LXRgdGC0LLRg9C10YInO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy/QstGL0L/QvtC70L3QtdC90LjQtSDQt9Cw0L/RgNC+0YHQsCDQvdCwINC00L7QsdCw0LvQstC10L3QuNC1XHJcbiAgICAgICAgICAgICAgICBkYi5leGVjU1FMKFxyXG4gICAgICAgICAgICAgICAgICAgIGBJTlNFUlQgSU5UTyBBbGxMYWJlbHMgKFNSTiwgbGF0LCBsb24pIFZBTFVFUyAoJyR7ZGF0YS5TUk59JywgJyR7ZGF0YS5sYXR9JywgJyR7ZGF0YS5sb259JylgLFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnIsIGlkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5lcnIgPSBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v0LTQvtCx0LDQstC70LXQvdC40LUg0YDQtdC30YPQu9GM0YLQsNGC0LAg0LIg0YDQtdC30YPQu9GM0YLQsNGC0L3Ri9C5INC+0LHRhdC10LrRglxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQuZGF0YSA9ICfQo9GB0L/QtdGFOiDQnNC10YLQutCwINGD0YHQv9C10YjQvdC+INC00L7QsdCw0LLQu9C10L3QsCc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8v0L7RgtC/0YDQsNCy0LvQutCwINGB0L7QsdGL0YLQuNGPINC+INGA0LXQt9GD0LvRjNGC0LDRgtC1INC00L7QsdCw0LvQstC10L3QuNGPXHJcbiAgICAgICAgb1dlYlZpZXdJbnRlcmZhY2UuZW1pdCgncmVzdWx0U2VuZERhdGFOZXdMYWJlbCcsIHJlc3VsdCk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiDQntCx0YDQsNCx0L7RgtC60LAg0L/QvtC70YPRh9C10L3QuNGPINC30LDQv9GA0L7RgdCwINC90LAg0L/QvtC70YPRh9C10L3QuNC1INCy0YHQtdGFINC80LXRgtC+0LpcclxuICogQGZ1bmN0aW9uIG9uR2V0QWxsTGFiZWxcclxuICovXHJcbnZhciBvbkdldEFsbExhYmVsID0gKCkgPT4ge1xyXG4gICAgLy/Qv9GA0L7RgdC70YPRiNC40LLQsNC10L3QuNC1INGB0L7QsdGL0YLQuNGPINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LLRgdC10YUg0LzQtdGC0L7QulxyXG4gICAgb1dlYlZpZXdJbnRlcmZhY2Uub24oJ2dldEFsbExhYmVsJywgKCkgPT4ge1xyXG4gICAgICAgIC8v0LLRi9C/0L7Qu9C10L3QuNC1INGE0YPQvdC60YbQuNC4INC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LLRgdC10YUg0LzQtdGC0L7QuiDQuNC3INCR0JRcclxuICAgICAgICBnZXRBbGxMYWJlbCgpLnRoZW4oYXN5bmMgbGlzdCA9PiB7XHJcbiAgICAgICAgICAgIC8v0LzQsNGB0YHQuNCyINC00LvRjyDRhdGA0LDQvdC10L3QuNGPINGA0LXQt9GD0LvRjNGC0LDRgtCwXHJcbiAgICAgICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICAgICAgLy/QvtCx0YXQvtC0INC30L3QsNGH0LXQvdC40Lkg0YDQtdC30YPQu9GM0YLQsNGC0LAgINC00LvRjyDRhNC+0YDQvNC40YDQvtCy0LDQvdC40Y8g0L3QvtCy0L7Qs9C+INC80LDRgdGB0LjQstCwINGBINC+0LHRitC10LrRgtCw0LzQuFxyXG4gICAgICAgICAgICBhd2FpdCBhc3luYy5lYWNoT2ZTZXJpZXMobGlzdCwgYXN5bmMgKHJvdywgaW5kKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvL9GB0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7Qs9C+INC+0LHRitC10LrRgtCwXHJcbiAgICAgICAgICAgICAgICBsZXQgb2JqID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8v0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YBcclxuICAgICAgICAgICAgICAgICAgICBpZDogcm93WzBdLFxyXG4gICAgICAgICAgICAgICAgICAgIC8v0L3QvtC80LXRgCDQvNC10YLQutC4XHJcbiAgICAgICAgICAgICAgICAgICAgU1JOOiByb3dbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy/QutC+0L7RgNC00LjQvdCw0YLRiyDRiNC40YDQvtGC0YtcclxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHJvd1syXSxcclxuICAgICAgICAgICAgICAgICAgICAvL9C60L7QvtGA0LTQuNC90LDRgtGLINC00L7Qu9Cz0L7RgtGLXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uOiByb3dbM11cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAvL9C00L7QsdCw0LLQu9C10L3QuNC1INC+0LHRitC10LrRgtCwINCyINC80LDRgdGB0LjQslxyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8v0L7RgtC/0YDQsNCy0LrQsCDQv9C+0LvRg9GH0LXQvdC90LjQs9C+INC80LDRgdGB0LjQstCwINC/0L4g0LjQvdGC0LXRgNGE0LXQudGB0YMgV2ViVmlld1xyXG4gICAgICAgICAgICBvV2ViVmlld0ludGVyZmFjZS5lbWl0KCdyZXN1bHRBbGxMYWJlbCcsIGFycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcbnZhciBvbkRlbGV0ZUxhYmVsID0gKCkgPT4ge1xyXG4gICAgb1dlYlZpZXdJbnRlcmZhY2Uub24oJ0RlbGV0ZVNlbGVjdExhYmVsJywgYXN5bmMgU1JOID0+IHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0geyBlcnI6IG51bGwsIGRhdGE6IG51bGwgfTtcclxuICAgICAgICAvL9Cy0YvQv9C+0LvQvdC10L3QuNC1INC30LDQv9GA0L7RgdCwINC90LAg0LTQvtCx0LDQu9Cy0LXQvdC40LVcclxuICAgICAgICBjb25zb2xlLmxvZyhgREVMRVRFIEZST00gQWxsTGFiZWxzIFdIRVJFIFNSTj0nJHtTUk59YCk7XHJcbiAgICAgICAgZGIuZXhlY1NRTChgREVMRVRFIEZST00gQWxsTGFiZWxzIFdIRVJFIFNSTj0nJHtTUk59J2AsIChlcnIsIGlkKSA9PiB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnIgPSBlcnI7XHJcbiAgICAgICAgICAgIC8v0LTQvtCx0LDQstC70LXQvdC40LUg0YDQtdC30YPQu9GM0YLQsNGC0LAg0LIg0YDQtdC30YPQu9GM0YLQsNGC0L3Ri9C5INC+0LHRhdC10LrRglxyXG4gICAgICAgICAgICByZXN1bHQuZGF0YSA9ICfQo9GB0L/QtdGFOiDQnNC10YLQutCwINGD0YHQv9C10YjQvdC+INGD0LTQsNC70LXQvdCwJztcclxuICAgICAgICAgICAgb1dlYlZpZXdJbnRlcmZhY2UuZW1pdCgncmVzdWx0RGVsZXRlU2VsZWN0TGFiZWwnLCByZXN1bHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcblxyXG4vL9GD0YHRgtCw0L3QvtCy0LrQsCDRjdC60L/QvtGA0YLQvdGL0YUg0YTRg9C90LrRhtC40LlcclxuZXhwb3J0cy5vbk5hdmlnYXRpbmdUbyA9IG9uTmF2aWdhdGluZ1RvO1xyXG5leHBvcnRzLnBhZ2VMb2FkZWQgPSBwYWdlTG9hZGVkO1xyXG47IFxuaWYgKG1vZHVsZS5ob3QgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJICYmIGdsb2JhbC5faXNNb2R1bGVMb2FkZWRGb3JVSShcIi4vbWFpbi1wYWdlLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vbWFpbi1wYWdlLmpzXCIgfSk7XG4gICAgfSk7XG59ICJdLCJzb3VyY2VSb290IjoiIn0=