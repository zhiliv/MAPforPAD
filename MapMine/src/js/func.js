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
  //при нажатии на кнопку "Добаление метки"
    $('#newLabel').on('click', function() {
      //скрыть уведомление
        hideAlert('.alert');
        //отображение модлаьного окна для подтверждения
        $('#confirmation-add-label').modal();
    });
    //при нажатии на кнопку "Покащать все метики"
    $('#showAllLabel').on('click', function() {
      //скрыть уведомление
        hideAlert('.alert');
        //отображение модлаьного окна для подтверждения
        $('#confirmation-show-all-label').modal();
    });
    //при нажатии на "Удаление метики"
    $('#deleteSelectLabel').on('click', function() {
      //скрыть уведомление
      hideAlert('.alert');
      //отображение модлаьного окна для подтверждения
        $('#confirmation-delete-label').modal();
    });
    //при нажатии на кнопку "Поиск метки"
    $('#inventory').on('click', function(){
      hideAlert('.alert');
      $('#confirmation-inventory-label').modal()
    })
    $('#setting').on('click', function(){
      hideAlert('.alert');
      getSettingDB()
      $('#setting-modal').modal()
    })
    $('#save-setting').on('click', function(){
      var obj = {
        host: $('#host').val(),
        database: $('#database').val(),
        user: $('#user').val(),
        password: $('#password').val(),
        port: $('#port').val()
      }
      oWebViewInterface.emit('saveSetting', obj)
      oWebViewInterface.on('resultSaveSetting', function() {
        $('#successText').text('Данные успешно обнолвены')
        $('#alert-err-add').show();
      })
    })
    $('#getDataToServer').on('click', function(){
      $('#confirmation-syncGet-label').modal()
      getDataToServer()
    })
}


function getDataToServer(){
    oWebViewInterface.emit('getDataToServer')
 }
 
 /* отправка POST запросов */
 function getDataOfBase(srv){
/*    const result = $.ajax({
     type: 'POST',
     url:  'http://'+srv+'/get',
     response: 'XML',
     data: { }
   });
   console.log(result)
   return result; */
 };
 
 

/**
 * Получение напстроек БД
 * @function getSettingDB
  */
 function getSettingDB(){
  oWebViewInterface.on('resultGetSettingDB', function(config){
    console.log(config)
   $('#host').val(config.host)
   $('#database').val(config.database)
   $('#user').val(config.user)
   $('#password').val(config.password)
  })
   oWebViewInterface.emit('getSettingDB')

 }


/**
 * применение инвентаризации метки
 * @function applyConfirmationInventoryLabel
  */
function applyConfirmationInventoryLabel(){
  $('#confirmation-inventory-label').modal('toggle');
  getAllLabelForInventory()
}

/**
 * Получение всех меток
 * @function getAllLabel
 */
function getAllLabelForInventory() {
  //отправка события для получения меток
  oWebViewInterface.emit('getAllLabel');
  //прослушивание события для получения всех меток
  oWebViewInterface.on('resultAllLabel', function(res) {
      //добалвение всех меток на карту
      addAllMarkerForInventory(res);
  });
}

/**
 * Подтверждение удаления метки
 * @function applyConfirmationDeleteLabel
  */
function applyConfirmationDeleteLabel() {
    hideForm('#confirmation-delete-label');
    //оистка карты от меток
    clearMapFromLabel();
    //получение всех меток из БД
    addAllMarkerForDelete();
}

/**
 * Добавление всех маркеров
 * @function addAllMarker
 * @param {Array} list Массив со всеми метками из БД
 */
function addAllMarkerForInventory(list) {
  //очищение массива для хранения маркеров
  listMarker = [];
  //проверка длины массива
  if (list.length > 0) {
      //обход всех щначений в цикле
      for (i = 0; i <= list.length - 1; i++) {
          //создание макркера на карте
          createMarkerForInventiry(list[i]);
      }
  }
}

/**
 * Создание маркера
 * @function createMarker
 * @param {Object} data Данные о меткер
 */
