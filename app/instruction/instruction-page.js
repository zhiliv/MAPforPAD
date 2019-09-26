const app = require("tns-core-modules/application");
const UHF = require('./../common/UHF')
const HomeViewModel = require("./instruction-view-model");


UHF.getArr().then(list => {
    console.log("TCL: onFindUHF -> list", list)
    console.log("TCL: list", list)
    //отправить данные в WebVIEW
    //oWebViewInterface.emit('listUHF', list)
})

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
