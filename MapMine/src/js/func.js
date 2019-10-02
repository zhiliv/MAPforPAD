/**
 * Модуль описания клиентсвого приложения(Web)
 * @module func
 */

var map;
var marker;

//при загрузке страницы
$(window).on('load', function () {
    //обработка нажатия кнопок меню
    clickButtonMenu()
})

/**
 * События при нажитии на кнпки меню
 * @functon clickButton
 */
function clickButtonMenu() {
    $('#newLabel').on('click', function () {
        //отображение модлаьного окна для подтверждения
        $('#confirmation-add-label').modal()
        //при нажатии на кнопку "ДА" у окна подтверждения действия добавления метки
        $('#confirmation-add-label .apply').on('click', function () {
            //TODO добавить код
        })
    })

}

/**
 * Очистка карты от меток
 * @function clearMapFromLabel 
 */
function clearMapFromLabel() {

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
    var south =
        (360 / Math.PI) * (Math.atan(Math.exp(ry / radius)) - Math.PI / 4);
    var rc = (tileWidth / 2 + ry) / 2;
    var centerLat =
        (360 / Math.PI) * (Math.atan(Math.exp(rc / radius)) - Math.PI / 4);
    var centerLon = (west + east) / 2;
    var bounds = [
        [south, west],
        [north, east]
    ];

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
    };
    LoadMap(); //загрузка карты
    var zoom = map.getBoundsZoom(bounds);
    var center = new L.latLng(centerLat, centerLon);

    map.setView(center, 2);

};

heightBody()
LoadlayerMap()

function heightBody() {
    $('#map').height($(window).height())
}


var oWebViewInterface = window.nsWebViewInterface;
// register listener for any event from native app
oWebViewInterface.on('listUHF', function (data) {
    console.log(data)
});
