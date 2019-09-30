const createViewModel = require("./main-view-model").createViewModel,
    webViewInterfaceModule = require('nativescript-webview-interface'),
    UHF = require('./common/UHF')

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = createViewModel();
}

function pageLoaded(args) {
    page = args.object;
    setupWebViewInterface(page)
}

// инизиализация WebView интерфейса
function setupWebViewInterface(page) {
    var webView = page.getViewById('webView');
    oWebViewInterface = new webViewInterfaceModule.WebViewInterface(webView, 'file:///storage/emulated/0/MapMine/src/index.html');
}


UHF.getArr().then(list => {
    console.log("TCL: onFindUHF -> list", list)
    //отправить данные в WebVIEW
    oWebViewInterface.emit('listUHF', list)
})

exports.onNavigatingTo = onNavigatingTo;
exports.pageLoaded = pageLoaded;
//указание onFindUHF как экспортной
