function toCamelCase(array) { //ф-ия принимает массив объектов
  return array.map((dataObj) => JSON.parse(
    JSON.stringify(dataObj).trim().replace(/("\w+":)/g,
      (keys) => keys.replace(/[A-Z]+/g, (letter, index) => index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`)
        .replace(/(.(_|-|\s)+.)/g, (subStr) => subStr[0]+(subStr[subStr.length-1].toUpperCase()))),
  ),
  );
}

export default toCamelCase;