function createMarkerForInventiry(data) {
  //создание нового маркера на карте
  marker = L.marker([data.lat, data.lon]).addTo(map);
  //добалвение всплывающей подсказки для маркера
  marker.bindPopup('<h5>Найти метку?</h5><p class="text-center"><button type="button" class="btn-sm btn-success inventoryLabel" lat="'+data.lat+'" lon="'+data.lon+'" SRN="'+data.SRN+'">Найти</button></p>'
  ).openPopup();
  //при нажатии на уопку "Удалить"
   $('.inventoryLabel').on('click', function(el){
     hideAlert('.alert-err-add ')
    oWebViewInterface.emit('getUHFInventory');
    //прослушивание события для получения всех меток
    oWebViewInterface.on('resultUHFInventory', function(list) {
      for(var i = 0; i <= list.length-1; i++){
        if(list[i]== $(el.target).attr('SRN')){
          $('#successText').text('Метка найдена')
          showAlert('.alert-ok')
          marker.remove()
          var lat = $(el.target).attr('lat')
          var lon = $(el.target).attr('lon')
          var greenIcon = new L.Icon({
            iconUrl: './markers/marker-icon-2x-green.png',
            shadowUrl: './markers/marker-icon-green.png',
            iconSize: [25, 41],
            popupAnchor: [1, -34],
            shadowSize: [25, 41]
          });
          marker = L.marker([lat, lon],  {icon: greenIcon}).addTo(map);
        }
      }
    }); 
  }) 
  //доблавение маркера в массив
  listMarker.push(marker);
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
    //добалвение всплывающей подсказки для маркера
    marker.bindPopup('<h5>Удалить метку?</h5><p class="text-center"><button type="button" class="btn-sm btn-danger deleteLabel" SRN="'+data.SRN+'">Удалить</button></p>'
    ).openPopup();
    //при нажатии на уопку "Удалить"
    $('.deleteLabel').on('click', function(el){
      //получение идентификатора метки
      $('#uidLabel').text($(el.target).attr('SRN'))
      //вызов формы подтверждения удаления метки
      $('#confirmation-delete-select-label').modal()
    })
    //доблавение маркера в массив
    listMarker.push(marker);
}

/**
 * Подтверждение удаления метки
 * @function applyDeleteSelectLabel
  */
function applyDeleteSelectLabel(){
  //если модальное окно отыкрыто, закрыть
  $('#confirmation-delete-select-label').modal('toggle');
      //отправка события для получения меток
      //получение идентификатора метки
      var SRN = $('#uidLabel').text();
      //отправка события для удаления метки
      oWebViewInterface.emit('DeleteSelectLabel', SRN);
      //прослушивание события для получения всех меток
      oWebViewInterface.on('resultDeleteSelectLabel', function(resp) {
          //добалвение всех меток на карту
          if(resp.err){
            //заполняем текст ошибки
            $('#errText').text(resp.err);
            //покаать уведомление
            showAlert('.alert-err-add');
          }
          else{
            //текст для успешного выполнения
            $('#successText').text(resp.data);
            //показать уведомление
            showAlert('.alert-ok');
            //очистка карты
            clearMapFromLabel();
            //получение всех меток
            getAllLabel()
            //установка высоты карты
            setHeightMap();
          }
      });
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
    $('#map').height('86vh')
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
    hideForm('#confirmation-show-all-label');
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
  $('#btn-scan').prop('disabled', true)
  $('#map').prop('disabled', true)
  oWebViewInterface.on('resultUHF', function(list) {
    $('#btn-scan').prop('disabled', false)
    $('#map').prop('disabled', false)
    if (list.length > 0) {
      $('#form-some-label').modal('toggle');
      for (i = 0; i <= list.length - 1; i++) {
          $(
              '<li class="list-group-item list-group-item-action" onClick="selectFindLabel(this)">' +
              list[i] +
                  '</li>'
          ).appendTo('#list-find-labels');
      }
  }
  else{
    hideAlert('.blc-map')
    $('#errText').text('Меток не обнаружено')
    showAlert('.alert-err-add')
  }
  }); 
    oWebViewInterface.emit('getUHF');
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
        $('#addLabel').prop('disabled', false);
    });

    //отправка события через WebView интерфейс с серийным номером
    /*     oWebViewInterface.emit('addNewLabel', SRN);
    //прослышивания события с получение рузальтата добавленияновой метики
    oWebViewInterface.on('resultAddNewLabel', function(res){

      
    }) */
}


/**
 * Отправка данных на серверную часть для удаления метки
 * @function sendDataNewLabel
  */
function sendDataNewLabel() {
  //прослушивание события для получения результата удаления метики
    oWebViewInterface.on('resultSendDataNewLabel', function(resp) {
      //проверка на ошибки
        if (resp.err) {
          //заполнение текста ошибки
            $('#errText').text(resp.err);
            //показать уведомление
            showAlert('.alert-err-add');
            //скрыть уведомеление
            hideAlert('.alert-add');
        } else {
          //скрыть уведомление
           hideAlert('.alert-add')
           //текст успешного выполнения
            $('#successText').text(resp.data);
            //показать ведомеление
            showAlert('.alert-ok');
        }
    });
    //отправка события для удаления мтеки
    oWebViewInterface.emit('sendDataNewLabel', coords);
}
