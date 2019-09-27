
const createViewModel = require("./main-view-model").createViewModel,
webViewInterfaceModule = require('nativescript-webview-interface');

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


exports.onNavigatingTo = onNavigatingTo;
exports.pageLoaded = pageLoaded;
//указание onFindUHF как экспортной