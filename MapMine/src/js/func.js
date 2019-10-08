/**
 * Модуль описания клиентсвого приложения(Web)
 * @module func
 */

//переменная для хранения карты
var map;
//список меток
var listMarker = [];
//последний маркер
var marker;
//обмен с WEbView
var oWebViewInterface = window.nsWebViewInterface;
var coords;
var popup = L.popup();

//при загрузке страницы
$(document).ready(function() {
    //установк высоты карты
    heightBody();
    //загрузка карты в элемент
    LoadlayerMap();
    //обработка нажатия кнопок меню
    clickButtonMenu();
});

/**
 * События при нажитии на кнпки меню
 * @functon clickButton
 */
function clickButtonMenu() {
    $('#newLabel').on('click', function() {
      hideAlert('.alert');
        //отображение модлаьного окна для подтверждения
        $('#confirmation-add-label').modal();
    });
    $('#showAllLabel').on('click', function() {
      hideAlert('.alert');
        //отображение модлаьного окна для подтверждения
        $('#confirmation-show-all-label').modal();
    });
    $('#deleteSelectLabel').on('click', function() {
$('#confirmation-delete-label').modal()
    })
}

function deleteSelectLabel() {
  
}

function applyConfirmationDeleteLabel(){
  hideForm('#confirmation-show-all-label')
  //оистка карты от меток
  clearMapFromLabel();
  //получение всех меток из БД
  getAllLabelForDelete();
}

/**
 * Получение всех меток
 * @function getAllLabel
 */
function getAllLabelForDelete() {
  //отправка события для получения меток
  oWebViewInterface.emit('getAllLabel');
  //прослушивание события для получения всех меток
  oWebViewInterface.on('resultAllLabel', function(res) {
      //добалвение всех меток на карту
      addAllMarkerForDelete(res);
  });
}

/**
* Добавление всех маркеров
* @function addAllMarker
* @param {Array} list Массив со всеми метками из БД
*/
function addAllMarkerForDelete(list) {
  //очищение массива для хранения маркеров
  listMarker = [];
  //проверка длины массива
  if (list.length > 0) {
      //обход всех щначений в цикле
      for (i = 0; i <= list.length - 1; i++) {
          //создание макркера на карте
          createMarkerForDelete(list[i]);
      }
  }
}


/**
 * Создание маркера
 * @function createMarker
 * @param {Object} data Данные о меткер
 */
function createMarkerForDelete(data) {
  //создание нового маркера на карте
  marker = L.marker([data.lat, data.lon]).addTo(map);
  marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
 
  //доблавение маркера в массив
  listMarker.push(marker);
}

/**
 * При подтвержении добавления новой метки
 * @function applyConfirmationAddLabel
 */
function applyConfirmationAddLabel() {
    //идентификатор формы
    var idForm = '#confirmation-add-label';
    //скрыть форму
    hideForm(idForm);
    //класс элемента для отображения
    var element = '.scan-label';
    //показать уведомление
    showAlert(element);
    //очистка карты от меток
    clearMapFromLabel();
    //установка высоты карты
    setHeightMap();
}

/**
 * Скрыть модульное окно
 * @function hideForm
 * @param {String} id Идентификатор формы
 */
function hideForm(id) {
    //скрыть форму
    $(id).modal('toggle');
}

/**
 * Показать подсказку
 * @function showAlert
 * @param {String} element Указание элемента для отображения
 */
function showAlert(element) {
    //отобразить элемент
    $(element).css('display', 'flex');
}

/**
 * Скрыть подкскаску
 * @function hideAlert
 * @param {String} element  Указание элемента для скрытия
 */
function hideAlert(element) {
    //скрыть элемент
    $(element).css('display', 'none');
}

/**
 * Установка высоты карты с подсказкой
 * @function setHeightMap
 * @param {String} element Указание элемента для получения его высоты
 */
function setHeightMap(element) {
    var heightAlert = $(element).height();
    $('#map').height('88vh');
}

/**
 * При подтверждении "Показать все метки"
 * @function applyConfirmationShowAlLabel
 */
function applyConfirmationShowAlLabel() {
    hideForm('#confirmation-show-all-label')
    //оистка карты от меток
    clearMapFromLabel();
    //получение всех меток из БД
    getAllLabel();
}

