webpackHotUpdate("bundle",{

/***/ "./common/UHF.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * Модуль для получение данных со считывателя
 * @member common
 */

//библиотека для работы с данными
const _ = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'underscore'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
  //библиотека для работы с ассинхронными функциями
  async = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'async'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())),
    q = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module 'q'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

/**
 * Объект для работы со считывателем
 * @memberof common
 */
var UHF = {
  //создание нового экземлаяра
  query: new com.uhfcl.UHFdata(),

  /** 
   * Удаление лишних симоголов из сторки
   */
  delCharOfString: data => {
    //преобразование в текст
    let list = data.toString()
    //удаление первого симовала
    list = list.replace('[', '')
    //удаление последнего симола
    list = list.replace(']', '')
    //возврат результата
    return list;
  },

  /**
   * получение денных со считывателя
   * @member common
   */
  getDataOfUHF: () => {
    //получение пмассива со считывателя
    return UHF.query.get()
  },

  /**
   * Функция получения метток со считвател
   * @memberof common
   */
  getArr: async () => {
    //создание promise
    let result = q.defer()
    //объявление массива
    let arr = [];
    //переменная для инкремента в цикле
    let i = 0;
    //цикл запросов к считывателю
    while (i <= 5) {
      //получение данных со считывателя
      let data = UHF.getDataOfUHF()
      //обработка полученных данных
      let list = await UHF.delCharOfString(data)
      //разбиенеи ни массив
      list = await list.split(',');
      //обход значений рещультата
      await async.eachOfSeries(list, async (row, ind) => {
        //поиск элемента в массиве
        let check = await _.indexOf(arr, row)
        //проверка значения 
        if (check == -1) {
          //добавление в массив
          arr.push(row) 
        } 
        //проверка а последний элемент полученного массива
        if (ind == list.length - 1) {
          //инкермент 
          i++
        }
      })
    }
    //доьавление рещультата в promise
    result.resolve(arr)
    //возврат результата
    return result.promise
  }
}


