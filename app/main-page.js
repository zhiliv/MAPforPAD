/**
 * Модуль для работы с окном
 * @module main-page
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
    getDataToServer();
    getSerever();
};

var getSerever = () => {
    oWebViewInterface.on('getSerever', function() {
        var promise = db.all(`SELECT * FROM setting`);
        //выполнение запроса
        promise.then(res => {
            let obj = {
                host: res[0][1],
                user: res[0][2],
                port: res[0][3],
                password: res[0][4],
                database: res[0][5]
            };
            oWebViewInterface.emit('resultGetSerever', obj.host);
        });
    });
};

/**
 * Получение данных с сервера
 * @function getDataToServer
 */
var getDataToServer = () => {
    oWebViewInterface.on('getDataToServer', async () => {
      var promise = db.all(`SELECT * FROM setting`);
      //выполнение запроса
      promise.then(res => {
          let obj = {
              host: res[0][1],
              user: res[0][2],
              port: res[0][3],
              password: res[0][4],
              database: res[0][5]
          };
          });
    });
}

/**
 * Сохранение настроек
 * @function saveSetting
 */
var saveSetting = () => {
    oWebViewInterface.on('saveSetting', async obj => {
        await db.execSQL('DELETE FROM setting');
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
        console.log("TCL: sendSettingDB -> res", res)
            let obj = {
                host: res[0][1],
                user: res[0][2],
                port: res[0][3],
                password: res[0][4],
                database: res[0][5]
            };
            console.log("TCL: sendSettingDB -> obj", obj)
            oWebViewInterface.emit('resultGetSettingDB', obj);
        });
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