/**
 * Получение всех меток
 * @function getAllLabel
 */
function getAllLabel() {
    //отправка события для получения меток
    oWebViewInterface.emit('getAllLabel');
    //прослушивание события для получения всех меток
    oWebViewInterface.on('resultAllLabel', function(res) {
        //добалвение всех меток на карту
        addAllMarker(res);
    });
}

/**
 * Добавление всех маркеров
 * @function addAllMarker
 * @param {Array} list Массив со всеми метками из БД
 */
function addAllMarker(list) {
    //очищение массива для хранения маркеров
    listMarker = [];
    //проверка длины массива
    if (list.length > 0) {
        //обход всех щначений в цикле
        for (i = 0; i <= list.length - 1; i++) {
            //создание макркера на карте
            createMarker(list[i]);
        }
    }
}

/**
 * Создание маркера
 * @function createMarker
 * @param {Object} data Данные о меткер
 */
function createMarker(data) {
    //создание нового маркера на карте
    marker = L.marker([data.lat, data.lon]).addTo(map);
    //marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    //доблавение маркера в массив
    listMarker.push(marker);
}

/**
 * Очистка карты от меток
 * @function clearMapFromLabel
 */
function clearMapFromLabel() {
    //удлаение элемента хранящего карту
    $('#map').remove();
    //создание элемента для хранеия карты
    $(' <div id="map"></div>').appendTo('.blc-map');
    //установка высоты карты
    heightBody();
    //загрузка карты в элемент
    LoadlayerMap();
}

/**
 * Формирование карты и вовод ее в элемент #map
 * @function LoadlayerMap
 */
function LoadlayerMap() {
    var image = 'map'; //папка с картами
    var width = 6025;
    var height = 4174;
    var maxLevel = 5;
    var minLevel = 0;
    var orgLevel = 5;
    var tileWidth = 256 * Math.pow(2, orgLevel);
    var radius = tileWidth / 2 / Math.PI;
    var rx = width - tileWidth / 2;
    var ry = -height + tileWidth / 2;
    var west = -180;
    var east = (180 / Math.PI) * (rx / radius);
    var north = 85.05;
    var south = (360 / Math.PI) * (Math.atan(Math.exp(ry / radius)) - Math.PI / 4);
    var rc = (tileWidth / 2 + ry) / 2;
    var centerLat = (360 / Math.PI) * (Math.atan(Math.exp(rc / radius)) - Math.PI / 4);
    var centerLon = (west + east) / 2;
    var bounds = [[south, west], [north, east]];

    map = new L.Map('map', {
        maxBounds: bounds
    });
    L.tileLayer(image + '/{z}-{x}-{y}.jpg', {
        maxZoom: maxLevel,
        minZoom: minLevel,
        opacity: 1.0,
        zIndex: 1,
        noWrap: true,
        bounds: bounds
    }).addTo(map);

    var zoom = map.getBoundsZoom(bounds);
    var center = new L.latLng(centerLat, centerLon);

    map.setView(center, 2);
}

/**
 * Получение высоты экрана и установка высоты для карты
 * @function heightBody
 */
function heightBody() {
    $('#map').height($(window).height());
}

/**
 * Поиск меток считывателем
 * @function scanLabel
 */
function scanLabel() {
    if (arrFindLabel.length > 0) {
        $('#form-some-label').modal('toggle');
        for (i = 0; i <= arrFindLabel.length - 1; i++) {
            $(
                '<li class="list-group-item list-group-item-action" onClick="selectFindLabel(this)">' +
                    arrFindLabel[i] +
                    '</li>'
            ).appendTo('#list-find-labels');
        }
    }
    //Расскомментировать для обмена
    /*     oWebViewInterface.emit('getUHF');
    oWebViewInterface.on('resultUHF', function(list) {
        console.log(list);
    }); */
}

/**
 * При выборе метки при поиске доавбления новой метки
 * @function selectFindLabel
 * @param {Object} element Выбранный элемент
 */