//экспорт объекта
module.exports = UHF;
; 
if ( true && global._isModuleLoadedForUI && global._isModuleLoadedForUI("./common/UHF.js") ) {
    
    module.hot.accept();
    module.hot.dispose(() => {
        global.hmrRefresh({ type: "script", path: "./common/UHF.js" });
    });
} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("../node_modules/webpack/buildin/global.js")))

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9jb21tb24vVUhGLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVLG1CQUFPLENBQUMsb0lBQVk7QUFDOUI7QUFDQSxVQUFVLG1CQUFPLENBQUMsK0hBQU87QUFDekIsUUFBUSxtQkFBTyxDQUFDLDJIQUFHOztBQUVuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLEM7QUFDQSxJQUFJLEtBQVU7O0FBRWQ7QUFDQTtBQUNBLDJCQUEyQiwwQ0FBMEM7QUFDckUsS0FBSztBQUNMLEMiLCJmaWxlIjoiYnVuZGxlLjBkMzUyNjU0YjFhZjEyNWU0OTAwLmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog0JzQvtC00YPQu9GMINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40LUg0LTQsNC90L3Ri9GFINGB0L4g0YHRh9C40YLRi9Cy0LDRgtC10LvRj1xyXG4gKiBAbWVtYmVyIGNvbW1vblxyXG4gKi9cclxuXHJcbi8v0LHQuNCx0LvQuNC+0YLQtdC60LAg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQtNCw0L3QvdGL0LzQuFxyXG5jb25zdCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpLFxyXG4gIC8v0LHQuNCx0LvQuNC+0YLQtdC60LAg0LTQu9GPINGA0LDQsdC+0YLRiyDRgSDQsNGB0YHQuNC90YXRgNC+0L3QvdGL0LzQuCDRhNGD0L3QutGG0LjRj9C80LhcclxuICBhc3luYyA9IHJlcXVpcmUoXCJhc3luY1wiKSxcclxuICAgIHEgPSByZXF1aXJlKCdxJyk7XHJcblxyXG4vKipcclxuICog0J7QsdGK0LXQutGCINC00LvRjyDRgNCw0LHQvtGC0Ysg0YHQviDRgdGH0LjRgtGL0LLQsNGC0LXQu9C10LxcclxuICogQG1lbWJlcm9mIGNvbW1vblxyXG4gKi9cclxudmFyIFVIRiA9IHtcclxuICAvL9GB0L7Qt9C00LDQvdC40LUg0L3QvtCy0L7Qs9C+INGN0LrQt9C10LzQu9Cw0Y/RgNCwXHJcbiAgcXVlcnk6IG5ldyBjb20udWhmY2wuVUhGZGF0YSgpLFxyXG5cclxuICAvKiogXHJcbiAgICog0KPQtNCw0LvQtdC90LjQtSDQu9C40YjQvdC40YUg0YHQuNC80L7Qs9C+0LvQvtCyINC40Lcg0YHRgtC+0YDQutC4XHJcbiAgICovXHJcbiAgZGVsQ2hhck9mU3RyaW5nOiBkYXRhID0+IHtcclxuICAgIC8v0L/RgNC10L7QsdGA0LDQt9C+0LLQsNC90LjQtSDQsiDRgtC10LrRgdGCXHJcbiAgICBsZXQgbGlzdCA9IGRhdGEudG9TdHJpbmcoKVxyXG4gICAgLy/Rg9C00LDQu9C10L3QuNC1INC/0LXRgNCy0L7Qs9C+INGB0LjQvNC+0LLQsNC70LBcclxuICAgIGxpc3QgPSBsaXN0LnJlcGxhY2UoJ1snLCAnJylcclxuICAgIC8v0YPQtNCw0LvQtdC90LjQtSDQv9C+0YHQu9C10LTQvdC10LPQviDRgdC40LzQvtC70LBcclxuICAgIGxpc3QgPSBsaXN0LnJlcGxhY2UoJ10nLCAnJylcclxuICAgIC8v0LLQvtC30LLRgNCw0YIg0YDQtdC30YPQu9GM0YLQsNGC0LBcclxuICAgIHJldHVybiBsaXN0O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqINC/0L7Qu9GD0YfQtdC90LjQtSDQtNC10L3QvdGL0YUg0YHQviDRgdGH0LjRgtGL0LLQsNGC0LXQu9GPXHJcbiAgICogQG1lbWJlciBjb21tb25cclxuICAgKi9cclxuICBnZXREYXRhT2ZVSEY6ICgpID0+IHtcclxuICAgIC8v0L/QvtC70YPRh9C10L3QuNC1INC/0LzQsNGB0YHQuNCy0LAg0YHQviDRgdGH0LjRgtGL0LLQsNGC0LXQu9GPXHJcbiAgICByZXR1cm4gVUhGLnF1ZXJ5LmdldCgpXHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICog0KTRg9C90LrRhtC40Y8g0L/QvtC70YPRh9C10L3QuNGPINC80LXRgtGC0L7QuiDRgdC+INGB0YfQuNGC0LLQsNGC0LXQu1xyXG4gICAqIEBtZW1iZXJvZiBjb21tb25cclxuICAgKi9cclxuICBnZXRBcnI6IGFzeW5jICgpID0+IHtcclxuICAgIC8v0YHQvtC30LTQsNC90LjQtSBwcm9taXNlXHJcbiAgICBsZXQgcmVzdWx0ID0gcS5kZWZlcigpXHJcbiAgICAvL9C+0LHRitGP0LLQu9C10L3QuNC1INC80LDRgdGB0LjQstCwXHJcbiAgICBsZXQgYXJyID0gW107XHJcbiAgICAvL9C/0LXRgNC10LzQtdC90L3QsNGPINC00LvRjyDQuNC90LrRgNC10LzQtdC90YLQsCDQsiDRhtC40LrQu9C1XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICAvL9GG0LjQutC7INC30LDQv9GA0L7RgdC+0LIg0Log0YHRh9C40YLRi9Cy0LDRgtC10LvRjlxyXG4gICAgd2hpbGUgKGkgPD0gNSkge1xyXG4gICAgICAvL9C/0L7Qu9GD0YfQtdC90LjQtSDQtNCw0L3QvdGL0YUg0YHQviDRgdGH0LjRgtGL0LLQsNGC0LXQu9GPXHJcbiAgICAgIGxldCBkYXRhID0gVUhGLmdldERhdGFPZlVIRigpXHJcbiAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutCwINC/0L7Qu9GD0YfQtdC90L3Ri9GFINC00LDQvdC90YvRhVxyXG4gICAgICBsZXQgbGlzdCA9IGF3YWl0IFVIRi5kZWxDaGFyT2ZTdHJpbmcoZGF0YSlcclxuICAgICAgLy/RgNCw0LfQsdC40LXQvdC10Lgg0L3QuCDQvNCw0YHRgdC40LJcclxuICAgICAgbGlzdCA9IGF3YWl0IGxpc3Quc3BsaXQoJywnKTtcclxuICAgICAgLy/QvtCx0YXQvtC0INC30L3QsNGH0LXQvdC40Lkg0YDQtdGJ0YPQu9GM0YLQsNGC0LBcclxuICAgICAgYXdhaXQgYXN5bmMuZWFjaE9mU2VyaWVzKGxpc3QsIGFzeW5jIChyb3csIGluZCkgPT4ge1xyXG4gICAgICAgIC8v0L/QvtC40YHQuiDRjdC70LXQvNC10L3RgtCwINCyINC80LDRgdGB0LjQstC1XHJcbiAgICAgICAgbGV0IGNoZWNrID0gYXdhaXQgXy5pbmRleE9mKGFyciwgcm93KVxyXG4gICAgICAgIC8v0L/RgNC+0LLQtdGA0LrQsCDQt9C90LDRh9C10L3QuNGPIFxyXG4gICAgICAgIGlmIChjaGVjayA9PSAtMSkge1xyXG4gICAgICAgICAgLy/QtNC+0LHQsNCy0LvQtdC90LjQtSDQsiDQvNCw0YHRgdC40LJcclxuICAgICAgICAgIGFyci5wdXNoKHJvdykgXHJcbiAgICAgICAgfSBcclxuICAgICAgICAvL9C/0YDQvtCy0LXRgNC60LAg0LAg0L/QvtGB0LvQtdC00L3QuNC5INGN0LvQtdC80LXQvdGCINC/0L7Qu9GD0YfQtdC90L3QvtCz0L4g0LzQsNGB0YHQuNCy0LBcclxuICAgICAgICBpZiAoaW5kID09IGxpc3QubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgLy/QuNC90LrQtdGA0LzQtdC90YIgXHJcbiAgICAgICAgICBpKytcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvL9C00L7RjNCw0LLQu9C10L3QuNC1INGA0LXRidGD0LvRjNGC0LDRgtCwINCyIHByb21pc2VcclxuICAgIHJlc3VsdC5yZXNvbHZlKGFycilcclxuICAgIC8v0LLQvtC30LLRgNCw0YIg0YDQtdC30YPQu9GM0YLQsNGC0LBcclxuICAgIHJldHVybiByZXN1bHQucHJvbWlzZVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8v0Y3QutGB0L/QvtGA0YIg0L7QsdGK0LXQutGC0LBcclxubW9kdWxlLmV4cG9ydHMgPSBVSEY7XHJcbjsgXG5pZiAobW9kdWxlLmhvdCAmJiBnbG9iYWwuX2lzTW9kdWxlTG9hZGVkRm9yVUkgJiYgZ2xvYmFsLl9pc01vZHVsZUxvYWRlZEZvclVJKFwiLi9jb21tb24vVUhGLmpzXCIpICkge1xuICAgIFxuICAgIG1vZHVsZS5ob3QuYWNjZXB0KCk7XG4gICAgbW9kdWxlLmhvdC5kaXNwb3NlKCgpID0+IHtcbiAgICAgICAgZ2xvYmFsLmhtclJlZnJlc2goeyB0eXBlOiBcInNjcmlwdFwiLCBwYXRoOiBcIi4vY29tbW9uL1VIRi5qc1wiIH0pO1xuICAgIH0pO1xufSAiXSwic291cmNlUm9vdCI6IiJ9