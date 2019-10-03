/**
 * Модуль описания клиентсвого приложения(Web)
 * @module func
 */

var map;
var listMarker = [];
var marker;
var oWebViewInterface = window.nsWebViewInterface;

//при загрузке страницы
$(document).ready(function() {
    //обработка нажатия кнопок меню
    clickButtonMenu();
});

/**
 * События при нажитии на кнпки меню
 * @functon clickButton
 */
function clickButtonMenu() {
    $('#newLabel').on('click', function() {
        //отображение модлаьного окна для подтверждения
        $('#confirmation-add-label').modal();
        //при нажатии на кнопку "ДА" у окна подтверждения действия добавления метки
    });
    $('#showAllLabel').on('click', function() {
        //отображение модлаьного окна для подтверждения
        $('#confirmation-show-all-label').modal();
        //при нажатии на кнопку "ДА" у окна подтверждения действия добавления метки
    });
}

/**
 * При подтвержении добавления новой метки
  */
function applyConfirmationAddLabel(){
  clearMapFromLabel();
}

/**
 * При подтверждении "Показать все метки"
  */
function applyConfirmationShowAlLabel() {
    clearMapFromLabel();
    getAllLabel();
}

/**
 * Получение всех меток
 * @function getAllLabel
 */
function getAllLabel() {
    oWebViewInterface.emit('getAllLabel');
    oWebViewInterface.on('resultAllLabel', function(res) {
        addAllMarker(res);
    });
    //addAllMarker(arrLabels)
    /*     oWebViewInterface.on('resultAllLabels', function (res) {
            console.log("TCL: getAllLabel -> res", res)

        }) */
}

function addAllMarker(list) {
    listMarker = [];
    if (list.length > 0) {
        for (i = 0; i <= list.length - 1; i++) {
            createMarker(list[i]);
        }
    }
}

function createMarker(data) {
    marker = L.marker([data.lat, data.lon]).addTo(map);
    console.log(marker);
    listMarker.push(marker);
}

/**
 * Очистка карты от меток
 * @function clearMapFromLabel
 */
function clearMapFromLabel() {
    $('#map').remove();
    $(' <div id="map"></div>').appendTo('.blc-map');
    heightBody();
    LoadlayerMap();
}

/* вывод карты  */
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
    /* ЗАГРУЗКА КАРТЫ */
    function LoadMap() {
        L.tileLayer(image + '/{z}-{x}-{y}.jpg', {
            maxZoom: maxLevel,
            minZoom: minLevel,
            opacity: 1.0,
            zIndex: 1,
            noWrap: true,
            bounds: bounds
        }).addTo(map);
    }
    LoadMap(); //загрузка карты
    var zoom = map.getBoundsZoom(bounds);
    var center = new L.latLng(centerLat, centerLon);

    map.setView(center, 2);
}

heightBody();
LoadlayerMap();

function heightBody() {
    $('#map').height($(window).height());
}

// register listener for any event from native app
/* oWebViewInterface.on('listUHF', function (data) {
    console.log(data)
});
 */

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