function selectFindLabel(element) {
    //очистка списка
    $('#list-find-labels').empty();
    //удаление всех выдленеий элементов
    $('#list-find-labels li').removeClass('active');
    //добавление выдлеения для элемента
    $(element).addClass('active');
    //получение серийного номера
    var SRN = $(element).text();
    //скрыть форму
    hideForm('#form-some-label');
    //при нажатии на карту
    //скрыть уведомление "Скинирование меток"
    hideAlert('.scan-label');
    showAlert('.alert-add');
    map.on('click', function(e) {
        //показать всплывающую поксказку
        popup
            .setLatLng(e.latlng)
            .setContent('Метка будет находиться здесь')
            .openOn(map);
        //добавление значения координат в глобальную переменную
        coords = { SRN: SRN, lat: e.latlng.lat, lon: e.latlng.lng };
        //показать уведомление "добавить метку"
      $('#addLabel').prop('disabled', false)
    });

    //отправка события через WebView интерфейс с серийным номером
    /*     oWebViewInterface.emit('addNewLabel', SRN);
    //прослышивания события с получение рузальтата добавленияновой метики
    oWebViewInterface.on('resultAddNewLabel', function(res){

      
    }) */
}

function sendDataNewLabel() {
    oWebViewInterface.on('resultSendDataNewLabel', function(resp) {
      if(resp.err){
        $('#errText').text(resp.err)
        showAlert('.alert-err-add')
        hideAlert('.alert-add');
      }
      else{
        $('#successText').text(resp.data)
        showAlert('.success')
      }
    });
    oWebViewInterface.emit('sendDataNewLabel', coords);
}



var arrLabels = [
    {
        id: 23,
        SRN: '028800000000000000000857',
        lat: '81.106811',
        lon: '4.174805'
    },
    {
        id: 9,
        SRN: '028800000000000000000415',
        lat: '25.005973',
        lon: '-31.992188'
    },
    {
        id: 10,
        SRN: '028800000000000000000414',
        lat: '29.53523',
        lon: '-38.935547'
    },
    {
        id: 12,
        SRN: '028800000000000000000413',
        lat: '47.813155',
        lon: '-14.150391'
    },
    {
        id: 5,
        SRN: '028800000000000000000411',
        lat: '79.286313',
        lon: '72.070313'
    },
    {
        id: 6,
        SRN: '028800000000000000000410',
        lat: '80.459509',
        lon: '70.488281'
    },
    {
        id: 19,
        SRN: '02880000000000000000040F',
        lat: '83.287985',
        lon: '57.041016'
    },
    {
        id: 8,
        SRN: '028800000000000000000409',
        lat: '81.634149',
        lon: ' -6.064453'
    },
    {
        id: 7,
        SRN: '028800000000000000000408',
        lat: '84.289079',
        lon: '-7.250977'
    },
    {
        id: 13,
        SRN: '028800000000000000000407',
        lat: '45.890008',
        lon: '7.03125'
    },
    {
        id: 11,
        SRN: '028800000000000000000406',
        lat: '43.707594',
        lon: '3.779297'
    },
    {
        id: 4,
        SRN: '028800000000000000000405',
        lat: '58.562523',
        lon: '-1.40625'
    },
    {
        id: 18,
        SRN: '0288000000000000000003FE',
        lat: '81.569968',
        lon: '59.106445'
    },
    {
        id: 16,
        SRN: '0288000000000000000003FC',
        lat: '81.518272',
        lon: '52.602539'
    },
    {
        id: 17,
        SRN: '0288000000000000000003F7',
        lat: '83.720353',
        lon: '50.581055'
    },
    {
        id: 21,
        SRN: '0288000000000000000003F6',
        lat: '83.079373',
        lon: '59.941406'
    },
    {
        id: 14,
        SRN: '0288000000000000000003F4',
        lat: '81.47278',
        lon: '49.658203'
    },
    {
        id: 22,
        SRN: '0288000000000000000003F1',
        lat: '81.589274',
        lon: '2.8125'
    },
    {
        id: 20,
        SRN: '0288000000000000000003F0',
        lat: '81.697844',
        lon: '62.050781'
    },
    {
        id: 15,
        SRN: '0288000000000000000003EF',
        lat: '83.895719',
        lon: '47.109375'
    },
    {
        id: 24,
        SRN: '0101010021997FFFFF000028',
        lat: '80.746492',
        lon: '12.172852'
    }
];

var arrFindLabel = ['028800000000000000000403', '0288000000000000000003FA', '0101010021997FFFFF000029'];
