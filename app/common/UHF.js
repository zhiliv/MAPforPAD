/**
 * Модуль для получение данных со считывателя
 * @member common
 */

//библиотека для работы с данными
const _ = require('underscore'),
  //библиотека для работы с ассинхронными функциями
  async = require("async"),
    q = require('q');

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
